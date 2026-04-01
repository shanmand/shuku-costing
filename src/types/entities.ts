/**
 * TypeScript interfaces for the bakery costing system.
 * These interfaces ensure that all array properties are non-optional
 * to prevent runtime errors when using .map().
 */

export interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  isActive: boolean;
}

export interface IngredientCategory {
  id: string;
  name: string;
  description: string;
  isAllergenCategory: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  categoryId: string;
  supplierId: string;
  unit: string;
  standardCost: number;
  reorderLevel: number;
  currentStock: number;
  isAllergen: boolean;
  allergenType: string | null;
}

export interface IngredientBatch {
  id: string;
  ingredientId: string;
  batchNumber: string;
  supplierId: string;
  receivedDate: string;
  expiryDate: string;
  quantity: number;
  currentQty?: number; // Added for InventoryPlanning
  unitCost: number;
  branchId: string;
  status: string;
  certificationNumber: string;
}

export interface RecipeStage {
  name: string;
  ingredients: {
    ingredientId: string;
    quantity: number;
    unit: string;
  }[];
}

export interface Recipe {
  id: string;
  name: string;
  version: string;
  branchId: string;
  yieldUnits: number;
  yieldWeight: number;
  yieldUnit?: string;
  category?: string;
  status?: string;
  mixTime?: number;
  provingTime?: number;
  bakingTemp?: number;
  bakingTime?: number;
  coolingTime?: number;
  expectedWaste?: number;
  stages: RecipeStage[];
  packagingItems: {
    name: string;
    quantity: number;
    unit: string;
    cost?: number;
  }[];
}

export interface SKU {
  id: string;
  recipeId: string;
  name: string;
  clientName: string;
  packagingConfig: number;
  packagingMaterialId: string;
  standardCost: number;
  sellingPrice: number;
  branchId: string;
}

export interface Crew {
  id: string;
  name: string;
  branchId: string;
  shiftType: string;
  supervisor: string;
  members: string[];
}

export interface Employee {
  id: string;
  name: string;
  employeeCode: string;
  crewId: string;
  role: string;
  standardHourlyRate: number;
  overtimeRate: number;
}

export interface ProductionBatch {
  id: string;
  recipeId: string;
  branchId: string;
  crewId: string;
  plannedQty: number;
  currentStage: string;
  startDate: string;
  status: string;
  stageHistory: {
    stage: string;
    completedAt: string;
    user: string;
  }[];
}

export interface QCCheck {
  id: string;
  productionBatchId: string | null;
  ingredientBatchId: string | null;
  batchId?: string; // Added for compatibility with Suppliers.tsx
  checkType: string;
  result: string;
  status?: string; // Added for compatibility with Suppliers.tsx
  failureCategory: string | null;
  wasteCost: number;
  checkedBy: string;
  checkDate: string;
  notes: string;
}

export interface MaterialPriceHistory {
  id: string;
  ingredientId: string;
  date: string;
  price: number;
  supplierId: string;
  effectiveDate: string;
  unitCost: number;
}

export interface EmployeeRateHistory {
  id: string;
  employeeId: string;
  date: string;
  rate: number;
  reason: string;
  effectiveDate: string;
  standardRate: number;
  overtimeRate: number;
  changeReason: string;
  changedBy: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  status: string;
  lines: {
    accountId: string;
    accountName: string;
    accountCode: string;
    costCenter: string;
    debit: number;
    credit: number;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  branchId: string;
  lastLogin: string;
  isActive: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  roleName: string;
  permissions: string[];
}

export interface ComplianceRecord {
  id: string;
  branchId: string;
  auditDate: string;
  auditType: string;
  inspector: string;
  overallScore: number;
  maxScore: number;
  status: string;
  nextAuditDate: string;
  categories: {
    name: string;
    score: number;
    max: number;
  }[];
}
