import { createClient } from '@libsql/client';

const TURSO_URL = process.env.VITE_TURSO_DATABASE_URL || process.env.TURSO_URL || 'https://agrixora-krish-x97.aws-ap-south-1.turso.io';
const TURSO_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_TOKEN || '';

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN
});

const DEMO_USERS = [
  {
    id: 'usr_fpo_patna',
    name: 'Maha-Agri FPO Producer Co.',
    phone: '9876543210',
    role: 'fpo_manager',
    role_label: 'FPO / SHG Federation Leader',
    location: 'Patna, Bihar',
    state: 'Bihar',
    district: 'Patna',
    village: 'Amnabad Gram Panchayat',
    enterprise_name: 'Maha-Agri FPO Cluster',
    email: 'contact@mahaagri.org',
    margin_capital: 150000,
    avatar: '🏢'
  },
  {
    id: 'usr_entrepreneur_nashik',
    name: 'Sahyadri Agro Processing',
    phone: '9876500001',
    role: 'entrepreneur',
    role_label: 'Rural Entrepreneur / Beneficiary',
    location: 'Nashik, Maharashtra',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Janori',
    enterprise_name: 'Sahyadri Tomato Puree Unit',
    email: 'sales@sahyadriagro.in',
    margin_capital: 100000,
    avatar: '🌾'
  },
  {
    id: 'usr_bank_patna',
    name: 'Lead District Bank Appraisal Officer',
    phone: '9876500002',
    role: 'bank_officer',
    role_label: 'Lead District Bank Officer',
    location: 'Patna, Bihar',
    state: 'Bihar',
    district: 'Patna',
    village: 'Bihta',
    enterprise_name: 'State Bank Lead District Office',
    email: 'ldm.patna@sbi.co.in',
    margin_capital: 500000,
    avatar: '🏦'
  },
  {
    id: 'usr_buyer_itc',
    name: 'ITC Agri Business Division',
    phone: '9876500003',
    role: 'institutional_buyer',
    role_label: 'Institutional Off-taker',
    location: 'Varanasi, Uttar Pradesh',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    village: 'Industrial Area',
    enterprise_name: 'ITC Limited Sourcing Hub',
    email: 'procurement@itc.in',
    margin_capital: 10000000,
    avatar: '🏬'
  }
];

const DEMAND_ORDERS = [
  {
    id: 'ORD-TOMATO-500T',
    buyer_name: 'KisanBazaar Agro & Mega Food Park',
    buyer_type: 'Food Processor',
    product: 'Tomato (Hybrid Red / Roma)',
    category: 'Food Processing / Agriculture',
    quality_grade: 'Grade A (Export / Premium)',
    required_qty: 500,
    committed_qty: 325,
    price_per_unit: 18500,
    unit: 'Tonne',
    state: 'Odisha',
    district: 'Khurda',
    location: 'Bhubaneswar Central Cold Hub',
    payment_terms: '100% Direct Bank Transfer within 48h',
    notes: 'Required for industrial ketchup & purée plant. Minimum batch commit 2 Tonnes.',
    verified_buyer_badge: 1
  },
  {
    id: 'ORD-MUSTARD-OIL-120T',
    buyer_name: 'Swadeshi Edible Oils & FMCG Ltd',
    buyer_type: 'Retail Aggregator',
    product: 'Cold-Pressed Mustard Oil',
    category: 'Food Processing',
    quality_grade: 'Grade A (Export / Premium)',
    required_qty: 120,
    committed_qty: 78,
    price_per_unit: 145000,
    unit: 'Tonne',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    location: 'Varanasi Industrial Estate',
    payment_terms: '50% Advance + 50% on Delivery',
    notes: 'Cold-pressed raw expeller oil with <0.5% moisture. Direct procurement contract.',
    verified_buyer_badge: 1
  },
  {
    id: 'ORD-RAW-MILK-250K',
    buyer_name: 'Gramin Dairy Federation (Sahakari Sangh)',
    buyer_type: 'Dairy Federation',
    product: 'Cow & Buffalo Raw Chilled Milk',
    category: 'Dairy',
    quality_grade: 'Grade A (Export / Premium)',
    required_qty: 250,
    committed_qty: 190,
    price_per_unit: 48000,
    unit: 'Tonne',
    state: 'Maharashtra',
    district: 'Satara',
    location: 'Karad Bulk Milk Chilling Center',
    payment_terms: '100% Direct Bank Transfer within 48h',
    notes: 'Minimum 6.5% Fat and 9.0% SNF standard. Testing done on automatic Milkotester.',
    verified_buyer_badge: 1
  },
  {
    id: 'ORD-TURMERIC-80T',
    buyer_name: 'BioSpice Organics Network',
    buyer_type: 'Exporter',
    product: 'Salem / Nizamabad Turmeric Fingers',
    category: 'Agriculture',
    quality_grade: 'Organic Certified',
    required_qty: 80,
    committed_qty: 32,
    price_per_unit: 132000,
    unit: 'Tonne',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    location: 'Guntur Spice Terminal',
    payment_terms: 'Escrow Protected',
    notes: 'High Curcumin (>4.5%) required. Free organic certification test provided.',
    verified_buyer_badge: 1
  },
  {
    id: 'ORD-GARMENTS-15K',
    buyer_name: 'Zila Parishad Education Department',
    buyer_type: 'Government / State Agency',
    product: 'Stitched School Uniform Sets',
    category: 'Textiles',
    quality_grade: 'Grade B (Standard Commercial)',
    required_qty: 15,
    committed_qty: 9,
    price_per_unit: 340000,
    unit: 'Tonne',
    state: 'West Bengal',
    district: 'Birbhum',
    location: 'Bolpur District Education Store',
    payment_terms: '100% Direct Bank Transfer within 48h',
    notes: 'Standard cotton blend fabric. SHG Federation collective orders given priority.',
    verified_buyer_badge: 1
  },
  {
    id: 'ORD-FISH-FEED-45T',
    buyer_name: 'AquaCulture Producers Network',
    buyer_type: 'Food Processor',
    product: 'Floating Fish & Shrimp Feed Pellets',
    category: 'Fisheries',
    quality_grade: 'Grade A (Export / Premium)',
    required_qty: 45,
    committed_qty: 20,
    price_per_unit: 54000,
    unit: 'Tonne',
    state: 'Bihar',
    district: 'Patna',
    location: 'Patna Central Aqua Hub',
    payment_terms: '50% Advance + 50% on Delivery',
    notes: '32% crude protein feed required for inland pond fisheries.',
    verified_buyer_badge: 1
  }
];

