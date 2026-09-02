-- Royal Uzhavan - Database Schema
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
  description     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- ============================================
-- Orders table
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
