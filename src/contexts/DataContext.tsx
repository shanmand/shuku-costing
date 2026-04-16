import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as mockData from '../data/mockData';

interface DataContextType {
  branches: any[];
  suppliers: any[];
  categories: any[];
  ingredients: any[];
  recipes: any[];
  skus: any[];
  crews: any[];
  employees: any[];
  productionBatches: any[];
  ingredientBatches: any[];
  packagingMaterials: any[];
  materialPriceHistory: any[];
  employeeRateHistory: any[];
  qcChecks: any[];
  complianceRecords: any[];
  journalEntries: any[];
  transfers: any[];
  roles: any[];
  users: any[];
  rateChangeReasons: any[];
  loading: boolean;
  refreshAll: () => Promise<void>;
  saveItem: (table: string, item: any) => Promise<any>;
  removeItem: (table: string, id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const isSupabaseConfigured = 
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder';

const camelToSnake = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const snakeToCamel = (str: string) => str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));

const convertKeys = (obj: any, converter: (s: string) => string): any => {
  if (Array.isArray(obj)) return obj.map(v => convertKeys(v, converter));
  if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    const n: any = {};
    for (const key in obj) {
      n[converter(key)] = convertKeys(obj[key], converter);
    }
    return n;
  }
  return obj;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>({
    branches: [],
    suppliers: [],
    categories: [],
    ingredients: [],
    recipes: [],
    skus: [],
    crews: [],
    employees: [],
    productionBatches: [],
    ingredientBatches: [],
    packagingMaterials: [],
    materialPriceHistory: [],
    employeeRateHistory: [],
    qcChecks: [],
    complianceRecords: [],
    journalEntries: [],
    transfers: [],
    roles: [],
    users: [],
    rateChangeReasons: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!isSupabaseConfigured) {
      setData({
        branches: mockData.BRANCHES,
        suppliers: mockData.SUPPLIERS,
        categories: mockData.INGREDIENT_CATEGORIES,
        ingredients: mockData.INGREDIENTS,
        recipes: mockData.RECIPES,
        skus: mockData.SKUS,
        crews: mockData.CREWS,
        employees: mockData.EMPLOYEES,
        productionBatches: mockData.PRODUCTION_BATCHES,
        ingredientBatches: mockData.INGREDIENT_BATCHES,
        packagingMaterials: mockData.PACKAGING_MATERIALS,
        materialPriceHistory: mockData.MATERIAL_PRICE_HISTORY,
        employeeRateHistory: mockData.EMPLOYEE_RATE_HISTORY,
        qcChecks: mockData.QC_CHECKS,
        complianceRecords: mockData.COMPLIANCE_RECORDS,
        journalEntries: mockData.JOURNAL_ENTRIES,
        transfers: mockData.BRANCH_TRANSFERS,
        roles: mockData.USER_ROLES,
        users: mockData.USERS,
        rateChangeReasons: mockData.RATE_CHANGE_REASONS
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const tables = [
        'branches', 'suppliers', 'ingredient_categories', 'ingredients', 
        'recipes', 'skus', 'crews', 'employees', 'production_batches', 
        'ingredient_batches', 'packaging_materials', 'material_price_history',
        'employee_rate_history', 'qc_checks', 'compliance_audits', 'journal_entries',
        'transfers', 'roles', 'users', 'rate_change_reasons'
      ];

      const results = await Promise.all(
        tables.map(table => supabase.from(table).select('*'))
      );

      const newData: any = {};
      tables.forEach((table, index) => {
        const key = table.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        // Map 'ingredient_categories' to 'categories' for compatibility
        let finalKey = key === 'ingredientCategories' ? 'categories' : key;
        // Map 'complianceAudits' to 'complianceRecords' for compatibility
        if (finalKey === 'complianceAudits') finalKey = 'complianceRecords';
        
        newData[finalKey] = convertKeys(results[index].data || [], snakeToCamel);
      });

      setData(newData);
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const saveItem = async (table: string, item: any) => {
    if (!isSupabaseConfigured) {
      const key = table.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      const finalKey = key === 'ingredientCategories' ? 'categories' : key;
      const id = item.id || Math.random().toString(36).substr(2, 9);
      const newItem = { ...item, id };
      
      setData((prev: any) => ({
        ...prev,
        [finalKey]: item.id 
          ? prev[finalKey].map((i: any) => i.id === item.id ? newItem : i)
          : [...prev[finalKey], newItem]
      }));
      return newItem;
    }

    const itemToSave = convertKeys(item, camelToSnake);
    console.log(`Supabase Debug: Saving to ${table}`, itemToSave);

    const { data: result, error } = await supabase
      .from(table)
      .upsert([itemToSave], { onConflict: 'id' })
      .select();

    if (error) {
      console.error(`Supabase Write Error [Table: ${table}]:`, {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        payload: itemToSave
      });
      throw error;
    }
    
    await fetchAll(); // Refresh to get updated state
    return convertKeys(result[0], snakeToCamel);
  };

  const removeItem = async (table: string, id: string) => {
    if (!isSupabaseConfigured) {
      const key = table.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      const finalKey = key === 'ingredientCategories' ? 'categories' : key;
      setData((prev: any) => ({
        ...prev,
        [finalKey]: prev[finalKey].filter((i: any) => i.id !== id)
      }));
      return;
    }

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    await fetchAll();
  };

  return (
    <DataContext.Provider value={{ ...data, loading, refreshAll: fetchAll, saveItem, removeItem }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
