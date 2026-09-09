-- Royal Uzhavan - Database Schema (Production)
-- PostgreSQL (Supabase-compatible)

-- ============================================
-- Users table (authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(200) NOT NULL,
  email           VARCHAR(200) NOT NULL UNIQUE,
  phone           VARCHAR(20),
  password_hash   TEXT NOT NULL,
  role            VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  address         JSONB,
  token_version   INTEGER DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- Categories table
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL UNIQUE,
  image       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Products table
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(100) NOT NULL UNIQUE,
  name            VARCHAR(200) NOT NULL,
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  animal_type     VARCHAR(50) DEFAULT 'Human',
  price           DECIMAL(10,2) NOT NULL,
  original_price  DECIMAL(10,2),
  discount        INTEGER DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
  rating          DECIMAL(2,1) DEFAULT 0,
  reviews         INTEGER DEFAULT 0,
  image           TEXT,
  tags            TEXT[] DEFAULT '{}',
  variants        INTEGER[] DEFAULT '{}',
  in_stock        BOOLEAN DEFAULT TRUE,
  stock_quantity  INTEGER DEFAULT 0,
  description     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);

-- ============================================
-- Orders table
-- ============================================
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001;

CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    VARCHAR(20),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name   VARCHAR(200) NOT NULL,
  customer_email  VARCHAR(200) NOT NULL,
  customer_phone  VARCHAR(20) NOT NULL,
  shipping_address JSONB NOT NULL,
  items           JSONB NOT NULL,
  subtotal        DECIMAL(10,2) NOT NULL,
  shipping_fee    DECIMAL(10,2) DEFAULT 0,
  total           DECIMAL(10,2) NOT NULL,
  status          VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_method  VARCHAR(50),
  tracking_info   JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- Auto-generate order numbers (RU-1001, RU-1002, ...)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number = 'RU-' || nextval('order_number_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- ============================================
-- Contact Messages table
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  email       VARCHAR(200) NOT NULL,
  phone       VARCHAR(20),
  subject     VARCHAR(300),
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Blacklisted Customers (COD Fraud Prevention)
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
-- Auto-update updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
