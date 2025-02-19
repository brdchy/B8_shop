import { create } from 'zustand';
import { Product, Category, Buyer, Sale } from '../types';
import { supabase } from '../lib/supabase';

interface StoreState {
  products: Product[];
  categories: Category[];
  buyers: Buyer[];
  sales: Sale[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'created_at'>) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  categories: [],
  buyers: [],
  sales: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      set({ categories: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addProduct: async (product) => {
    try {
      set({ loading: true });
      const { error } = await supabase
        .from('products')
        .insert([product]);
      
      if (error) throw error;
      get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateProduct: async (id, updates) => {
    try {
      set({ loading: true });
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addCategory: async (name) => {
    try {
      set({ loading: true });
      const { error } = await supabase
        .from('categories')
        .insert([{ name }]);
      
      if (error) throw error;
      get().fetchCategories();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addSale: async (sale) => {
    try {
      set({ loading: true });
      const { error } = await supabase
        .from('sales')
        .insert([sale]);
      
      if (error) throw error;
      
      // Update product quantity
      const product = get().products.find(p => p.id === sale.product_id);
      if (product) {
        await get().updateProduct(product.id, {
          quantity: product.quantity - sale.quantity
        });
      }
      
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));