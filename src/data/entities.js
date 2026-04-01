/**
 * SHUKU COSTING SYSTEM - Sample Data Store
 * Realistic South African Bakery Context
 */

export const BRANCHES = [
  { id: 'br-01', name: 'Main Bakery (Johannesburg)', location: 'City Deep, Johannesburg', manager: 'Thabo Mokoena', isActive: true },
  { id: 'br-02', name: 'North Branch (Pretoria)', location: 'Silverton, Pretoria', manager: 'Annatjie van der Merwe', isActive: true },
  { id: 'br-03', name: 'East Branch (Benoni)', location: 'Apex, Benoni', manager: 'Sipho Zulu', isActive: true },
];

export const SUPPLIERS = [
  { id: 'sup-01', name: 'Sasko Flour Mills', contactPerson: 'Johan Botha', email: 'johan@sasko.co.za', phone: '011-456-7890', address: '12 Mill St, Randburg', paymentTerms: '30 Days', isActive: true },
  { id: 'sup-02', name: 'Selati Sugar', contactPerson: 'Priya Naidoo', email: 'p.naidoo@selati.com', phone: '031-222-3333', address: '4 Sugar Cane Way, Durban', paymentTerms: '15 Days', isActive: true },
  { id: 'sup-03', name: 'Clover Dairy', contactPerson: 'Chris Coetzee', email: 'chris.c@clover.co.za', phone: '012-888-9999', address: '88 Milk Rd, Midrand', paymentTerms: '7 Days', isActive: true },
];

export const INGREDIENT_CATEGORIES = [
  { id: 'cat-01', name: 'Flour & Grains', description: 'Primary bulk flours', isAllergenCategory: true },
  { id: 'cat-02', name: 'Sweeteners', description: 'Sugars and syrups', isAllergenCategory: false },
  { id: 'cat-03', name: 'Dairy', description: 'Milk, butter, and cream', isAllergenCategory: true },
  { id: 'cat-04', name: 'Leavening Agents', description: 'Yeast and baking powder', isAllergenCategory: false },
  { id: 'cat-05', name: 'Seeds & Toppings', description: 'Sesame, poppy seeds, etc.', isAllergenCategory: true },
];

export const INGREDIENTS = [
  { id: 'ing-01', name: 'Bread Flour (White)', categoryId: 'cat-01', supplierId: 'sup-01', unit: 'kg', standardCost: 12.50, reorderLevel: 500, currentStock: 1200, isAllergen: true, allergenType: 'Gluten' },
  { id: 'ing-02', name: 'White Sugar', categoryId: 'cat-02', supplierId: 'sup-02', unit: 'kg', standardCost: 18.20, reorderLevel: 200, currentStock: 450, isAllergen: false, allergenType: null },
  { id: 'ing-03', name: 'Fine Salt', categoryId: 'cat-02', supplierId: 'sup-01', unit: 'kg', standardCost: 5.40, reorderLevel: 50, currentStock: 80, isAllergen: false, allergenType: null },
  { id: 'ing-04', name: 'Instant Dry Yeast', categoryId: 'cat-04', supplierId: 'sup-01', unit: 'kg', standardCost: 85.00, reorderLevel: 20, currentStock: 35, isAllergen: false, allergenType: null },
  { id: 'ing-05', name: 'Salted Butter', categoryId: 'cat-03', supplierId: 'sup-03', unit: 'kg', standardCost: 110.00, reorderLevel: 40, currentStock: 65, isAllergen: true, allergenType: 'Dairy' },
  { id: 'ing-06', name: 'Large Eggs', categoryId: 'cat-03', supplierId: 'sup-03', unit: 'unit', standardCost: 2.10, reorderLevel: 360, currentStock: 720, isAllergen: true, allergenType: 'Eggs' },
  { id: 'ing-07', name: 'Sesame Seeds', categoryId: 'cat-05', supplierId: 'sup-02', unit: 'kg', standardCost: 95.00, reorderLevel: 10, currentStock: 15, isAllergen: true, allergenType: 'Seeds' },
  { id: 'ing-08', name: 'Full Cream Milk', categoryId: 'cat-03', supplierId: 'sup-03', unit: 'L', standardCost: 16.50, reorderLevel: 100, currentStock: 180, isAllergen: true, allergenType: 'Dairy' },
];

