export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export interface Product {
  id: number;
  barcode: string;
  name: string;
  category_id: number;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Buyer {
  id: number;
  name: string;
  passport_data: string;
  created_at: string;
}

export interface Sale {
  id: number;
  buyer_id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  date: string;
  created_at: string;
}