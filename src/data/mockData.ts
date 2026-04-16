import { 
  Branch, 
  Supplier, 
  IngredientCategory, 
  Ingredient, 
  IngredientBatch, 
  Recipe, 
  SKU, 
  Crew, 
  Employee, 
  ProductionBatch, 
  ComplianceRecord, 
  QCCheck,
  MaterialPriceHistory,
  EmployeeRateHistory,
  JournalEntry,
  User,
  UserRole
} from '../types/entities';

export const BRANCHES: Branch[] = [
  { id: 'br-01', name: 'Main Bakery (Johannesburg)', location: 'City Deep, Johannesburg', manager: 'Thabo Mokoena', isActive: true },
  { id: 'br-02', name: 'North Branch (Pretoria)', location: 'Silverton, Pretoria', manager: 'Annatjie van der Merwe', isActive: true },
  { id: 'br-03', name: 'East Branch (Benoni)', location: 'Apex, Benoni', manager: 'Sipho Zulu', isActive: true },
];

export const SUPPLIERS: Supplier[] = [
  { id: 'sup-01', name: 'Sasko Flour Mills', contactPerson: 'Johan Botha', email: 'johan@sasko.co.za', phone: '011-456-7890', address: '12 Mill St, Randburg', paymentTerms: '30 Days', isActive: true },
  { id: 'sup-02', name: 'Selati Sugar', contactPerson: 'Priya Naidoo', email: 'p.naidoo@selati.com', phone: '031-222-3333', address: '4 Sugar Cane Way, Durban', paymentTerms: '15 Days', isActive: true },
  { id: 'sup-03', name: 'Clover Dairy', contactPerson: 'Chris Coetzee', email: 'chris.c@clover.co.za', phone: '012-888-9999', address: '88 Milk Rd, Midrand', paymentTerms: '7 Days', isActive: true },
];

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  { id: 'cat-01', name: 'Flour & Grains', description: 'Primary bulk flours', isAllergenCategory: true },
  { id: 'cat-02', name: 'Sweeteners', description: 'Sugars and syrups', isAllergenCategory: false },
  { id: 'cat-03', name: 'Dairy', description: 'Milk, butter, and cream', isAllergenCategory: true },
  { id: 'cat-04', name: 'Leavening Agents', description: 'Yeast and baking powder', isAllergenCategory: false },
  { id: 'cat-05', name: 'Seeds & Toppings', description: 'Sesame, poppy seeds, etc.', isAllergenCategory: true },
];

export const INGREDIENTS: Ingredient[] = [
  { id: 'ing-01', name: 'Bread Flour (White)', categoryId: 'cat-01', supplierId: 'sup-01', unit: 'kg', standardCost: 12.50, reorderLevel: 500, currentStock: 1200, isAllergen: true, allergenType: 'Gluten' },
  { id: 'ing-02', name: 'White Sugar', categoryId: 'cat-02', supplierId: 'sup-02', unit: 'kg', standardCost: 18.20, reorderLevel: 200, currentStock: 450, isAllergen: false, allergenType: null },
  { id: 'ing-03', name: 'Fine Salt', categoryId: 'cat-02', supplierId: 'sup-01', unit: 'kg', standardCost: 5.40, reorderLevel: 50, currentStock: 80, isAllergen: false, allergenType: null },
  { id: 'ing-04', name: 'Instant Dry Yeast', categoryId: 'cat-04', supplierId: 'sup-01', unit: 'kg', standardCost: 85.00, reorderLevel: 20, currentStock: 35, isAllergen: false, allergenType: null },
  { id: 'ing-05', name: 'Salted Butter', categoryId: 'cat-03', supplierId: 'sup-03', unit: 'kg', standardCost: 110.00, reorderLevel: 40, currentStock: 65, isAllergen: true, allergenType: 'Dairy' },
  { id: 'ing-06', name: 'Large Eggs', categoryId: 'cat-03', supplierId: 'sup-03', unit: 'unit', standardCost: 2.10, reorderLevel: 360, currentStock: 720, isAllergen: true, allergenType: 'Eggs' },
  { id: 'ing-07', name: 'Sesame Seeds', categoryId: 'cat-05', supplierId: 'sup-02', unit: 'kg', standardCost: 95.00, reorderLevel: 10, currentStock: 15, isAllergen: true, allergenType: 'Seeds' },
  { id: 'ing-08', name: 'Full Cream Milk', categoryId: 'cat-03', supplierId: 'sup-03', unit: 'L', standardCost: 16.50, reorderLevel: 100, currentStock: 180, isAllergen: true, allergenType: 'Dairy' },
];