export const INGREDIENT_BATCHES = [
  { id: 'bat-01', ingredientId: 'ing-01', batchNumber: 'SAS-FL-001', supplierId: 'sup-01', receivedDate: '2026-03-15', expiryDate: '2026-09-15', quantity: 600, unitCost: 12.20, branchId: 'br-01', status: 'Available', certificationNumber: 'CERT-9982' },
  { id: 'bat-02', ingredientId: 'ing-01', batchNumber: 'SAS-FL-002', supplierId: 'sup-01', receivedDate: '2026-03-28', expiryDate: '2026-09-28', quantity: 600, unitCost: 12.80, branchId: 'br-01', status: 'Available', certificationNumber: 'CERT-9995' },
  { id: 'bat-03', ingredientId: 'ing-02', batchNumber: 'SEL-SG-442', supplierId: 'sup-02', receivedDate: '2026-03-10', expiryDate: '2027-03-10', quantity: 225, unitCost: 18.00, branchId: 'br-01', status: 'Available', certificationNumber: 'S-102' },
  { id: 'bat-04', ingredientId: 'ing-02', batchNumber: 'SEL-SG-445', supplierId: 'sup-02', receivedDate: '2026-03-25', expiryDate: '2027-03-25', quantity: 225, unitCost: 18.40, branchId: 'br-01', status: 'Available', certificationNumber: 'S-105' },
  // ... (Simplified for brevity, but follows the pattern for all 8 ingredients)
];

export const RECIPES = [
  {
    id: 'rec-01',
    name: 'White Sandwich Loaf',
    version: '1.2',
    branchId: 'br-01',
    yieldUnits: 100,
    yieldWeight: 80, // kg
    stages: [
      { name: 'Stores', ingredients: [] },
      { name: 'Staging', ingredients: [] },
      { name: 'Mixing', ingredients: [
        { ingredientId: 'ing-01', quantity: 50, unit: 'kg' },
        { ingredientId: 'ing-02', quantity: 2, unit: 'kg' },
        { ingredientId: 'ing-03', quantity: 1, unit: 'kg' },
        { ingredientId: 'ing-04', quantity: 0.8, unit: 'kg' },
        { ingredientId: 'ing-08', quantity: 30, unit: 'L' }
      ]},
      { name: 'Weighing/Dividing', ingredients: [] },
      { name: 'Proving', ingredients: [] },
      { name: 'Baking', ingredients: [] },
      { name: 'Cooling', ingredients: [] },
      { name: 'Toppings', ingredients: [] },
      { name: 'Packaging', ingredients: [] },
      { name: 'Storage', ingredients: [] },
      { name: 'Distribution', ingredients: [] }
    ],
    packagingItems: [
      { name: 'Plastic Bread Bag', quantity: 100, unit: 'unit' },
      { name: 'Bread Tie', quantity: 100, unit: 'unit' }
    ]
  },
  {
    id: 'rec-02',
    name: 'Sesame Dinner Roll',
    version: '2.0',
    branchId: 'br-01',
    yieldUnits: 500,
    yieldWeight: 25, // kg
    stages: [
      { name: 'Stores', ingredients: [] },
      { name: 'Staging', ingredients: [] },
      { name: 'Mixing', ingredients: [
        { ingredientId: 'ing-01', quantity: 15, unit: 'kg' },
        { ingredientId: 'ing-02', quantity: 1, unit: 'kg' },
        { ingredientId: 'ing-03', quantity: 0.3, unit: 'kg' },
        { ingredientId: 'ing-04', quantity: 0.4, unit: 'kg' },
        { ingredientId: 'ing-05', quantity: 2, unit: 'kg' },
        { ingredientId: 'ing-06', quantity: 20, unit: 'unit' }
      ]},
      { name: 'Weighing/Dividing', ingredients: [] },
      { name: 'Proving', ingredients: [] },
      { name: 'Baking', ingredients: [] },
      { name: 'Cooling', ingredients: [] },
      { name: 'Toppings', ingredients: [
        { ingredientId: 'ing-07', quantity: 0.5, unit: 'kg' }
      ]},
      { name: 'Packaging', ingredients: [] },
      { name: 'Storage', ingredients: [] },
      { name: 'Distribution', ingredients: [] }
    ],
    packagingItems: [
      { name: 'Roll Pack Bag (Small)', quantity: 125, unit: 'unit' }
    ]
  }
];