const SUPPLY_PLEDGES = [
  {
    id: 'PLG-TOMATO-01',
    order_id: 'ORD-TOMATO-500T',
    product: 'Tomato (Hybrid Red / Roma)',
    buyer_name: 'KisanBazaar Agro & Mega Food Park',
    producer_name: 'Maha-Agri FPO Federation',
    producer_contact: '9876543210',
    producer_village: 'Amnabad Gram Panchayat',
    district: 'Patna',
    state: 'Bihar',
    quantity_tonnes: 50,
    offered_price: 18500,
    status: 'Confirmed'
  },
  {
    id: 'PLG-MUSTARD-02',
    order_id: 'ORD-MUSTARD-OIL-120T',
    product: 'Cold-Pressed Mustard Oil',
    buyer_name: 'Swadeshi Edible Oils & FMCG Ltd',
    producer_name: 'Kashi Gram Udyog Dal & Oil Mill',
    producer_contact: '9876500001',
    producer_village: 'Shivpur Industrial Area',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    quantity_tonnes: 25,
    offered_price: 145000,
    status: 'Confirmed'
  }
];

async function main() {
  console.log('🚀 Connecting to Turso Cloud SQLite...');
  console.log(`Database: ${TURSO_URL}`);

  try {
    // 1. Create Tables
    console.log('\n📦 Step 1: Initializing Schema & Adding Missing Columns...');
    
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

    // Migrate existing users table if columns missing
    try { await client.execute(`ALTER TABLE users ADD COLUMN village TEXT;`); } catch {}
    try { await client.execute(`ALTER TABLE users ADD COLUMN enterprise_name TEXT;`); } catch {}
    try { await client.execute(`ALTER TABLE users ADD COLUMN email TEXT;`); } catch {}
    try { await client.execute(`ALTER TABLE users ADD COLUMN avatar TEXT;`); } catch {}

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

    try { await client.execute(`ALTER TABLE buyback_demands ADD COLUMN notes TEXT;`); } catch {}
    try { await client.execute(`ALTER TABLE buyback_demands ADD COLUMN verified_buyer_badge INTEGER DEFAULT 1;`); } catch {}

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

    console.log('✅ All Tables Ready: users, buyback_demands, supply_pledges, feasibility_reports');

    // 2. Seed Users
    console.log('\n👤 Step 2: Seeding User Accounts to Turso Cloud...');
    for (const u of DEMO_USERS) {
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
          u.id, u.name, u.phone, u.role, u.role_label, u.location, u.state, u.district,
          u.village, u.enterprise_name, u.email, u.margin_capital, u.avatar, new Date().toISOString()
        ]
      });
      console.log(`  ✓ Synced user: ${u.name} (${u.role})`);
    }

    // 3. Seed Buyback Demands
    console.log('\n🏬 Step 3: Seeding Buyback Demand Contracts to Turso Cloud...');
    for (const d of DEMAND_ORDERS) {
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
          d.id, d.buyer_name, d.buyer_type, d.product, d.category, d.quality_grade,
          d.required_qty, d.committed_qty, d.price_per_unit, d.unit, d.state, d.district,
          d.location, d.payment_terms, d.notes, d.verified_buyer_badge, new Date().toISOString()
        ]
      });
      console.log(`  ✓ Synced order: ${d.id} - ${d.product} (${d.required_qty} Tonnes)`);
    }

    // 4. Seed Supply Pledges
    console.log('\n📝 Step 4: Seeding Supply Pledges to Turso Cloud...');
    for (const p of SUPPLY_PLEDGES) {
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
          p.id, p.order_id, p.product, p.buyer_name, p.producer_name, p.producer_contact,
          p.producer_village, p.district, p.state, p.quantity_tonnes, p.offered_price, p.status, new Date().toISOString()
        ]
      });
      console.log(`  ✓ Synced pledge: ${p.id} (${p.quantity_tonnes} T) -> ${p.buyer_name}`);
    }

    // 5. Verification Query
    console.log('\n🔍 Step 5: Verifying Remote Turso Cloud Database Records...');
    const userCount = await client.execute('SELECT COUNT(*) as count FROM users;');
    const demandCount = await client.execute('SELECT COUNT(*) as count FROM buyback_demands;');
    const pledgeCount = await client.execute('SELECT COUNT(*) as count FROM supply_pledges;');

    console.log(`\n========================================`);
    console.log(`🎉 ALL DATA SUCCESSFULLY SYNCED TO TURSO CLOUD!`);
    console.log(`📊 Users Table:            ${userCount.rows[0].count} records`);
    console.log(`📊 Buyback Demands Table:  ${demandCount.rows[0].count} records`);
    console.log(`📊 Supply Pledges Table:   ${pledgeCount.rows[0].count} records`);
    console.log(`========================================\n`);

  } catch (err) {
    console.error('❌ Sync Error:', err);
    process.exit(1);
  }
}

main();
