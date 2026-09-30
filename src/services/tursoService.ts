import { createClient, type Client } from '@libsql/client/web';
import type { RegisteredUser } from './authService';
import type { PreBulkDemandOrder, SupplyPledge, FeasibilityReport } from '../types';
import { INITIAL_PRE_BULK_ORDERS } from '../data/buyerDemands';
import { getRegisteredUsers } from './authService';

// Environment credentials for Turso Cloud
const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL || 'libsql://agrixora-krish-x97.aws-ap-south-1.turso.io';
const TURSO_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTA3MTA0NjMsImlkIjoiMDFhMGVlYTgtYjEwMS03MWI4LTliMzQtN2E2MmMwYWU2ODNmIiwia2lkIjoiNGkwXzg1Sy1TeVJ0Qkd2N0JwdlAwYnVJbExxd1NMZnBsQm4tbVpVUjdrVSIsInJpZCI6IjA1NDkwYTBhLTI3ZjMtNDVhNy1iZGIwLTE1MTZlMDdmNDNkMiJ9.YYzVlaB0ZO8QJKlgRXctxE_ZImSPUmV4e9HWbjthHotGT0ATpMr_o4H7TK50KppopJXwcS4M3geZlMMSnJ4hAg';

let tursoClient: Client | null = null;
let isInitialized = false;

/**
 * Get or initialize Turso libSQL client
 */
export const getTursoClient = (): Client | null => {
  if (tursoClient) return tursoClient;

  if (TURSO_URL && TURSO_TOKEN) {
    try {
      // Transform libsql:// to https:// if needed for web HTTP client
      let httpUrl = TURSO_URL.trim();
      if (httpUrl.startsWith('libsql://')) {
        httpUrl = httpUrl.replace('libsql://', 'https://');
      }

      tursoClient = createClient({
        url: httpUrl,
        authToken: TURSO_TOKEN.trim()
      });
      return tursoClient;
    } catch (err) {
      console.warn('⚠️ Turso Client Initialization Failed:', err);
      return null;
    }
  }
  return null;
};

/**
 * Check if Turso Cloud is configured and active
 */
export const isTursoConfigured = (): boolean => {
  return Boolean(TURSO_URL && TURSO_TOKEN);
};

/**
 * Initialize Comprehensive Database Schema on Turso Cloud
 */