export const INGREDIENT_BATCHES: IngredientBatch[] = [
  { id: 'bat-01', ingredientId: 'ing-01', batchNumber: 'SAS-FL-001', supplierId: 'sup-01', receivedDate: '2026-03-15', expiryDate: '2026-09-15', quantity: 600, currentQty: 450, unitCost: 12.20, branchId: 'br-01', status: 'Available', certificationNumber: 'CERT-9982' },
  { id: 'bat-02', ingredientId: 'ing-01', batchNumber: 'SAS-FL-002', supplierId: 'sup-01', receivedDate: '2026-03-28', expiryDate: '2026-09-28', quantity: 600, currentQty: 600, unitCost: 12.80, branchId: 'br-01', status: 'Available', certificationNumber: 'CERT-9995' },
  { id: 'bat-03', ingredientId: 'ing-02', batchNumber: 'SEL-SG-442', supplierId: 'sup-02', receivedDate: '2026-03-10', expiryDate: '2027-03-10', quantity: 225, currentQty: 100, unitCost: 18.00, branchId: 'br-01', status: 'Available', certificationNumber: 'S-102' },
  { id: 'bat-04', ingredientId: 'ing-02', batchNumber: 'SEL-SG-445', supplierId: 'sup-02', receivedDate: '2026-03-25', expiryDate: '2027-03-25', quantity: 225, currentQty: 225, unitCost: 18.40, branchId: 'br-01', status: 'Available', certificationNumber: 'S-105' },
];

export const RECIPES: Recipe[] = [
  {
    id: 'rec-01',
    name: 'White Sandwich Loaf',
    version: '1.2',
    branchId: 'br-01',
    yieldUnits: 100,
    yieldWeight: 80, // kg
    yieldUnit: 'Units',
    category: 'Bread',
    status: 'Active',
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
      { name: 'Plastic Bread Bag', quantity: 100, unit: 'unit', cost: 0.5 },
      { name: 'Bread Tie', quantity: 100, unit: 'unit', cost: 0.1 }
    ]
  },
  {
    id: 'rec-02',
    name: 'Sesame Dinner Roll',
    version: '2.0',
    branchId: 'br-01',
    yieldUnits: 500,
    yieldWeight: 25, // kg
    yieldUnit: 'Units',
    category: 'Rolls',
    status: 'Active',
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
      { name: 'Roll Pack Bag (Small)', quantity: 125, unit: 'unit', cost: 0.8 }
    ]
  }
];

export interface PackagingMaterial {
  id: string;
  name: string;
  unit: string;
  cost: number;
}

export const PACKAGING_MATERIALS: PackagingMaterial[] = [
  { id: 'pkg-01', name: 'Plastic Bread Bag', unit: 'unit', cost: 0.50 },
  { id: 'pkg-02', name: 'Bread Tie', unit: 'unit', cost: 0.10 },
  { id: 'pkg-03', name: 'Roll Pack Bag (Small)', unit: 'unit', cost: 0.80 },
  { id: 'pkg-04', name: 'Roll Pack Bag (Large)', unit: 'unit', cost: 1.20 },
  { id: 'pkg-05', name: 'Cardboard Box (Bulk)', unit: 'unit', cost: 5.50 },
];

export const SKUS: SKU[] = [
  { id: 'sku-01', recipeId: 'rec-01', name: 'White Loaf x1 (Retail)', clientName: 'Checkers Hyper', packagingConfig: 1, packagingMaterialId: 'pkg-01', standardCost: 14.50, sellingPrice: 18.99, branchId: 'br-01' },
  { id: 'sku-02', recipeId: 'rec-02', name: 'Dinner Roll x4 (Restaurant A)', clientName: 'Spur Steak Ranches', packagingConfig: 4, packagingMaterialId: 'pkg-02', standardCost: 8.20, sellingPrice: 12.50, branchId: 'br-01' },
  { id: 'sku-03', recipeId: 'rec-02', name: 'Dinner Roll x6 (Restaurant B)', clientName: 'Mugg & Bean', packagingConfig: 6, packagingMaterialId: 'pkg-03', standardCost: 11.80, sellingPrice: 16.00, branchId: 'br-01' },
  { id: 'sku-04', recipeId: 'rec-01', name: 'White Loaf x2 (Wholesale)', clientName: 'Local Spaza Shop', packagingConfig: 2, packagingMaterialId: 'pkg-01', standardCost: 27.00, sellingPrice: 34.00, branchId: 'br-01' },
];