export const SKUS = [
  { id: 'sku-01', recipeId: 'rec-01', name: 'White Loaf x1 (Retail)', clientName: 'Checkers Hyper', packagingConfig: 1, packagingMaterialId: 'pkg-01', standardCost: 14.50, sellingPrice: 18.99, branchId: 'br-01' },
  { id: 'sku-02', recipeId: 'rec-02', name: 'Dinner Roll x4 (Restaurant A)', clientName: 'Spur Steak Ranches', packagingConfig: 4, packagingMaterialId: 'pkg-02', standardCost: 8.20, sellingPrice: 12.50, branchId: 'br-01' },
  { id: 'sku-03', recipeId: 'rec-02', name: 'Dinner Roll x6 (Restaurant B)', clientName: 'Mugg & Bean', packagingConfig: 6, packagingMaterialId: 'pkg-03', standardCost: 11.80, sellingPrice: 16.00, branchId: 'br-01' },
  { id: 'sku-04', recipeId: 'rec-01', name: 'White Loaf x2 (Wholesale)', clientName: 'Local Spaza Shop', packagingConfig: 2, packagingMaterialId: 'pkg-01', standardCost: 27.00, sellingPrice: 34.00, branchId: 'br-01' },
];

export const CREWS = [
  { id: 'crw-01', name: 'Alpha Morning Crew', branchId: 'br-01', shiftType: 'morning', supervisor: 'Lindiwe Dlamini', members: ['emp-01', 'emp-02'] },
  { id: 'crw-02', name: 'Beta Evening Crew', branchId: 'br-01', shiftType: 'evening', supervisor: 'Kobus Coetzee', members: ['emp-03', 'emp-04'] },
  { id: 'crw-03', name: 'Gamma Night Crew', branchId: 'br-02', shiftType: 'night', supervisor: 'Zanele Khumalo', members: ['emp-05', 'emp-06'] },
];

export const EMPLOYEES = [
  { id: 'emp-01', name: 'John Sithole', employeeCode: 'SHU001', crewId: 'crw-01', role: 'Head Baker', standardHourlyRate: 85.00, overtimeRate: 127.50 },
  { id: 'emp-02', name: 'Sarah Moonsamy', employeeCode: 'SHU002', crewId: 'crw-01', role: 'Assistant Baker', standardHourlyRate: 55.00, overtimeRate: 82.50 },
  { id: 'emp-03', name: 'Pieter Viljoen', employeeCode: 'SHU003', crewId: 'crw-02', role: 'Mixer Operator', standardHourlyRate: 60.00, overtimeRate: 90.00 },
  { id: 'emp-04', name: 'Nomsa Cele', employeeCode: 'SHU004', crewId: 'crw-02', role: 'Packer', standardHourlyRate: 45.00, overtimeRate: 67.50 },
  { id: 'emp-05', name: 'David Mbeki', employeeCode: 'SHU005', crewId: 'crw-03', role: 'Head Baker', standardHourlyRate: 88.00, overtimeRate: 132.00 },
  { id: 'emp-06', name: 'Elena Petrova', employeeCode: 'SHU006', crewId: 'crw-03', role: 'Assistant Baker', standardHourlyRate: 58.00, overtimeRate: 87.00 },
];