export const initTursoSchema = async (): Promise<boolean> => {
  const client = getTursoClient();
  if (!client) return false;
  if (isInitialized) return true;

  try {
    // 1. Users Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        role TEXT NOT NULL,
        role_label TEXT NOT NULL,
        location TEXT NOT NULL,
        state TEXT NOT NULL,
        district TEXT NOT NULL,
        village TEXT,
        enterprise_name TEXT,
        email TEXT,
        margin_capital REAL DEFAULT 50000,
        avatar TEXT,
        created_at TEXT NOT NULL
      );
    `);

    // Ensure columns exist on users table
    try { await client.execute(`ALTER TABLE users ADD COLUMN avatar TEXT;`); } catch {}
    try { await client.execute(`ALTER TABLE users ADD COLUMN village TEXT;`); } catch {}
    try { await client.execute(`ALTER TABLE users ADD COLUMN enterprise_name TEXT;`); } catch {}
    try { await client.execute(`ALTER TABLE users ADD COLUMN email TEXT;`); } catch {}

    // 2. Buyback Demands Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS buyback_demands (
        id TEXT PRIMARY KEY,
        buyer_name TEXT NOT NULL,
        buyer_type TEXT NOT NULL,
        product TEXT NOT NULL,
        category TEXT NOT NULL,
        quality_grade TEXT NOT NULL,
        required_qty REAL NOT NULL,
        committed_qty REAL DEFAULT 0,
        price_per_unit REAL NOT NULL,
        unit TEXT NOT NULL,
        state TEXT NOT NULL,
        district TEXT NOT NULL,
        location TEXT NOT NULL,
        payment_terms TEXT NOT NULL,
        notes TEXT,
        verified_buyer_badge INTEGER DEFAULT 1,
        created_at TEXT NOT NULL
      );
    `);

    // 3. Supply Pledges Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS supply_pledges (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        product TEXT NOT NULL,
        buyer_name TEXT NOT NULL,
        producer_name TEXT NOT NULL,
        producer_contact TEXT NOT NULL,
        producer_village TEXT NOT NULL,
        district TEXT NOT NULL,
        state TEXT NOT NULL,
        quantity_tonnes REAL NOT NULL,
        offered_price REAL NOT NULL,
        status TEXT DEFAULT 'Confirmed',
        created_at TEXT NOT NULL
      );
    `);

    // 4. Feasibility & DPR Reports Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS feasibility_reports (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        business_name TEXT NOT NULL,
        category_name TEXT NOT NULL,
        state TEXT NOT NULL,
        district TEXT NOT NULL,
        block TEXT NOT NULL,
        village TEXT NOT NULL,
        overall_score REAL NOT NULL,
        readiness_verdict TEXT NOT NULL,
        report_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    isInitialized = true;
    console.log('✅ Turso Cloud SQLite Schema Synchronized Successfully!');
    return true;
  } catch (err) {
    console.warn('⚠️ Turso Schema Setup Notice:', err);
    return false;
  }
};

/**
 * Save / Sync Registered User to Turso Cloud
 */
export const syncUserToTurso = async (user: RegisteredUser): Promise<boolean> => {
  const client = getTursoClient();
  if (!client) return false;

  try {
    await initTursoSchema();
    await client.execute({
      sql: `
        INSERT INTO users (
          id, name, phone, role, role_label, location, state, district, 
          village, enterprise_name, email, margin_capital, avatar, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          role = excluded.role,
          role_label = excluded.role_label,
          location = excluded.location,
          state = excluded.state,
          district = excluded.district,
          village = excluded.village,
          enterprise_name = excluded.enterprise_name,
          email = excluded.email,
          margin_capital = excluded.margin_capital,
          avatar = excluded.avatar;
      `,
      args: [
        user.id,
        user.name,
        user.phone,
        user.role,
        user.roleLabel,
        user.location,
        user.state,
        user.district,
        user.village || null,
        user.enterpriseName || null,
        user.email || null,
        user.marginCapital ?? 50000,
        user.avatar || null,
        user.registeredAt || new Date().toISOString()
      ]
    });
    return true;
  } catch (err) {
    console.error('Failed to sync user to Turso Cloud:', err);
    return false;
  }
};

/**
 * Fetch All Users from Turso Cloud
 */
export const fetchUsersFromTurso = async (): Promise<RegisteredUser[]> => {
  const client = getTursoClient();
  if (!client) return [];

  try {
    await initTursoSchema();
    const res = await client.execute('SELECT * FROM users ORDER BY created_at DESC;');
    return res.rows.map(row => ({
      id: String(row.id),
      name: String(row.name),
      phone: String(row.phone),
      role: String(row.role) as any,
      roleLabel: String(row.role_label),
      location: String(row.location),
      state: String(row.state),
      district: String(row.district),
      village: row.village ? String(row.village) : undefined,
      enterpriseName: row.enterprise_name ? String(row.enterprise_name) : undefined,
      email: row.email ? String(row.email) : undefined,
      marginCapital: Number(row.margin_capital) || 50000,
      avatar: row.avatar ? String(row.avatar) : undefined,
      registeredAt: String(row.created_at)
    }));
  } catch (err) {
    console.error('Failed to fetch users from Turso Cloud:', err);
    return [];
  }
};

/**
 * Save Buyback Demand Order to Turso Cloud
 */
export const saveDemandToTurso = async (order: PreBulkDemandOrder): Promise<boolean> => {
  const client = getTursoClient();
  if (!client) return false;

  try {
    await initTursoSchema();
    await client.execute({
      sql: `
        INSERT INTO buyback_demands (
          id, buyer_name, buyer_type, product, category, quality_grade, 
          required_qty, committed_qty, price_per_unit, unit, state, district, 
          location, payment_terms, notes, verified_buyer_badge, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          committed_qty = excluded.committed_qty,
          price_per_unit = excluded.price_per_unit;
      `,
      args: [
        order.id,
        order.buyerName,
        order.buyerType,
        order.product,
        order.category,
        order.qualityGrade,
        order.requiredQuantityTonnes,
        order.committedQuantityTonnes,
        order.offeredPricePerUnit,
        order.unit,
        order.state,
        order.district,
        order.location,
        order.paymentTerms,
        order.notes || '',
        order.verifiedBuyerBadge ? 1 : 0,
        new Date().toISOString()
      ]
    });
    return true;
  } catch (err) {
    console.error('Failed to save demand to Turso Cloud:', err);
    return false;
  }
};

/**
 * Fetch All Buyback Demands from Turso Cloud
 */
export const fetchDemandsFromTurso = async (): Promise<PreBulkDemandOrder[]> => {
  const client = getTursoClient();
  if (!client) return [];

  try {
    await initTursoSchema();
    const res = await client.execute('SELECT * FROM buyback_demands ORDER BY created_at DESC;');
    if (!res.rows || res.rows.length === 0) return [];
    
    return res.rows.map(row => ({
      id: String(row.id),
      buyerName: String(row.buyer_name),
      buyerType: String(row.buyer_type) as any,
      product: String(row.product),
      category: String(row.category),
      qualityGrade: String(row.quality_grade) as any,
      requiredQuantityTonnes: Number(row.required_qty),
      committedQuantityTonnes: Number(row.committed_qty),
      offeredPricePerUnit: Number(row.price_per_unit),
      unit: String(row.unit),
      state: String(row.state),
      district: String(row.district),
      location: String(row.location),
      deliveryDate: 'Flexible Harvest Window',
      pickupMode: 'Farm-gate Collection Center',
      paymentTerms: String(row.payment_terms) as any,
      verifiedBuyerBadge: Boolean(row.verified_buyer_badge),
      notes: String(row.notes || '')
    }));
  } catch (err) {
    console.error('Failed to fetch demands from Turso Cloud:', err);
    return [];
  }
};

/**
 * Save Supply Pledge to Turso Cloud
 */
export const savePledgeToTurso = async (pledge: SupplyPledge): Promise<boolean> => {
  const client = getTursoClient();
  if (!client) return false;

  try {
    await initTursoSchema();
    await client.execute({
      sql: `
        INSERT INTO supply_pledges (
          id, order_id, product, buyer_name, producer_name, producer_contact, 
          producer_village, district, state, quantity_tonnes, offered_price, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          status = excluded.status;
      `,
      args: [
        pledge.id,
        pledge.orderId,
        'Agri Commodity',
        'Institutional Buyer',
        pledge.producerName,
        pledge.producerContact,
        pledge.village,
        'Nashik',
        'Maharashtra',
        pledge.pledgedQuantity,
        18500,
        pledge.status || 'Confirmed',
        pledge.pledgedAt || new Date().toISOString()
      ]
    });
    return true;
  } catch (err) {
    console.error('Failed to save pledge to Turso Cloud:', err);
    return false;
  }
};

/**
 * Save Feasibility & DPR Report to Turso Cloud
 */
export const saveFeasibilityReportToTurso = async (
  report: FeasibilityReport,
  userId?: string
): Promise<boolean> => {
  const client = getTursoClient();
  if (!client) return false;

  try {
    await initTursoSchema();
    await client.execute({
      sql: `
        INSERT INTO feasibility_reports (
          id, user_id, business_name, category_name, state, district, block, village, 
          overall_score, readiness_verdict, report_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          overall_score = excluded.overall_score,
          readiness_verdict = excluded.readiness_verdict,
          report_json = excluded.report_json;
      `,
      args: [
        report.id,
        userId || 'usr_anonymous',
        report.businessName,
        report.categoryName,
        report.location.state,
        report.location.district,
        report.location.block,
        report.location.village,
        report.overallFeasibilityScore,
        report.readinessVerdict,
        JSON.stringify(report),
        report.createdAt || new Date().toISOString()
      ]
    });
    return true;
  } catch (err) {
    console.error('Failed to save feasibility report to Turso Cloud:', err);
    return false;
  }
};

/**
 * Master Sync: Push all initial data, users, and buyer demands to Turso Cloud
 */
export const syncAllDataToTurso = async (): Promise<{ success: boolean; message: string; count: number }> => {
  const client = getTursoClient();
  if (!client) {
    return { success: false, message: 'Turso Cloud Client not initialized', count: 0 };
  }

  try {
    await initTursoSchema();
    let totalSynced = 0;

    // 1. Sync All Registered Users
    const localUsers = getRegisteredUsers();
    for (const u of localUsers) {
      await syncUserToTurso(u);
      totalSynced++;
    }

    // 2. Sync All Initial Pre-Bulk Demand Orders
    for (const order of INITIAL_PRE_BULK_ORDERS) {
      await saveDemandToTurso(order);
      totalSynced++;
    }

    console.log(`🚀 Turso Cloud Master Sync Complete: ${totalSynced} records synchronized.`);
    return {
      success: true,
      message: `Successfully synchronized ${totalSynced} records to Turso Cloud SQLite database!`,
      count: totalSynced
    };
  } catch (err) {
    console.error('Turso Master Sync failed:', err);
    return {
      success: false,
      message: 'Failed to complete Turso Cloud Master Sync',
      count: 0
    };
  }
};