export const CREWS: Crew[] = [
  { id: 'crw-01', name: 'Alpha Morning Crew', branchId: 'br-01', shiftType: 'morning', supervisor: 'Lindiwe Dlamini', members: ['emp-01', 'emp-02'] },
  { id: 'crw-02', name: 'Beta Evening Crew', branchId: 'br-01', shiftType: 'evening', supervisor: 'Kobus Coetzee', members: ['emp-03', 'emp-04'] },
  { id: 'crw-03', name: 'Gamma Night Crew', branchId: 'br-02', shiftType: 'night', supervisor: 'Zanele Khumalo', members: ['emp-05', 'emp-06'] },
];

export const EMPLOYEES: Employee[] = [
  { id: 'emp-01', name: 'John Sithole', employeeCode: 'SHU001', crewId: 'crw-01', role: 'Head Baker', standardHourlyRate: 85.00, overtimeRate: 127.50 },
  { id: 'emp-02', name: 'Sarah Moonsamy', employeeCode: 'SHU002', crewId: 'crw-01', role: 'Assistant Baker', standardHourlyRate: 55.00, overtimeRate: 82.50 },
  { id: 'emp-03', name: 'Pieter Viljoen', employeeCode: 'SHU003', crewId: 'crw-02', role: 'Mixer Operator', standardHourlyRate: 60.00, overtimeRate: 90.00 },
  { id: 'emp-04', name: 'Nomsa Cele', employeeCode: 'SHU004', crewId: 'crw-02', role: 'Packer', standardHourlyRate: 45.00, overtimeRate: 67.50 },
  { id: 'emp-05', name: 'David Mbeki', employeeCode: 'SHU005', crewId: 'crw-03', role: 'Head Baker', standardHourlyRate: 88.00, overtimeRate: 132.00 },
  { id: 'emp-06', name: 'Elena Petrova', employeeCode: 'SHU006', crewId: 'crw-03', role: 'Assistant Baker', standardHourlyRate: 58.00, overtimeRate: 87.00 },
];

export const PRODUCTION_BATCHES: ProductionBatch[] = [
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
  { 
    id: 'pb-004', 
    recipeId: 'rec-02', 
    branchId: 'br-03', 
    crewId: 'crw-01', 
    plannedQty: 500, 
    currentStage: 'Mixing', 
    startDate: '2026-04-01T08:00:00', 
    status: 'In Progress',
    stageHistory: []
  },
];

export const COMPLIANCE_RECORDS: ComplianceRecord[] = [
  { id: 'comp-01', branchId: 'br-01', auditDate: '2026-03-01', auditType: 'Health & Safety', inspector: 'City of JHB Health Dept', overallScore: 92, maxScore: 100, status: 'Compliant', nextAuditDate: '2026-09-01', categories: [{ name: 'Cleanliness', score: 25, max: 25 }, { name: 'Storage', score: 20, max: 25 }] },
  { id: 'comp-02', branchId: 'br-02', auditDate: '2026-03-15', auditType: 'Fire Safety', inspector: 'Tshwane Fire Services', overallScore: 85, maxScore: 100, status: 'Compliant', nextAuditDate: '2027-03-15', categories: [] },
  { id: 'comp-03', branchId: 'br-03', auditDate: '2026-02-20', auditType: 'Food Safety (HACCP)', inspector: 'Internal Audit', overallScore: 78, maxScore: 100, status: 'Conditional', nextAuditDate: '2026-04-20', categories: [] },
  { id: 'comp-04', branchId: 'br-01', auditDate: '2026-03-28', auditType: 'Labour Compliance', inspector: 'Dept of Labour', overallScore: 100, maxScore: 100, status: 'Compliant', nextAuditDate: '2027-03-28', categories: [] },
];