export const EMPLOYEE_RATE_HISTORY = [
  { id: 'erh-01', employeeId: 'emp-01', effectiveDate: '2026-01-01', standardRate: 85.00, overtimeRate: 127.50, changeReason: 'Annual Increase', changedBy: 'HR-Admin' },
  { id: 'erh-02', employeeId: 'emp-02', effectiveDate: '2026-01-01', standardRate: 55.00, overtimeRate: 82.50, changeReason: 'Annual Increase', changedBy: 'HR-Admin' },
];

export const PRODUCTION_BATCHES = [
  { 
    id: 'pb-001', 
    recipeId: 'rec-01', 
    branchId: 'br-01', 
    crewId: 'crw-01', 
    plannedQty: 200, 
    currentStage: 'Baking', 
    startDate: '2026-03-31T06:00:00', 
    status: 'In Progress',
    stageHistory: [
      { stage: 'Mixing', completedAt: '2026-03-31T07:30:00', user: 'emp-01' },
      { stage: 'Proving', completedAt: '2026-03-31T09:00:00', user: 'emp-02' }
    ]
  },
  { 
    id: 'pb-002', 
    recipeId: 'rec-02', 
    branchId: 'br-01', 
    crewId: 'crw-02', 
    plannedQty: 1000, 
    currentStage: 'Packaging', 
    startDate: '2026-03-31T14:00:00', 
    status: 'In Progress',
    stageHistory: [
      { stage: 'Baking', completedAt: '2026-03-31T17:00:00', user: 'emp-03' }
    ]
  },
  { 
    id: 'pb-003', 
    recipeId: 'rec-01', 
    branchId: 'br-02', 
    crewId: 'crw-03', 
    plannedQty: 150, 
    currentStage: 'Distribution', 
    startDate: '2026-03-30T22:00:00', 
    status: 'Completed',
    stageHistory: [
      { stage: 'Packaging', completedAt: '2026-03-31T04:00:00', user: 'emp-05' }
    ]
  },
];

export const BRANCH_TRANSFERS = [
  { id: 'tr-01', ingredientId: 'ing-01', batchId: 'bat-01', fromBranchId: 'br-01', toBranchId: 'br-02', quantity: 100, transferDate: '2026-03-20', status: 'Approved', approvedBy: 'Thabo Mokoena', cost: 1220.00 },
  { id: 'tr-02', ingredientId: 'ing-05', batchId: 'bat-05', fromBranchId: 'br-01', toBranchId: 'br-03', quantity: 10, transferDate: '2026-03-25', status: 'Pending', approvedBy: null, cost: 1100.00 },
];

export const JOURNAL_ENTRIES = [
  {
    id: 'je-001',
    date: '2026-03-31',
    period: '2026-03',
    description: 'Month-end Inventory Adjustment',
    status: 'Posted',
    preparedBy: 'Accountant-1',
    approvedBy: 'Finance-Manager',
    lines: [
      { accountCode: '6000', accountName: 'Cost of Sales - Ingredients', debit: 4500.00, credit: 0, costCenter: 'Bakery-Main' },
      { accountCode: '1200', accountName: 'Inventory - Raw Materials', debit: 0, credit: 4500.00, costCenter: 'Bakery-Main' }
    ]
  }
];

export const COMPLIANCE_RECORDS = [
  { id: 'comp-01', branchId: 'br-01', auditDate: '2026-03-01', auditType: 'Health & Safety', inspector: 'City of JHB Health Dept', overallScore: 92, maxScore: 100, status: 'Compliant', nextAuditDate: '2026-09-01', categories: [{ name: 'Cleanliness', score: 25, max: 25 }, { name: 'Storage', score: 20, max: 25 }] },
  { id: 'comp-02', branchId: 'br-02', auditDate: '2026-03-15', auditType: 'Fire Safety', inspector: 'Tshwane Fire Services', overallScore: 85, maxScore: 100, status: 'Compliant', nextAuditDate: '2027-03-15', categories: [] },
  { id: 'comp-03', branchId: 'br-03', auditDate: '2026-02-20', auditType: 'Food Safety (HACCP)', inspector: 'Internal Audit', overallScore: 78, maxScore: 100, status: 'Conditional', nextAuditDate: '2026-04-20', categories: [] },
  { id: 'comp-04', branchId: 'br-01', auditDate: '2026-03-28', auditType: 'Labour Compliance', inspector: 'Dept of Labour', overallScore: 100, maxScore: 100, status: 'Compliant', nextAuditDate: '2027-03-28', categories: [] },
];

