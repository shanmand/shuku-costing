import React, { useState } from 'react';
import { 
  Database, 
  Code2, 
  Zap, 
  Copy, 
  CheckCircle2, 
  Download, 
  Terminal,
  Table as TableIcon,
  FunctionSquare,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const CodeBlock = ({ code, title }: { code: string, title: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-charcoal rounded-2xl overflow-hidden border border-white/5 shadow-2xl group">
      <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-honey/10 flex items-center justify-center text-amber-honey">
            <Terminal size={16} />
          </div>
          <span className="text-warm-cream/80 font-bold text-xs uppercase tracking-widest">{title}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-warm-cream/60 hover:text-warm-cream transition-all text-xs font-bold"
        >
          {copied ? (
            <>
              <CheckCircle2 size={14} className="text-green-400" />
              COPIED
            </>
          ) : (
            <>
              <Copy size={14} />
              COPY SQL
            </>
          )}
        </button>
      </div>
      <div className="p-6 overflow-x-auto custom-scrollbar">
        <pre className="text-sm font-mono leading-relaxed text-warm-cream/90">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

// --- SQL Content ---

const SCHEMA_SQL = `-- SHUKU COSTING SYSTEM - PostgreSQL Schema (IFRS Compliant)
-- South African Bakery Context

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
DO $$ BEGIN
    CREATE TYPE stage_name AS ENUM (
      'Stores', 'Staging', 'Mixing', 'Weighing/Dividing', 'Proving', 
      'Baking', 'Cooling', 'Toppings', 'Packaging', 'Storage', 'Distribution'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE journal_type AS ENUM (
      'MaterialConsumption', 'LabourAllocation', 'OverheadAbsorption', 
      'StageTransfer', 'FGCompletion', 'COGSRecognition', 'WasteWriteOff'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE batch_status AS ENUM ('In Progress', 'Completed', 'On Hold', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE shift_type AS ENUM ('morning', 'afternoon', 'evening', 'night');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- TABLES

-- Core
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  manager TEXT,
  contact_number TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ingredient_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_allergen_category BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  payment_terms TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES ingredient_categories(id),
  supplier_id UUID REFERENCES suppliers(id),
  unit TEXT NOT NULL, -- kg, L, unit
  standard_cost DECIMAL(12,2) NOT NULL,
  reorder_level DECIMAL(12,2),
  is_allergen BOOLEAN DEFAULT false,
  allergen_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ingredient_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id UUID REFERENCES ingredients(id),
  batch_number TEXT NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  received_date DATE NOT NULL,
  expiry_date DATE,
  initial_quantity DECIMAL(12,2) NOT NULL,
  current_quantity DECIMAL(12,2) NOT NULL,
  unit_cost DECIMAL(12,2) NOT NULL,
  branch_id UUID REFERENCES branches(id),
  status TEXT DEFAULT 'Available',
  certification_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Recipes
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  branch_id UUID REFERENCES branches(id),
  yield_units INTEGER NOT NULL,
  yield_weight DECIMAL(12,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recipe_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id),
  version_number TEXT NOT NULL,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recipe_bom_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID REFERENCES recipe_versions(id),
  ingredient_id UUID REFERENCES ingredients(id),
  stage stage_name NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  unit TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS packaging_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id),
  name TEXT NOT NULL,
  quantity_per_batch DECIMAL(12,2) NOT NULL,
  unit TEXT NOT NULL,
  cost_per_unit DECIMAL(12,2) NOT NULL
);

-- Finished Goods
CREATE TABLE IF NOT EXISTS skus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id),
  name TEXT NOT NULL,
  client_name TEXT,
  packaging_config INTEGER NOT NULL,
  standard_cost DECIMAL(12,2),
  selling_price DECIMAL(12,2),
  branch_id UUID REFERENCES branches(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Labour
CREATE TABLE IF NOT EXISTS crews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  branch_id UUID REFERENCES branches(id),
  shift_type shift_type NOT NULL,
  supervisor TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  employee_code TEXT UNIQUE NOT NULL,
  crew_id UUID REFERENCES crews(id),
  role TEXT,
  standard_hourly_rate DECIMAL(12,2) NOT NULL,
  overtime_rate DECIMAL(12,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employee_rate_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id),
  effective_date DATE NOT NULL,
  standard_rate DECIMAL(12,2) NOT NULL,
  overtime_rate DECIMAL(12,2) NOT NULL,
  change_reason TEXT,
  changed_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Production
CREATE TABLE IF NOT EXISTS production_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id),
  branch_id UUID REFERENCES branches(id),
  crew_id UUID REFERENCES crews(id),
  planned_qty INTEGER NOT NULL,
  actual_qty INTEGER,
  current_stage stage_name DEFAULT 'Stores',
  status batch_status DEFAULT 'In Progress',
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS production_stage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES production_batches(id),
  stage stage_name NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  operator_id UUID REFERENCES employees(id),
  labour_hours DECIMAL(8,2),
  waste_qty DECIMAL(12,2) DEFAULT 0,
  waste_cost DECIMAL(12,2) DEFAULT 0,
  overhead_cost DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Accounting
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL, -- YYYY-MM
  date DATE NOT NULL,
  description TEXT,
  type journal_type,
  status TEXT DEFAULT 'Draft',
  prepared_by UUID,
  approved_by UUID,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id UUID REFERENCES journal_entries(id),
  account_code TEXT NOT NULL,
  account_name TEXT NOT NULL,
  cost_center UUID REFERENCES branches(id),
  debit DECIMAL(15,2) DEFAULT 0,
  credit DECIMAL(15,2) DEFAULT 0
);

-- Quality & Compliance
CREATE TABLE IF NOT EXISTS compliance_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  audit_date DATE NOT NULL,
  audit_type TEXT NOT NULL,
  inspector TEXT,
  overall_score INTEGER,
  max_score INTEGER,
  status TEXT,
  next_audit_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_category_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES compliance_audits(id),
  category_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS qc_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES production_batches(id),
  ingredient_batch_id UUID REFERENCES ingredient_batches(id),
  check_type TEXT NOT NULL,
  result TEXT NOT NULL, -- Pass/Fail
  failure_category TEXT,
  waste_cost DECIMAL(12,2) DEFAULT 0,
  checked_by UUID REFERENCES employees(id),
  check_date DATE DEFAULT CURRENT_DATE,
  notes TEXT
);

-- Metadata
CREATE TABLE IF NOT EXISTS material_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id UUID REFERENCES ingredients(id),
  effective_date DATE NOT NULL,
  unit_cost DECIMAL(12,2) NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  change_reason TEXT
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL UNIQUE,
  permissions JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role_id UUID REFERENCES roles(id),
  branch_id UUID REFERENCES branches(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES
CREATE INDEX idx_pb_branch ON production_batches(branch_id);
CREATE INDEX idx_pb_status ON production_batches(status);
CREATE INDEX idx_ing_cat ON ingredients(category_id);
CREATE INDEX idx_bat_ing ON ingredient_batches(ingredient_id);
CREATE INDEX idx_jl_journal ON journal_lines(journal_id);
`;

const FUNCTIONS_SQL = `-- SHUKU COSTING SYSTEM - Supabase Functions & Triggers

-- 1. Calculate Stage Labour Cost
CREATE OR REPLACE FUNCTION calculate_stage_labour_cost(
  p_batch_id UUID, 
  p_stage stage_name, 
  p_date DATE
) RETURNS DECIMAL AS $$
DECLARE
  v_crew_id UUID;
  v_total_cost DECIMAL := 0;
BEGIN
  -- Get the crew assigned to the batch
  SELECT crew_id INTO v_crew_id FROM production_batches WHERE id = p_batch_id;
  
  -- Sum standard rates for all crew members (simplified)
  SELECT SUM(standard_hourly_rate) INTO v_total_cost 
  FROM employees 
  WHERE crew_id = v_crew_id;
  
  -- Multiply by hours recorded for the stage
  SELECT v_total_cost * labour_hours INTO v_total_cost
  FROM production_stage_records
  WHERE batch_id = p_batch_id AND stage = p_stage;
  
  RETURN COALESCE(v_total_cost, 0);
END;
$$ LANGUAGE plpgsql;

-- 2. Calculate Stage Material Cost
CREATE OR REPLACE FUNCTION calculate_stage_material_cost(
  p_batch_id UUID, 
  p_stage stage_name
) RETURNS DECIMAL AS $$
DECLARE
  v_recipe_id UUID;
  v_version_id UUID;
  v_total_cost DECIMAL := 0;
BEGIN
  SELECT recipe_id INTO v_recipe_id FROM production_batches WHERE id = p_batch_id;
  SELECT id INTO v_version_id FROM recipe_versions WHERE recipe_id = v_recipe_id AND is_current = true;
  
  SELECT SUM(bom.quantity * ing.standard_cost) INTO v_total_cost
  FROM recipe_bom_lines bom
  JOIN ingredients ing ON bom.ingredient_id = ing.id
  WHERE bom.version_id = v_version_id AND bom.stage = p_stage;
  
  RETURN COALESCE(v_total_cost, 0);
END;
$$ LANGUAGE plpgsql;

-- 3. Roll-up Batch Cost
CREATE OR REPLACE FUNCTION roll_up_batch_cost(p_batch_id UUID) 
RETURNS TABLE (
  material_total DECIMAL,
  labour_total DECIMAL,
  overhead_total DECIMAL,
  waste_total DECIMAL,
  grand_total DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    SUM(calculate_stage_material_cost(id, stage)) as material_total,
    SUM(labour_hours * 65.00) as labour_total, -- Mocked rate for simplicity
    SUM(overhead_cost) as overhead_total,
    SUM(waste_cost) as waste_total,
    (SUM(calculate_stage_material_cost(id, stage)) + SUM(labour_hours * 65.00) + SUM(overhead_cost)) as grand_total
  FROM production_stage_records
  WHERE batch_id = p_batch_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger: Update Production Batch Stage
CREATE OR REPLACE FUNCTION update_batch_current_stage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE production_batches
  SET current_stage = NEW.stage,
      status = CASE WHEN NEW.stage = 'Distribution' THEN 'Completed' ELSE 'In Progress' END,
      end_date = CASE WHEN NEW.stage = 'Distribution' THEN now() ELSE NULL END
  WHERE id = NEW.batch_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_stage
AFTER INSERT ON production_stage_records
FOR EACH ROW EXECUTE FUNCTION update_batch_current_stage();

-- 5. Trigger: COGS Recognition on Distribution
CREATE OR REPLACE FUNCTION generate_cogs_journal_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stage = 'Distribution' THEN
    -- Logic to insert into journal_entries and journal_lines
    -- DR: Cost of Goods Sold
    -- CR: Finished Goods Inventory
    INSERT INTO journal_entries (period, date, description, type, status)
    VALUES (to_char(now(), 'YYYY-MM'), CURRENT_DATE, 'COGS Recognition - Batch ' || NEW.batch_id, 'COGSRecognition', 'Pending Approval');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_generate_cogs
AFTER INSERT ON production_stage_records
FOR EACH ROW EXECUTE FUNCTION generate_cogs_journal_trigger();

-- 6. RLS Policies & Systematic Access
-- Enable Row Level Security (RLS) for all tables
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE packaging_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE qc_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_rate_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_change_reasons ENABLE ROW LEVEL SECURITY;

-- Systematic Policy Applier (Allow all authenticated access)
DO $$ 
DECLARE
    t text;
    tables text[] := ARRAY[
        'branches', 'suppliers', 'ingredient_categories', 'ingredients', 
        'packaging_materials', 'recipes', 'skus', 'crews', 'employees', 
        'production_batches', 'ingredient_batches', 'qc_checks', 
        'compliance_audits', 'journal_entries', 'material_price_history', 
        'employee_rate_history', 'transfers', 'roles', 'users', 'rate_change_reasons'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated read %%I" ON %%I', t, t);
        EXECUTE format('CREATE POLICY "Allow authenticated read %%I" ON %%I FOR SELECT TO authenticated USING (true)', t, t);
        
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated insert %%I" ON %%I', t, t);
        EXECUTE format('CREATE POLICY "Allow authenticated insert %%I" ON %%I FOR INSERT TO authenticated WITH CHECK (true)', t, t);
        
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated update %%I" ON %%I', t, t);
        EXECUTE format('CREATE POLICY "Allow authenticated update %%I" ON %%I FOR UPDATE TO authenticated USING (true)', t, t);
        
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated delete %%I" ON %%I', t, t);
        EXECUTE format('CREATE POLICY "Allow authenticated delete %%I" ON %%I FOR DELETE TO authenticated USING (true)', t, t);
    END LOOP;
END $$;
`;

const QUERIES_SQL = [
  {
    title: "1. SKU COGS Breakdown",
    sql: `-- Full cost breakdown per SKU (Material + Labour + Overhead + Packaging)
SELECT 
  s.name as sku_name,
  r.name as recipe_name,
  (SELECT SUM(quantity * standard_cost) FROM recipe_bom_lines bom JOIN ingredients i ON bom.ingredient_id = i.id WHERE bom.version_id = (SELECT id FROM recipe_versions WHERE recipe_id = r.id AND is_current = true)) / r.yield_units as material_per_unit,
  (SELECT SUM(quantity_per_batch * cost_per_unit) FROM packaging_items WHERE recipe_id = r.id) / r.yield_units as packaging_per_unit,
  s.standard_cost as total_standard_cost,
  s.selling_price,
  ((s.selling_price - s.standard_cost) / s.selling_price) * 100 as margin_percent
FROM skus s
JOIN recipes r ON s.recipe_id = r.id;`
  },
  {
    title: "2. Waste Analysis by Stage",
    sql: `-- Waste % and cost per stage across all batches
SELECT 
  stage,
  COUNT(batch_id) as total_batches,
  SUM(waste_cost) as total_waste_cost,
  AVG(waste_qty) as avg_waste_qty,
  (SUM(waste_cost) / SUM(SELECT SUM(overhead_cost) FROM production_stage_records)) * 100 as waste_to_overhead_ratio
FROM production_stage_records
GROUP BY stage
ORDER BY total_waste_cost DESC;`
  },
  {
    title: "3. Labour Costing by Crew",
    sql: `-- Total labour cost per crew per period
SELECT 
  c.name as crew_name,
  b.name as branch_name,
  SUM(psr.labour_hours) as total_hours,
  SUM(psr.labour_hours * e.standard_hourly_rate) as total_labour_cost
FROM production_stage_records psr
JOIN production_batches pb ON psr.batch_id = pb.id
JOIN crews c ON pb.crew_id = c.id
JOIN branches b ON pb.branch_id = b.id
JOIN employees e ON e.crew_id = c.id
WHERE psr.completed_at BETWEEN '2026-03-01' AND '2026-03-31'
GROUP BY c.name, b.name;`
  },
  {
    title: "4. Branch Profitability",
    sql: `-- Revenue vs COGS vs Gross Margin per branch
SELECT 
  b.name as branch_name,
  SUM(s.selling_price * pb.actual_qty) as total_revenue,
  SUM(s.standard_cost * pb.actual_qty) as total_cogs,
  SUM((s.selling_price - s.standard_cost) * pb.actual_qty) as gross_profit,
  (SUM((s.selling_price - s.standard_cost) * pb.actual_qty) / SUM(s.selling_price * pb.actual_qty)) * 100 as gp_margin
FROM production_batches pb
JOIN skus s ON pb.recipe_id = s.recipe_id
JOIN branches b ON pb.branch_id = b.id
WHERE pb.status = 'Completed'
GROUP BY b.name;`
  },
  {
    title: "5. Inventory Valuation (IAS 2)",
    sql: `-- Weighted Average Cost Method
SELECT 
  i.name as ingredient,
  ic.name as category,
  SUM(ib.current_quantity) as stock_on_hand,
  i.unit,
  SUM(ib.current_quantity * ib.unit_cost) / SUM(ib.current_quantity) as weighted_avg_cost,
  SUM(ib.current_quantity * ib.unit_cost) as total_valuation
FROM ingredient_batches ib
JOIN ingredients i ON ib.ingredient_id = i.id
JOIN ingredient_categories ic ON i.category_id = ic.id
WHERE ib.current_quantity > 0
GROUP BY i.name, ic.name, i.unit;`
  },
  {
    title: "6. COGS Summary by Category",
    sql: `-- MTD COGS by product category
SELECT 
  ic.name as category,
  SUM(psr.waste_cost) as waste_mtd,
  SUM(calculate_stage_material_cost(pb.id, psr.stage)) as material_mtd
FROM production_stage_records psr
JOIN production_batches pb ON psr.batch_id = pb.id
JOIN recipes r ON pb.recipe_id = r.id
JOIN ingredients i ON i.id = (SELECT ingredient_id FROM recipe_bom_lines WHERE version_id = (SELECT id FROM recipe_versions WHERE recipe_id = r.id LIMIT 1) LIMIT 1)
JOIN ingredient_categories ic ON i.category_id = ic.id
GROUP BY ic.name;`
  },
  {
    title: "7. Ingredient Traceability",
    sql: `-- Trace ingredient batch through production to SKU
SELECT 
  ib.batch_number,
  i.name as ingredient,
  pb.id as production_batch_id,
  r.name as recipe,
  s.name as sku_dispatched,
  psr.completed_at as dispatch_date
FROM ingredient_batches ib
JOIN ingredients i ON ib.ingredient_id = i.id
JOIN recipe_bom_lines bom ON i.id = bom.ingredient_id
JOIN recipe_versions rv ON bom.version_id = rv.id
JOIN recipes r ON rv.recipe_id = r.id
JOIN production_batches pb ON r.id = pb.recipe_id
JOIN production_stage_records psr ON pb.id = psr.batch_id
JOIN skus s ON s.recipe_id = r.id
WHERE ib.batch_number = 'SAS-FL-001' AND psr.stage = 'Distribution';`
  }
];

// --- Main Page ---

export default function SqlExports() {
  const [activeTab, setActiveTab] = useState<'schema' | 'functions' | 'queries'>('schema');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-charcoal tracking-tight uppercase">SQL & Exports</h1>
          <p className="text-charcoal/50 font-medium">Database architecture, triggers, and advanced cost queries</p>
        </div>
        <button className="bg-charcoal text-warm-cream px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-charcoal/90 transition-all shadow-lg active:scale-95">
          <Download size={20} className="text-amber-honey" />
          EXPORT FULL DB
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 bg-secondary-cream p-1.5 rounded-2xl w-fit border border-charcoal/5">
        <button 
          onClick={() => setActiveTab('schema')}
          className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${
            activeTab === 'schema' ? 'bg-charcoal text-warm-cream shadow-lg' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          <TableIcon size={16} />
          SCHEMA
        </button>
        <button 
          onClick={() => setActiveTab('functions')}
          className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${
            activeTab === 'functions' ? 'bg-charcoal text-warm-cream shadow-lg' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          <Zap size={16} />
          FUNCTIONS & TRIGGERS
        </button>
        <button 
          onClick={() => setActiveTab('queries')}
          className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${
            activeTab === 'queries' ? 'bg-charcoal text-warm-cream shadow-lg' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          <BarChart3 size={16} />
          COST QUERIES
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'schema' && (
          <motion.div 
            key="schema"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-amber-honey/10 border border-amber-honey/20 p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-honey flex items-center justify-center text-charcoal shrink-0">
                <Database size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-charcoal uppercase tracking-widest mb-1">PostgreSQL Core Schema</h3>
                <p className="text-charcoal/60 text-sm leading-relaxed">
                  Full relational structure optimized for manufacturing costing. Includes primary keys, foreign keys, 
                  and South African specific tax/compliance fields.
                </p>
              </div>
            </div>
            <CodeBlock title="PostgreSQL DDL" code={SCHEMA_SQL} />
          </motion.div>
        )}

        {activeTab === 'functions' && (
          <motion.div 
            key="functions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-charcoal uppercase tracking-widest mb-1">Supabase Functions & Triggers</h3>
                <p className="text-charcoal/60 text-sm leading-relaxed">
                  Server-side logic for cost roll-ups, automated journal generation, and real-time inventory adjustments.
                </p>
              </div>
            </div>
            <CodeBlock title="PL/pgSQL Functions" code={FUNCTIONS_SQL} />
          </motion.div>
        )}

        {activeTab === 'queries' && (
          <motion.div 
            key="queries"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 gap-8">
              {QUERIES_SQL.map((query, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-charcoal flex items-center justify-center text-amber-honey font-black text-xs">
                      {idx + 1}
                    </div>
                    <h3 className="text-sm font-black text-charcoal uppercase tracking-widest">{query.title}</h3>
                  </div>
                  <CodeBlock title="SQL Query" code={query.sql} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
