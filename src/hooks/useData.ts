import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as mockData from '../data/mockData';

const isSupabaseConfigured = 
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder';

export function useData<T>(tableName: string, mockArray: T[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    if (!isSupabaseConfigured) {
      setData(mockArray);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from(tableName)
        .select('*');

      if (error) throw error;
      
      // If table is empty, we might want to seed it with mock data or just leave it empty
      // For now, if it's empty, we return empty array as requested (remove demo data)
      setData(result || []);
    } catch (err) {
      console.error(`Error fetching from ${tableName}:`, err);
      setError(err);
      setData(mockArray); // Fallback to mock on error so app doesn't crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const addItem = async (item: any) => {
    if (!isSupabaseConfigured) {
      const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
      setData(prev => [...prev, newItem]);
      return newItem;
    }

    const { data: result, error } = await supabase
      .from(tableName)
      .insert([item])
      .select();

    if (error) throw error;
    setData(prev => [...prev, ...result]);
    return result[0];
  };

  const updateItem = async (id: string, updates: any) => {
    if (!isSupabaseConfigured) {
      setData(prev => prev.map(item => (item as any).id === id ? { ...item, ...updates } : item));
      return;
    }

    const { error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    setData(prev => prev.map(item => (item as any).id === id ? { ...item, ...updates } : item));
  };

  const deleteItem = async (id: string) => {
    if (!isSupabaseConfigured) {
      setData(prev => prev.filter(item => (item as any).id !== id));
      return;
    }

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    setData(prev => prev.filter(item => (item as any).id !== id));
  };

  return { data, loading, error, addItem, updateItem, deleteItem, refresh: fetchData };
}
