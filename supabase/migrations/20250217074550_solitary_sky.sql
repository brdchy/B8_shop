/*
  # Initial Shop Database Schema

  1. New Tables
    - `categories`
      - `id` (serial, primary key)
      - `name` (text, unique)
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (serial, primary key)
      - `barcode` (text, unique)
      - `name` (text)
      - `category_id` (references categories)
      - `quantity` (integer)
      - `price` (decimal)
      - `created_at` (timestamptz)
    
    - `buyers`
      - `id` (serial, primary key Continuing the SQL migration file exactly where it left off:

      - `name` (text)
      - `passport_data` (text, unique)
      - `created_at` (timestamptz)
    
    - `sales`
      - `id` (serial, primary key)
      - `buyer_id` (references buyers)
      - `product_id` (references products)
      - `quantity` (integer)
      - `total_price` (decimal)
      - `date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read categories"
    ON categories FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert categories"
    ON categories FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    barcode TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read products"
    ON products FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert products"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
    ON products FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Buyers table
CREATE TABLE buyers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    passport_data TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read buyers"
    ON buyers FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert buyers"
    ON buyers FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Sales table
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER REFERENCES buyers(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read sales"
    ON sales FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert sales"
    ON sales FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_sales_buyer ON sales(buyer_id);
CREATE INDEX idx_sales_product ON sales(product_id);
CREATE INDEX idx_sales_date ON sales(date);