-- Royal Uzhavan — Production Migration
-- Adds stock management + COD fraud prevention tables

-- ============================================
-- 1. Stock Quantity on Products
-- ============================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;

-- Migrate: set stock_quantity = 50 for in-stock products, 0 for out-of-stock
UPDATE products SET stock_quantity = CASE WHEN in_stock = true THEN 50 ELSE 0 END
WHERE stock_quantity = 0;

-- Index for quick stock lookups
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);

-- ============================================
-- 2. Blacklisted Customers (COD Fraud Prevention)
-- ============================================
CREATE TABLE IF NOT EXISTS blacklisted_customers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       VARCHAR(20),
  email       VARCHAR(200),
  reason      TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_blacklist_phone ON blacklisted_customers(phone);
CREATE INDEX IF NOT EXISTS idx_blacklist_email ON blacklisted_customers(email);

-- ============================================
-- 3. Add order_number column for human-readable IDs
-- ============================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(20);

-- Create a sequence for auto-incrementing order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001;

-- Function to generate order numbers like RU-1001, RU-1002
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number = 'RU-' || nextval('order_number_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-set order_number on insert
DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Backfill existing orders
UPDATE orders SET order_number = 'RU-' || nextval('order_number_seq')
WHERE order_number IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
