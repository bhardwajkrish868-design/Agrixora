import { createClient } from '@libsql/client';

const TURSO_URL = 'https://agrixora-krish-x97.aws-ap-south-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTA3MTA0NjMsImlkIjoiMDFhMGVlYTgtYjEwMS03MWI4LTliMzQtN2E2MmMwYWU2ODNmIiwia2lkIjoiNGkwXzg1Sy1TeVJ0Qkd2N0JwdlAwYnVJbExxd1NMZnBsQm4tbVpVUjdrVSIsInJpZCI6IjA1NDkwYTBhLTI3ZjMtNDVhNy1iZGIwLTE1MTZlMDdmNDNkMiJ9.YYzVlaB0ZO8QJKlgRXctxE_ZImSPUmV4e9HWbjthHotGT0ATpMr_o4H7TK50KppopJXwcS4M3geZlMMSnJ4hAg';

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN
});

async function main() {
  console.log('🚀 Connecting to Turso Cloud Database: ' + TURSO_URL);

  // 1. Create all Tables
  console.log('📦 1/6 Initializing Database Schemas...');
  
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
      verified_badge INTEGER DEFAULT 1,
      delivery_date TEXT,
      created_at TEXT NOT NULL
    );
  `);

  try { await client.execute(`ALTER TABLE buyback_demands ADD COLUMN delivery_date TEXT;`); } catch {}
  try { await client.execute(`ALTER TABLE buyback_demands ADD COLUMN verified_badge INTEGER DEFAULT 1;`); } catch {}

  await client.execute(`
    CREATE TABLE IF NOT EXISTS supply_pledges (
      id TEXT PRIMARY KEY,
      demand_id TEXT NOT NULL,
      supplier_name TEXT NOT NULL,
      supplier_role TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT NOT NULL,
      pledged_qty REAL NOT NULL,
      unit TEXT NOT NULL,
      status TEXT DEFAULT 'Confirmed',
      pledged_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS feasibility_reports (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      business_name TEXT NOT NULL,
      activity TEXT NOT NULL,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      total_project_cost REAL NOT NULL,
      margin_capital REAL NOT NULL,
      loan_amount REAL NOT NULL,
      scheme_name TEXT NOT NULL,
      annual_revenue REAL NOT NULL,
      net_profit REAL NOT NULL,
      roi_percent REAL NOT NULL,
      dscr REAL NOT NULL,
      is_viable INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS mandi_prices (
      id TEXT PRIMARY KEY,
      commodity TEXT NOT NULL,
      variety TEXT,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      market_name TEXT NOT NULL,
      min_price REAL NOT NULL,
      max_price REAL NOT NULL,
      modal_price REAL NOT NULL,
      unit TEXT NOT NULL DEFAULT 'Quintal',
      trend TEXT DEFAULT 'Bullish (+4.2%)',
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS system_audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      details TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      ip_source TEXT DEFAULT 'Cloud-SSL'
    );
  `);

  // 2. Upload Users
  console.log('👤 2/6 Uploading User Profiles...');
  const users = [
    {
      id: 'usr_krish_entrepreneur',
      name: 'Krish Bhardwaj',
      phone: '9876543210',
      role: 'entrepreneur',
      role_label: 'Rural Entrepreneur',
      location: 'Nashik, Maharashtra',
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Deola Panchayat',
      enterprise_name: 'Bhardwaj Organic Cold-Press Agro',
      email: 'krish@agrixora.gov.in',
      margin_capital: 50000,
      avatar: '👨‍🌾',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_krish_fpo',
      name: 'Krish Bhardwaj',
      phone: '9876543210',
      role: 'fpo_manager',
      role_label: 'FPO / SHG Leader',
      location: 'Nashik, Maharashtra',
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Niphad Federation',
      enterprise_name: 'Sahyadri Kisan FPO Producer Co.',
      email: 'fpo.krish@agrixora.gov.in',
      margin_capital: 250000,
      avatar: '🏢',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_krish_buyer',
      name: 'Krish Bhardwaj',
      phone: '9876543210',
      role: 'institutional_buyer',
      role_label: 'Institutional Buyer',
      location: 'Mumbai Central Hub, Maharashtra',
      state: 'Maharashtra',
      district: 'Mumbai',
      village: 'Bandra Kurla Complex',
      enterprise_name: 'Krish Agro Wholesale Mega Network',
      email: 'buyer.krish@agrixora.gov.in',
      margin_capital: 1000000,
      avatar: '💼',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_krish_bank',
      name: 'Krish Bhardwaj',
      phone: '9876543210',
      role: 'bank_officer',
      role_label: 'Bank Branch Officer',
      location: 'Nashik Main Branch, Maharashtra',
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Bank of Maharashtra Rural Credit Wing',
      enterprise_name: 'State Bank Lead Appraisal Wing',
      email: 'appraisal.krish@agrixora.gov.in',
      margin_capital: 0,
      avatar: '🏦',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_ramesh_patil',
      name: 'Ramesh Patil',
      phone: '9822334455',
      role: 'entrepreneur',
      role_label: 'Rural Entrepreneur',
      location: 'Kolhapur, Maharashtra',
      state: 'Maharashtra',
      district: 'Kolhapur',
      village: 'Karveer',
      enterprise_name: 'Patil Jaggery Processing Unit',
      email: 'ramesh.patil@agrixora.gov.in',
      margin_capital: 75000,
      avatar: '🧑‍🌾',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_anita_sharma',
      name: 'Anita Sharma',
      phone: '9412345678',
      role: 'fpo_manager',
      role_label: 'FPO / SHG Leader',
      location: 'Varanasi, Uttar Pradesh',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      village: 'Kashi Mahila SHG Sangh',
      enterprise_name: 'Kashi Spices SHG Collective',
      email: 'anita.kashi@agrixora.gov.in',
      margin_capital: 150000,
      avatar: '👩‍🌾',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_kavitha_reddy',
      name: 'Kavitha Reddy',
      phone: '9701234567',
      role: 'entrepreneur',
      role_label: 'Rural Entrepreneur',
      location: 'Warangal, Telangana',
      state: 'Telangana',
      district: 'Warangal',
      village: 'Hanamkonda',
      enterprise_name: 'Kakatiya Chilli Flakes Unit',
      email: 'kavitha.reddy@agrixora.gov.in',
      margin_capital: 60000,
      avatar: '👩‍🌾',
      created_at: new Date().toISOString()
    }
  ];

  for (const u of users) {
    await client.execute({
      sql: `
        INSERT INTO users (id, name, phone, role, role_label, location, state, district, village, enterprise_name, email, margin_capital, avatar, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          phone = excluded.phone,
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
      args: [u.id, u.name, u.phone, u.role, u.role_label, u.location, u.state, u.district, u.village, u.enterprise_name, u.email, u.margin_capital, u.avatar, u.created_at]
    });
  }
  console.log(`✅ Uploaded ${users.length} Users.`);

  // 3. Upload Buyer Demands
  console.log('🌾 3/6 Uploading Buyer Procurement Orders...');
  const demands = [
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
      delivery_date: '15 November 2026',
      location: 'Bhubaneswar Central Cold Hub',
      district: 'Khurda',
      state: 'Odisha',
      payment_terms: '100% Direct Bank Transfer within 48h',
      notes: 'Required for industrial ketchup & purée plant. Minimum batch commit 2 Tonnes.',
      verified_badge: 1
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
      delivery_date: '28 October 2026',
      location: 'Varanasi Industrial Estate',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      payment_terms: '50% Advance + 50% on Delivery',
      notes: 'Cold-pressed raw expeller oil with <0.5% moisture. Direct procurement contract.',
      verified_badge: 1
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
      delivery_date: 'Daily Recurring (Morning/Evening)',
      location: 'Karad Bulk Milk Chilling Center',
      district: 'Satara',
      state: 'Maharashtra',
      payment_terms: '100% Direct Bank Transfer within 48h',
      notes: 'Minimum 6.5% Fat and 9.0% SNF standard. Testing done on automatic Milkotester.',
      verified_badge: 1
    },
    {
      id: 'ORD-TURMERIC-80T',
      buyer_name: 'BioSpice Organics Network',
      buyer_type: 'Exporter',
      product: 'Salem / Nizamabad Turmeric Fingers',
      category: 'Agriculture',
      quality_grade: 'Organic Certified',
      required_qty: 80,
      committed_qty: 45,
      price_per_unit: 112000,
      unit: 'Tonne',
      delivery_date: '10 December 2026',
      location: 'Erode Spice Terminal',
      district: 'Erode',
      state: 'Tamil Nadu',
      payment_terms: 'Letter of Credit (LC) / Escrow',
      notes: 'Curcumin level > 3.8% tested via HPLC. Clean washed whole dried fingers.',
      verified_badge: 1
    },
    {
      id: 'ORD-SOYBEAN-400T',
      buyer_name: 'Adani Wilmar Agri Sourcing',
      buyer_type: 'Institutional Processor',
      product: 'Yellow Soya Bean (JS 335)',
      category: 'Oilseeds',
      quality_grade: 'Grade A',
      required_qty: 400,
      committed_qty: 260,
      price_per_unit: 46000,
      unit: 'Tonne',
      delivery_date: '30 November 2026',
      location: 'Indore Mandi Terminal Hub',
      district: 'Indore',
      state: 'Madhya Pradesh',
      payment_terms: 'Direct RTGS within 24 Hours',
      notes: 'Moisture < 10%, Foreign matter < 2%. Fast unloading facility available.',
      verified_badge: 1
    },
    {
      id: 'ORD-CHILLI-150T',
      buyer_name: 'ITC Spices Sourcing Division',
      buyer_type: 'Mega Processor',
      product: 'Guntur Sannam S4 Dry Red Chilli',
      category: 'Spices',
      quality_grade: 'Grade A Export',
      required_qty: 150,
      committed_qty: 110,
      price_per_unit: 195000,
      unit: 'Tonne',
      delivery_date: '20 December 2026',
      location: 'Guntur Spice Yard',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      payment_terms: '100% Escrow Bank Transfer',
      notes: 'Stemless, uniform color, moisture < 11%. Direct buyback contract signed with FPO.',
      verified_badge: 1
    }
  ];

  for (const d of demands) {
    await client.execute({
      sql: `
        INSERT INTO buyback_demands (id, buyer_name, buyer_type, product, category, quality_grade, required_qty, committed_qty, price_per_unit, unit, delivery_date, location, district, state, payment_terms, notes, verified_badge, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          buyer_name = excluded.buyer_name,
          buyer_type = excluded.buyer_type,
          product = excluded.product,
          category = excluded.category,
          quality_grade = excluded.quality_grade,
          required_qty = excluded.required_qty,
          committed_qty = excluded.committed_qty,
          price_per_unit = excluded.price_per_unit,
          unit = excluded.unit,
          delivery_date = excluded.delivery_date,
          location = excluded.location,
          district = excluded.district,
          state = excluded.state,
          payment_terms = excluded.payment_terms,
          notes = excluded.notes,
          verified_badge = excluded.verified_badge;
      `,
      args: [d.id, d.buyer_name, d.buyer_type, d.product, d.category, d.quality_grade, d.required_qty, d.committed_qty, d.price_per_unit, d.unit, d.delivery_date, d.location, d.district, d.state, d.payment_terms, d.notes, d.verified_badge, new Date().toISOString()]
    });
  }
  console.log(`✅ Uploaded ${demands.length} Buyer Orders.`);

  // 4. Upload Mandi Live Prices
  console.log('📈 4/6 Uploading Mandi Live Price Benchmarks...');
  const mandiPrices = [
    { id: 'mandi_tomato_nashik', commodity: 'Tomato (Hybrid)', variety: 'Roma Red', state: 'Maharashtra', district: 'Nashik', market_name: 'Pimpalgaon APMC', min_price: 1400, max_price: 2100, modal_price: 1850, unit: 'Quintal', trend: 'Bullish (+6.5%)' },
    { id: 'mandi_onion_lasalgaon', commodity: 'Onion (Red)', variety: 'Nashik Gavthi', state: 'Maharashtra', district: 'Nashik', market_name: 'Lasalgaon APMC', min_price: 1800, max_price: 2900, modal_price: 2450, unit: 'Quintal', trend: 'Steady (+1.2%)' },
    { id: 'mandi_mustard_varanasi', commodity: 'Mustard Seed', variety: 'Black Bold', state: 'Uttar Pradesh', district: 'Varanasi', market_name: 'Varanasi APMC', min_price: 5200, max_price: 6100, modal_price: 5750, unit: 'Quintal', trend: 'Bullish (+4.8%)' },
    { id: 'mandi_turmeric_erode', commodity: 'Turmeric Fingers', variety: 'Salem Bold', state: 'Tamil Nadu', district: 'Erode', market_name: 'Erode Spices Mandi', min_price: 9800, max_price: 12400, modal_price: 11200, unit: 'Quintal', trend: 'Strong Bullish (+8.5%)' },
    { id: 'mandi_soybean_indore', commodity: 'Soybean', variety: 'JS-335', state: 'Madhya Pradesh', district: 'Indore', market_name: 'Indore Mandi Hub', min_price: 4200, max_price: 4900, modal_price: 4600, unit: 'Quintal', trend: 'Steady (+0.8%)' },
    { id: 'mandi_milk_satara', commodity: 'Cow Milk (3.5/8.5)', variety: 'Raw Chilled', state: 'Maharashtra', district: 'Satara', market_name: 'Mahanand Dairy Center', min_price: 36, max_price: 42, modal_price: 38.5, unit: 'Litre', trend: 'Steady' }
  ];

  for (const m of mandiPrices) {
    await client.execute({
      sql: `
        INSERT INTO mandi_prices (id, commodity, variety, state, district, market_name, min_price, max_price, modal_price, unit, trend, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          commodity = excluded.commodity,
          variety = excluded.variety,
          state = excluded.state,
          district = excluded.district,
          market_name = excluded.market_name,
          min_price = excluded.min_price,
          max_price = excluded.max_price,
          modal_price = excluded.modal_price,
          unit = excluded.unit,
          trend = excluded.trend,
          updated_at = excluded.updated_at;
      `,
      args: [m.id, m.commodity, m.variety, m.state, m.district, m.market_name, m.min_price, m.max_price, m.modal_price, m.unit, m.trend, new Date().toISOString()]
    });
  }
  console.log(`✅ Uploaded ${mandiPrices.length} Mandi Benchmark Records.`);

  // 5. Upload Feasibility Templates
  console.log('📑 5/6 Uploading Feasibility Blueprints & Reports...');
  const reports = [
    {
      id: 'rep_tomato_purée_50k',
      user_id: 'usr_krish_entrepreneur',
      business_name: 'Solar-Assisted Tomato Purée & Paste Unit',
      category_name: 'Food Processing / Agriculture',
      state: 'Maharashtra',
      district: 'Nashik',
      block: 'Deola',
      village: 'Deola Central',
      overall_score: 92.5,
      readiness_verdict: '100% Bank Appraisal Ready (High Viability)',
      report_json: JSON.stringify({
        projectCost: 500000,
        marginCapital: 50000,
        loanAmount: 450000,
        scheme: 'NABARD Term Loan Scheme (8.25% p.a.)',
        annualRevenue: 1420000,
        netProfit: 385000,
        dscr: 2.85,
        bcr: 1.38,
        irr: 34.2
      }),
      created_at: new Date().toISOString()
    },
    {
      id: 'rep_mustard_oil_75k',
      user_id: 'usr_anita_sharma',
      business_name: 'Cold-Pressed Mustard Oil & Cake Mill',
      category_name: 'Food Processing / Oilseeds',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      block: 'Kashi',
      village: 'Kashi SHG Cluster',
      overall_score: 88.0,
      readiness_verdict: 'Bank Appraisal Ready (Viable)',
      report_json: JSON.stringify({
        projectCost: 750000,
        marginCapital: 75000,
        loanAmount: 675000,
        scheme: 'PMEGP Micro Enterprise Loan (6.5% p.a.)',
        annualRevenue: 2150000,
        netProfit: 520000,
        dscr: 3.12,
        bcr: 1.45,
        irr: 31.8
      }),
      created_at: new Date().toISOString()
    },
    {
      id: 'rep_dairy_chilling_150k',
      user_id: 'usr_krish_fpo',
      business_name: 'Bulk Milk Chilling & Paneer Processing Hub',
      category_name: 'Dairy / Livestock Value Addition',
      state: 'Maharashtra',
      district: 'Satara',
      block: 'Karad',
      village: 'Karad MIDC Agro',
      overall_score: 95.0,
      readiness_verdict: 'Highest Grade Feasibility (Institutional Anchor)',
      report_json: JSON.stringify({
        projectCost: 1500000,
        marginCapital: 150000,
        loanAmount: 1350000,
        scheme: 'AHIDF (Animal Husbandry Infrastructure Fund)',
        annualRevenue: 4800000,
        netProfit: 1180000,
        dscr: 3.45,
        bcr: 1.52,
        irr: 38.5
      }),
      created_at: new Date().toISOString()
    }
  ];

  for (const r of reports) {
    await client.execute({
      sql: `
        INSERT INTO feasibility_reports (id, user_id, business_name, category_name, state, district, block, village, overall_score, readiness_verdict, report_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          business_name = excluded.business_name,
          category_name = excluded.category_name,
          state = excluded.state,
          district = excluded.district,
          block = excluded.block,
          village = excluded.village,
          overall_score = excluded.overall_score,
          readiness_verdict = excluded.readiness_verdict,
          report_json = excluded.report_json;
      `,
      args: [r.id, r.user_id, r.business_name, r.category_name, r.state, r.district, r.block, r.village, r.overall_score, r.readiness_verdict, r.report_json, r.created_at]
    });
  }
  console.log(`✅ Uploaded ${reports.length} Feasibility Blueprints.`);

  // 6. Upload System Audit Log
  console.log('🔒 6/6 Writing Audit Logs & Telemetry...');
  await client.execute({
    sql: `
      INSERT INTO system_audit_logs (id, action, actor_name, details, timestamp, ip_source)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
    args: [`audit_${Date.now()}`, 'MASTER_DATA_UPLOAD', 'Krish Bhardwaj (Admin)', 'Complete enterprise dataset, user directory, live mandi benchmarks, and buyback orders uploaded to Turso Cloud libSQL.', new Date().toISOString(), '103.21.244.0 (SSL Direct)']
  });

  // Verify Counts
  console.log('\n📊 --- TURSO CLOUD REPOSITORY STATUS ---');
  const uCount = await client.execute('SELECT COUNT(*) as count FROM users');
  const dCount = await client.execute('SELECT COUNT(*) as count FROM buyback_demands');
  const mCount = await client.execute('SELECT COUNT(*) as count FROM mandi_prices');
  const rCount = await client.execute('SELECT COUNT(*) as count FROM feasibility_reports');
  const lCount = await client.execute('SELECT COUNT(*) as count FROM system_audit_logs');

  console.log(`👥 Total Registered Users:       ${uCount.rows[0].count}`);
  console.log(`🛒 Total Buyer Orders:           ${dCount.rows[0].count}`);
  console.log(`📈 Mandi Price Feeds:            ${mCount.rows[0].count}`);
  console.log(`📑 Feasibility DPR Blueprints:   ${rCount.rows[0].count}`);
  console.log(`🔒 Audit & Security Logs:        ${lCount.rows[0].count}`);
  console.log('✨ All stored data successfully uploaded to Turso Cloud!');
}

main().catch(err => {
  console.error('❌ Error uploading data to Turso Cloud:', err);
  process.exit(1);
});
