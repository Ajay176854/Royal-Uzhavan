-- Royal Uzhavan - Seed Data
-- Seeds all 5 categories and 12 products from frontend data.ts

-- ============================================
-- Categories
-- ============================================
INSERT INTO categories (name, image) VALUES
  ('Traditional Rice', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400'),
  ('Cold Pressed Edible Oil', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400'),
  ('Vegetables', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400'),
  ('Keerai Greens', 'https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400'),
  ('Farm Pantry', 'https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=400')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- Products
-- ============================================

-- Traditional Rice products
INSERT INTO products (slug, name, category_id, animal_type, price, original_price, discount, rating, reviews, image, tags, variants, in_stock)
VALUES
  ('rathasali-rice', 'Rathasali Rice',
    (SELECT id FROM categories WHERE name = 'Traditional Rice'),
    'Human', 180.00, 200.00, 10, 4.8, 156,
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    ARRAY['Royal Uzhavan Favourites', 'Organic'], ARRAY[1, 5, 10], true),

  ('mapillai-samba-rice', 'Mapillai Samba Rice',
    (SELECT id FROM categories WHERE name = 'Traditional Rice'),
    'Human', 180.00, 200.00, 10, 4.9, 345,
    'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=600',
    ARRAY['Bestseller', 'Organic'], ARRAY[1, 5, 10], true),

  ('karuppu-kavuni-rice', 'Karuppu Kavuni Rice (Black Rice)',
    (SELECT id FROM categories WHERE name = 'Traditional Rice'),
    'Human', 250.00, NULL, 0, 4.9, 210,
    'https://images.unsplash.com/photo-1621066793649-e26090eeb6ce?auto=format&fit=crop&q=80&w=600',
    ARRAY['Health Focused', 'Organic'], ARRAY[1, 5], true),

  ('kichili-samba-rice', 'Kichili Samba Rice',
    (SELECT id FROM categories WHERE name = 'Traditional Rice'),
    'Human', 160.00, NULL, 0, 4.8, 420,
    'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=600',
    ARRAY[]::TEXT[], ARRAY[1, 5, 10, 25], true),

  ('thooyamalli-rice', 'Thooyamalli Rice',
    (SELECT id FROM categories WHERE name = 'Traditional Rice'),
    'Human', 150.00, NULL, 0, 4.7, 310,
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    ARRAY[]::TEXT[], ARRAY[1, 5, 10], true),

  ('mysore-malli-rice', 'Mysore Malli Rice',
    (SELECT id FROM categories WHERE name = 'Traditional Rice'),
    'Human', 175.00, NULL, 0, 4.8, 189,
    'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=600',
    ARRAY[]::TEXT[], ARRAY[1, 5], true),

-- Cold Pressed Edible Oil products
  ('ground-nut-oil', 'Ground Nut Oil (Cold Pressed)',
    (SELECT id FROM categories WHERE name = 'Cold Pressed Edible Oil'),
    'Human', 320.00, 350.00, 8, 4.9, 512,
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600',
    ARRAY['Bestseller'], ARRAY[1, 5], true),

  ('sesame-oil', 'Sesame Oil / Gingelly Oil (Cold Pressed)',
    (SELECT id FROM categories WHERE name = 'Cold Pressed Edible Oil'),
    'Human', 450.00, NULL, 0, 4.8, 310,
    'https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=600',
    ARRAY['Premium'], ARRAY[1, 5], true),

  ('coconut-oil', 'Coconut Oil (Cold Pressed)',
    (SELECT id FROM categories WHERE name = 'Cold Pressed Edible Oil'),
    'Human', 280.00, NULL, 0, 4.7, 180,
    'https://images.unsplash.com/photo-1626806787426-5910811b6325?auto=format&fit=crop&q=80&w=600',
    ARRAY[]::TEXT[], ARRAY[1, 5], true),

-- Vegetables
  ('organic-veggie-basket', 'Organic Veggie Basket',
    (SELECT id FROM categories WHERE name = 'Vegetables'),
    'Human', 350.00, NULL, 0, 4.9, 156,
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    ARRAY['Fresh Daily'], ARRAY[5, 10], true),

-- Keerai Greens
  ('organic-spinach-keerai', 'Organic Spinach (Keerai)',
    (SELECT id FROM categories WHERE name = 'Keerai Greens'),
    'Human', 60.00, NULL, 0, 4.7, 89,
    'https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=600',
    ARRAY['Morning Harvest'], ARRAY[1], true),

-- Farm Pantry products
  ('pure-desi-cow-ghee', 'Pure Desi Cow Ghee',
    (SELECT id FROM categories WHERE name = 'Farm Pantry'),
    'Human', 850.00, 950.00, 10, 5.0, 420,
    'https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=600',
    ARRAY['Premium'], ARRAY[1, 2], true),

  ('raw-forest-honey', 'Raw Forest Honey',
    (SELECT id FROM categories WHERE name = 'Farm Pantry'),
    'Human', 450.00, NULL, 0, 4.8, 215,
    'https://images.unsplash.com/photo-1587049352847-81a56d773c1c?auto=format&fit=crop&q=80&w=600',
    ARRAY['Unprocessed'], ARRAY[1], true),

  ('traditional-jaggery-powder', 'Traditional Jaggery Powder',
    (SELECT id FROM categories WHERE name = 'Farm Pantry'),
    'Human', 120.00, NULL, 0, 4.9, 320,
    'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=600',
    ARRAY['Bestseller', 'Royal Uzhavan Favourites'], ARRAY[1, 2], true)

ON CONFLICT (slug) DO NOTHING;


-- Admin User
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@royaluzhavan.com', '.Ofayx0ZLQ.uYOZ5u.fOOBG2QKZvwFB0.LYeA7D.B8kS0q26', 'admin')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role;