export const QC_CHECKS = [
  { id: 'qc-01', productionBatchId: 'pb-001', ingredientBatchId: null, checkType: 'Visual/Crust', result: 'Pass', failureCategory: null, wasteCost: 0, checkedBy: 'emp-01', checkDate: '2026-03-31', notes: 'Perfect golden crust' },
  { id: 'qc-02', productionBatchId: 'pb-002', ingredientBatchId: null, checkType: 'Weight Check', result: 'Pass', failureCategory: null, wasteCost: 0, checkedBy: 'emp-03', checkDate: '2026-03-31', notes: 'All within 5g tolerance' },
  { id: 'qc-03', productionBatchId: null, ingredientBatchId: 'bat-01', checkType: 'Ingredient Quality', result: 'Pass', failureCategory: null, wasteCost: 0, checkedBy: 'emp-01', checkDate: '2026-03-15', notes: 'Flour moisture levels optimal' },
  { id: 'qc-04', productionBatchId: 'pb-003', ingredientBatchId: null, checkType: 'Taste Test', result: 'Fail', failureCategory: 'Under-baked', wasteCost: 450.00, checkedBy: 'emp-05', checkDate: '2026-03-31', notes: 'Batch discarded due to raw center' },
];

export const MATERIAL_PRICE_HISTORY = [
  { id: 'mph-01', ingredientId: 'ing-01', effectiveDate: '2026-01-01', unitCost: 12.00, supplierId: 'sup-01', changeReason: 'Contract Renewal' },
  { id: 'mph-02', ingredientId: 'ing-01', effectiveDate: '2026-03-01', unitCost: 12.50, supplierId: 'sup-01', changeReason: 'Fuel Surcharge' },
];

export const RATE_CHANGE_REASONS = [
  { id: 'rcr-01', label: 'Annual Increase' },
  { id: 'rcr-02', label: 'Promotion' },
  { id: 'rcr-03', label: 'Market Adjustment' },
  { id: 'rcr-04', label: 'Performance Bonus' },
];

export const USER_ROLES = [
  { id: 'rol-01', roleName: 'Administrator', permissions: { dashboard: 'readwrite', recipes: 'readwrite', production: 'readwrite', finance: 'readwrite', settings: 'readwrite' } },
  { id: 'rol-02', roleName: 'Production Manager', permissions: { dashboard: 'read', recipes: 'readwrite', production: 'readwrite', finance: 'none', settings: 'read' } },
  { id: 'rol-03', roleName: 'Branch Staff', permissions: { dashboard: 'read', recipes: 'read', production: 'readwrite', finance: 'none', settings: 'none' } },
];

export const USERS = [
  { id: 'usr-01', name: 'Admin User', email: 'admin@shuku.co.za', roleId: 'rol-01', branchId: 'br-01', isActive: true },
  { id: 'usr-02', name: 'Thabo Mokoena', email: 'thabo@shuku.co.za', roleId: 'rol-02', branchId: 'br-01', isActive: true },
  { id: 'usr-03', name: 'Sarah Moonsamy', email: 'sarah@shuku.co.za', roleId: 'rol-03', branchId: 'br-01', isActive: true },
  { id: 'usr-04', name: 'Sipho Zulu', email: 'sipho@shuku.co.za', roleId: 'rol-02', branchId: 'br-03', isActive: true },
];