export const QC_CHECKS: QCCheck[] = [
  { id: 'qc-01', productionBatchId: 'pb-001', ingredientBatchId: null, batchId: 'pb-001', checkType: 'Visual/Crust', result: 'Pass', status: 'Pass', failureCategory: null, wasteCost: 0, checkedBy: 'emp-01', checkDate: '2026-03-31', notes: 'Perfect golden crust' },
  { id: 'qc-02', productionBatchId: 'pb-002', ingredientBatchId: null, batchId: 'pb-002', checkType: 'Weight Check', result: 'Pass', status: 'Pass', failureCategory: null, wasteCost: 0, checkedBy: 'emp-03', checkDate: '2026-03-31', notes: 'All within 5g tolerance' },
  { id: 'qc-03', productionBatchId: null, ingredientBatchId: 'bat-01', batchId: 'bat-01', checkType: 'Ingredient Quality', result: 'Pass', status: 'Pass', failureCategory: null, wasteCost: 0, checkedBy: 'emp-01', checkDate: '2026-03-15', notes: 'Flour moisture levels optimal' },
  { id: 'qc-04', productionBatchId: 'pb-003', ingredientBatchId: null, batchId: 'pb-003', checkType: 'Taste Test', result: 'Fail', status: 'Fail', failureCategory: 'Under-baked', wasteCost: 450.00, checkedBy: 'emp-05', checkDate: '2026-03-31', notes: 'Batch discarded due to raw center' },
];

export const MATERIAL_PRICE_HISTORY: MaterialPriceHistory[] = [
  { id: 'mph-01', ingredientId: 'ing-01', date: '2026-01-01', price: 12.00, supplierId: 'sup-01', effectiveDate: '2026-01-01', unitCost: 12.00 },
  { id: 'mph-02', ingredientId: 'ing-01', date: '2026-02-01', price: 12.20, supplierId: 'sup-01', effectiveDate: '2026-02-01', unitCost: 12.20 },
  { id: 'mph-03', ingredientId: 'ing-01', date: '2026-03-01', price: 12.50, supplierId: 'sup-01', effectiveDate: '2026-03-01', unitCost: 12.50 },
];

export const EMPLOYEE_RATE_HISTORY: EmployeeRateHistory[] = [
  { id: 'erh-01', employeeId: 'emp-01', date: '2025-01-01', rate: 80.00, reason: 'Initial', effectiveDate: '2025-01-01', standardRate: 80.00, overtimeRate: 120.00, changeReason: 'Initial', changedBy: 'System' },
  { id: 'erh-02', employeeId: 'emp-01', date: '2026-01-01', rate: 85.00, reason: 'Annual Increase', effectiveDate: '2026-01-01', standardRate: 85.00, overtimeRate: 127.50, changeReason: 'Annual Increase', changedBy: 'Thabo Mokoena' },
];

export const JOURNAL_ENTRIES: JournalEntry[] = [
  { 
    id: 'je-01', 
    date: '2026-03-31', 
    description: 'Production Waste - Batch pb-003', 
    reference: 'QC-04',
    status: 'Posted',
    lines: [
      { accountId: 'acc-500', accountName: 'Production Waste Expense', accountCode: '500', costCenter: 'Bakery', debit: 450.00, credit: 0 },
      { accountId: 'acc-120', accountName: 'Inventory - Finished Goods', accountCode: '120', costCenter: 'Warehouse', debit: 0, credit: 450.00 }
    ]
  }
];

export const USERS: User[] = [
  { id: 'u-01', name: 'Thabo Mokoena', email: 'thabo@bakery.co.za', roleId: 'role-admin', branchId: 'br-01', lastLogin: '2026-04-01T08:30:00', isActive: true },
  { id: 'u-02', name: 'Sarah Moonsamy', email: 'sarah@bakery.co.za', roleId: 'role-user', branchId: 'br-01', lastLogin: '2026-03-31T10:15:00', isActive: true },
];

export const USER_ROLES: UserRole[] = [
  { id: 'role-admin', name: 'Administrator', roleName: 'Administrator', permissions: ['all'] },
  { id: 'role-user', name: 'Standard User', roleName: 'Standard User', permissions: ['read', 'write'] },
];


export const RATE_CHANGE_REASONS = [
  { id: 'rcr-01', label: 'Annual Increase' },
  { id: 'rcr-02', label: 'Promotion' },
  { id: 'rcr-03', label: 'Market Adjustment' },
  { id: 'rcr-04', label: 'Performance Bonus' },
];

export const BRANCH_TRANSFERS = [
  { id: 'tr-01', ingredientId: 'ing-01', batchId: 'bat-01', fromBranchId: 'br-01', toBranchId: 'br-02', quantity: 100, transferDate: '2026-03-20', status: 'Approved', approvedBy: 'Thabo Mokoena', cost: 1220.00 },
  { id: 'tr-02', ingredientId: 'ing-05', batchId: 'bat-05', fromBranchId: 'br-01', toBranchId: 'br-03', quantity: 10, transferDate: '2026-03-25', status: 'Pending', approvedBy: null, cost: 1100.00 },
];

