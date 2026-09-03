import json
import re

categories = [
    ("Royal Cattle Feed", "/images/cattle-food.png"),
    ("Royal Hen Feed", "/images/hen-food.png"),
    ("Royal Birds Food", "/images/birds-food.png"),
    ("Oil Cake (Punnakku)", "/images/royal-punnakku.png"),
    ("Farmer's Bran Types", "/images/royal-nutrition.png"),
    ("Oil Seeds & Millets", "/images/royal-grains.png"),
    ("Cereals, Millets & Grains", "/images/royal-cereals.jpg"),
    ("Cattle Feed & Seed Cake", "/images/royal-seed-theevanam.png"),
    ("Pulses Husk & Feed Waste", "/images/royal-thoosu-vagaigal.jpg"),
    ("Pigeon Health Supplements", "/images/hen-pigeon-supplement.png")
]

products = [
    # Royal Cattle Feed
    ("Royal Kalappu Theevanam (50kg)", "Royal Cattle Feed", "Cattle", 1280.00, "/images/cattle-food.png"),
    ("Royal Standard Mix Theevanam (45kg)", "Royal Cattle Feed", "Cattle", 1380.00, "/images/cattle-food.png"),
    ("Royal Gold Kalappu Theevanam (45kg)", "Royal Cattle Feed", "Cattle", 1450.00, "/images/cattle-food.png"),
    ("Royal Arisitham Mix (50kg)", "Royal Cattle Feed", "Cattle", 2430.00, "/images/cattle-food.png"),
    ("Royal Kandra Weight gain (50kg)", "Royal Cattle Feed", "Cattle", 1550.00, "/images/cattle-food.png"),
    ("Royal Makka Cholam Maavu", "Royal Cattle Feed", "Cattle", 250.00, "/images/cattle-food.png"),
    ("Royal Makka Cholam Kurunai", "Royal Cattle Feed", "Cattle", 220.00, "/images/cattle-food.png"),
    
    # Royal Hen Feed
    ("Royal Pre Starter Feed", "Royal Hen Feed", "Poultry", 450.00, "/images/hen-food.png"),
    ("Royal Starter Feed", "Royal Hen Feed", "Poultry", 480.00, "/images/hen-food.png"),
    ("Royal Grower Feed", "Royal Hen Feed", "Poultry", 520.00, "/images/hen-food.png"),
    ("Royal Layer Feed", "Royal Hen Feed", "Poultry", 550.00, "/images/hen-food.png"),
    ("Royal Hen Crumble Feed", "Royal Hen Feed", "Poultry", 600.00, "/images/hen-food.png"),
    ("Royal Chicken Bran", "Royal Hen Feed", "Poultry", 350.00, "/images/hen-food.png"),
    ("Royal High-Quality Broken Maize Grits", "Royal Hen Feed", "Poultry", 400.00, "/images/hen-food.png"),
    
    # Royal Birds Food
    ("Royal Pigeon SF (25kg)", "Royal Birds Food", "Birds", 1280.00, "/images/birds-food.png"),
    ("Royal Pigeon PT (25kg)", "Royal Birds Food", "Birds", 1620.00, "/images/birds-food.png"),
    ("Royal Budgies & Finches Mix (25kg)", "Royal Birds Food", "Birds", 1750.00, "/images/birds-food.png"),
    ("Royal African & Cockatiel Mix (25kg)", "Royal Birds Food", "Birds", 1800.00, "/images/birds-food.png"),
    
    # Oil Cake
    ("Sunflower Oil Cake", "Oil Cake (Punnakku)", "Livestock", 300.00, "https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=400"),
    ("Lekka Extract Oil Cake", "Oil Cake (Punnakku)", "Livestock", 320.00, "https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=400"),
    ("Royal Multi Mix Oil Cake 50kg", "Oil Cake (Punnakku)", "Livestock", 1500.00, "https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=400"),
    ("Groundnut Oil Cake", "Oil Cake (Punnakku)", "Livestock", 400.00, "https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=400"),
    ("Groundnut Oil Cake Powder", "Oil Cake (Punnakku)", "Livestock", 420.00, "https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=400"),
    ("Mixed Sesame Oil Cake", "Oil Cake (Punnakku)", "Livestock", 350.00, "https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=400"),
    ("Sesame Oil Cake Powder", "Oil Cake (Punnakku)", "Livestock", 370.00, "https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=400"),
    ("Coconut Oil Cake", "Oil Cake (Punnakku)", "Livestock", 380.00, "https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=400"),
    ("Mustard Oil Cake", "Oil Cake (Punnakku)", "Livestock", 310.00, "https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=400"),
    ("Soya Oil Cake", "Oil Cake (Punnakku)", "Livestock", 450.00, "https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=400"),
    ("Cotton Seed Oil Cake", "Oil Cake (Punnakku)", "Livestock", 290.00, "https://images.unsplash.com/photo-1620588628028-0916964a2754?auto=format&fit=crop&q=80&w=400"),
    
    # Farmer's Bran Types
    ("Wheat Bran", "Farmer's Bran Types", "Livestock", 200.00, "https://images.unsplash.com/photo-1574316071802-0d684efa7ab5?auto=format&fit=crop&q=80&w=400"),
    ("Rice Bran", "Farmer's Bran Types", "Livestock", 180.00, "https://images.unsplash.com/photo-1574316071802-0d684efa7ab5?auto=format&fit=crop&q=80&w=400"),
    ("Corn Bran Mix", "Farmer's Bran Types", "Livestock", 220.00, "https://images.unsplash.com/photo-1574316071802-0d684efa7ab5?auto=format&fit=crop&q=80&w=400"),
    ("Sorghum Bran", "Farmer's Bran Types", "Livestock", 210.00, "https://images.unsplash.com/photo-1574316071802-0d684efa7ab5?auto=format&fit=crop&q=80&w=400"),
    ("Royal Coarse Bran", "Farmer's Bran Types", "Livestock", 250.00, "https://images.unsplash.com/photo-1574316071802-0d684efa7ab5?auto=format&fit=crop&q=80&w=400"),
    
    # Oil Seeds & Millets
    ("Austrian Peas", "Oil Seeds & Millets", "Birds", 150.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("White Millets", "Oil Seeds & Millets", "Birds", 120.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Red Millets", "Oil Seeds & Millets", "Birds", 130.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Japanese Millet", "Oil Seeds & Millets", "Birds", 140.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Foxtail Millet", "Oil Seeds & Millets", "Birds", 110.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Yellow Millet", "Oil Seeds & Millets", "Birds", 125.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Cardi Seed", "Oil Seeds & Millets", "Birds", 180.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Small Black Sunflower", "Oil Seeds & Millets", "Birds", 160.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("White Sunflower", "Oil Seeds & Millets", "Birds", 170.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Canary Seed", "Oil Seeds & Millets", "Birds", 200.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Hemp Seed", "Oil Seeds & Millets", "Birds", 220.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Sesame Seed", "Oil Seeds & Millets", "Birds", 150.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Niger Seed", "Oil Seeds & Millets", "Birds", 190.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Rapeseed", "Oil Seeds & Millets", "Birds", 140.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Mustard Seed", "Oil Seeds & Millets", "Birds", 130.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Buckwheat", "Oil Seeds & Millets", "Birds", 160.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Quinoa", "Oil Seeds & Millets", "Birds", 250.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Chia Seed", "Oil Seeds & Millets", "Birds", 280.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Pumpkin Seed", "Oil Seeds & Millets", "Birds", 300.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Flax Seed", "Oil Seeds & Millets", "Birds", 150.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Vetch Seed", "Oil Seeds & Millets", "Birds", 140.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Maple Peas", "Oil Seeds & Millets", "Birds", 160.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Black Sunflower Seeds", "Oil Seeds & Millets", "Birds", 170.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("White Sunflower Seeds", "Oil Seeds & Millets", "Birds", 180.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Sorghum Millet", "Oil Seeds & Millets", "Birds", 110.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Field Bean", "Oil Seeds & Millets", "Birds", 120.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Little Millet", "Oil Seeds & Millets", "Birds", 130.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Kodo Millet", "Oil Seeds & Millets", "Birds", 125.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Barnyard Millet", "Oil Seeds & Millets", "Birds", 135.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Proso Millet", "Oil Seeds & Millets", "Birds", 145.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Linseed & Groundnut Kernels", "Oil Seeds & Millets", "Birds", 190.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    ("Oats", "Oil Seeds & Millets", "Birds", 110.00, "https://images.unsplash.com/photo-1596489370605-64906f362ef7?auto=format&fit=crop&q=80&w=400"),
    
    # Cereals, Millets & Grains
    ("Green Gram", "Cereals, Millets & Grains", "Livestock", 120.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Black Chickpea", "Cereals, Millets & Grains", "Livestock", 130.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("White Chickpea", "Cereals, Millets & Grains", "Livestock", 140.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Paddy", "Cereals, Millets & Grains", "Livestock", 90.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("White Peas", "Cereals, Millets & Grains", "Livestock", 110.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Green Peas", "Cereals, Millets & Grains", "Livestock", 120.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Red Rice", "Cereals, Millets & Grains", "Livestock", 135.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Black Horse Gram", "Cereals, Millets & Grains", "Livestock", 145.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("White Horse Gram", "Cereals, Millets & Grains", "Livestock", 150.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Barley", "Cereals, Millets & Grains", "Livestock", 160.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Black Wheat", "Cereals, Millets & Grains", "Livestock", 170.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Maize", "Cereals, Millets & Grains", "Livestock", 90.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Corn Grits", "Cereals, Millets & Grains", "Livestock", 95.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Maize Flour", "Cereals, Millets & Grains", "Livestock", 100.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("White Sorghum", "Cereals, Millets & Grains", "Livestock", 110.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Red Sorghum", "Cereals, Millets & Grains", "Livestock", 115.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Pearl Millet", "Cereals, Millets & Grains", "Livestock", 120.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Finger Millet", "Cereals, Millets & Grains", "Livestock", 125.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Wheat", "Cereals, Millets & Grains", "Livestock", 130.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Roasted Gram", "Cereals, Millets & Grains", "Livestock", 140.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),
    ("Groundnut", "Cereals, Millets & Grains", "Livestock", 150.00, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"),

    # Cattle Feed & Seed Cake
    ("Tamarind Seed Broken", "Cattle Feed & Seed Cake", "Livestock", 180.00, "/images/cattle-food.png"),
    ("Tamarind Seed Powder", "Cattle Feed & Seed Cake", "Livestock", 190.00, "/images/cattle-food.png"),
    ("Cotton Seed Cake", "Cattle Feed & Seed Cake", "Livestock", 250.00, "/images/cattle-food.png"),
    ("Desi Cotton Seed", "Cattle Feed & Seed Cake", "Livestock", 260.00, "/images/cattle-food.png"),
    ("Black Cotton Seed", "Cattle Feed & Seed Cake", "Livestock", 270.00, "/images/cattle-food.png"),
    
    # Pulses Husk & Feed Waste
    ("Black Gram Husk Powder", "Pulses Husk & Feed Waste", "Livestock", 100.00, "https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=400"),
    ("Black Gram Broken", "Pulses Husk & Feed Waste", "Livestock", 110.00, "https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=400"),
    ("Cowpea Husk Powder", "Pulses Husk & Feed Waste", "Livestock", 90.00, "https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=400"),
    ("Black Green Gram Waste", "Pulses Husk & Feed Waste", "Livestock", 95.00, "https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=400"),
    ("Dried Peas Husk", "Pulses Husk & Feed Waste", "Livestock", 85.00, "https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=400"),
    ("Toor Dal Husk", "Pulses Husk & Feed Waste", "Livestock", 80.00, "https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=400"),
    ("Masoor Dal Husk", "Pulses Husk & Feed Waste", "Livestock", 80.00, "https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=400"),
    ("Millet Husk Powder", "Pulses Husk & Feed Waste", "Livestock", 70.00, "https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=400"),
    ("Mixed Grains Husk Powder", "Pulses Husk & Feed Waste", "Livestock", 75.00, "https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=400"),

    # Pigeon Health Supplements
    ("Pigeon Grit", "Pigeon Health Supplements", "Birds", 150.00, "/images/birds-food.png"),
    ("Calcium Tonic", "Pigeon Health Supplements", "Birds", 180.00, "/images/birds-food.png"),
    ("Calcium Powder", "Pigeon Health Supplements", "Birds", 160.00, "/images/birds-food.png"),
    ("Mineral Mixture", "Pigeon Health Supplements", "Birds", 220.00, "/images/birds-food.png"),
    ("Rock Salt (2kg)", "Pigeon Health Supplements", "Birds", 80.00, "/images/birds-food.png"),
    ("Liver Tonic", "Pigeon Health Supplements", "Birds", 250.00, "/images/birds-food.png"),
    ("Theeni Juice / Energy Tonic", "Pigeon Health Supplements", "Birds", 200.00, "/images/birds-food.png"),
    ("Cuttlefish Bone", "Pigeon Health Supplements", "Birds", 300.00, "/images/birds-food.png")
]

def slugify(name):
    s = re.sub(r'[^a-zA-Z0-9\s-]', '', name).strip().lower()
    s = re.sub(r'[-\s]+', '-', s)
    return s

sql = """-- Royal Uzhavan - Seed Data
-- Seeds all new animal nutrition categories and products.

-- ============================================
-- Clean existing data
-- ============================================
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;

-- ============================================
-- Categories
-- ============================================
INSERT INTO categories (name, image) VALUES
"""

cat_inserts = []
for c, img in categories:
    c_esc = c.replace("'", "''")
    cat_inserts.append(f"  ('{c_esc}', '{img}')")
sql += ",\n".join(cat_inserts) + "\nON CONFLICT (name) DO NOTHING;\n\n"

sql += """-- ============================================
-- Products
-- ============================================
INSERT INTO products (slug, name, category_id, animal_type, price, image, tags, variants, in_stock)
VALUES
"""

prod_inserts = []
for name, category, animal_type, price, _ in products:
    slug = slugify(name)
    name_esc = name.replace("'", "''")
    cat_esc = category.replace("'", "''")
    prod_inserts.append(f"  ('{slug}', '{name_esc}', (SELECT id FROM categories WHERE name = '{cat_esc}'), '{animal_type}', {price}, (SELECT image FROM categories WHERE name = '{cat_esc}'), ARRAY['Royal Uzhavan Quality'], ARRAY[1, 5, 25], true)")

sql += ",\n".join(prod_inserts) + "\nON CONFLICT (slug) DO NOTHING;\n"

with open("seed.sql", "w") as f:
    f.write(sql)
print("seed.sql generated successfully!")
