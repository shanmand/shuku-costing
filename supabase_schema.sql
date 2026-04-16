-- Shuku Bakery Costing System - Supabase Schema

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Branches
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  manager TEXT,
  contact_number TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  payment_terms TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Ingredient Categories
CREATE TABLE IF NOT EXISTS ingredient_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_allergen_category BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Ingredients
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES ingredient_categories(id),
  supplier_id UUID REFERENCES suppliers(id),
  unit TEXT NOT NULL,
  standard_cost DECIMAL(12,2) DEFAULT 0,
  reorder_level DECIMAL(12,2) DEFAULT 0,
  current_stock DECIMAL(12,2) DEFAULT 0,
  is_allergen BOOLEAN DEFAULT false,
  allergen_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Packaging Materials
CREATE TABLE IF NOT EXISTS packaging_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  cost DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Recipes
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  branch_id UUID REFERENCES branches(id),
  yield_units DECIMAL(12,2) DEFAULT 0,
  yield_weight DECIMAL(12,2) DEFAULT 0,
  yield_unit TEXT DEFAULT 'Units',
  category TEXT,
  status TEXT DEFAULT 'Draft',
  mix_time INTEGER DEFAULT 0,
  proving_time INTEGER DEFAULT 0,
  baking_temp INTEGER DEFAULT 0,
  baking_time INTEGER DEFAULT 0,
  cooling_time INTEGER DEFAULT 0,
  expected_waste DECIMAL(5,2) DEFAULT 0,
  stages JSONB DEFAULT '[]',
  packaging_items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SKUs
CREATE TABLE IF NOT EXISTS skus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id),
  name TEXT NOT NULL,
  client_name TEXT,
  packaging_config INTEGER DEFAULT 1,
  packaging_material_id UUID REFERENCES packaging_materials(id),
  standard_cost DECIMAL(12,2) DEFAULT 0,
  selling_price DECIMAL(12,2) DEFAULT 0,
  branch_id UUID REFERENCES branches(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Crews
CREATE TABLE IF NOT EXISTS crews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  branch_id UUID REFERENCES branches(id),
  shift_type TEXT,
  supervisor TEXT,
  members UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Employees
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  employee_code TEXT UNIQUE,
  crew_id UUID REFERENCES crews(id),
  role TEXT,
  standard_hourly_rate DECIMAL(12,2) DEFAULT 0,
  overtime_rate DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Production Batches
CREATE TABLE IF NOT EXISTS production_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id),
  branch_id UUID REFERENCES branches(id),
  crew_id UUID REFERENCES crews(id),
  planned_qty DECIMAL(12,2) DEFAULT 0,
  current_stage TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'In Progress',
  stage_history JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Ingredient Batches
CREATE TABLE IF NOT EXISTS ingredient_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID REFERENCES ingredients(id),
  batch_number TEXT NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  received_date DATE,
  expiry_date DATE,
  quantity DECIMAL(12,2) DEFAULT 0,
  current_qty DECIMAL(12,2) DEFAULT 0,
  unit_cost DECIMAL(12,2) DEFAULT 0,
  branch_id UUID REFERENCES branches(id),
  status TEXT DEFAULT 'Available',
  certification_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Quality Control Checks
CREATE TABLE IF NOT EXISTS qc_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  production_batch_id UUID REFERENCES production_batches(id),
  ingredient_batch_id UUID REFERENCES ingredient_batches(id),
  check_type TEXT NOT NULL,
  result TEXT,
  status TEXT,
  failure_category TEXT,
  waste_cost DECIMAL(12,2) DEFAULT 0,
  checked_by UUID REFERENCES employees(id),
  check_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Compliance Audits
CREATE TABLE IF NOT EXISTS compliance_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id),
  audit_date DATE,
  audit_type TEXT,
  inspector TEXT,
  overall_score INTEGER,
  max_score INTEGER,
  status TEXT,
  next_audit_date DATE,
  categories JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Journal Entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  reference TEXT,
  status TEXT DEFAULT 'Draft',
  lines JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. Material Price History
CREATE TABLE IF NOT EXISTS material_price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID REFERENCES ingredients(id),
  unit_cost DECIMAL(12,2) NOT NULL,
  effective_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. Employee Rate History
CREATE TABLE IF NOT EXISTS employee_rate_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id),
  standard_rate DECIMAL(12,2) NOT NULL,
  overtime_rate DECIMAL(12,2) NOT NULL,
  effective_date DATE DEFAULT CURRENT_DATE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. Transfers
CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID REFERENCES ingredients(id),
  batch_id UUID REFERENCES ingredient_batches(id),
  from_branch_id UUID REFERENCES branches(id),
  to_branch_id UUID REFERENCES branches(id),
  quantity DECIMAL(12,2) NOT NULL,
  transfer_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Pending',
  approved_by TEXT,
  cost DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. Roles
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name TEXT NOT NULL,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 19. Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role_id UUID REFERENCES roles(id),
  branch_id UUID REFERENCES branches(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 20. Rate Change Reasons
CREATE TABLE IF NOT EXISTS rate_change_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
-- For simplicity in this demo, we'll enable RLS but allow all authenticated users to read/write.
-- In a production app, you'd want more granular policies.

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

-- Create policies (Allow all authenticated users)
-- Generic policy applier for all tables
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
        -- Select
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated read %I" ON %I', t, t);
        EXECUTE format('CREATE POLICY "Allow authenticated read %I" ON %I FOR SELECT TO authenticated USING (true)', t, t);
        
        -- Insert
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated insert %I" ON %I', t, t);
        EXECUTE format('CREATE POLICY "Allow authenticated insert %I" ON %I FOR INSERT TO authenticated WITH CHECK (true)', t, t);
        
        -- Update
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated update %I" ON %I', t, t);
        EXECUTE format('CREATE POLICY "Allow authenticated update %I" ON %I FOR UPDATE TO authenticated USING (true)', t, t);
        
        -- Delete
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated delete %I" ON %I', t, t);
        EXECUTE format('CREATE POLICY "Allow authenticated delete %I" ON %I FOR DELETE TO authenticated USING (true)', t, t);
    END LOOP;
END $$;
