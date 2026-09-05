import json
import re

categories = [
    ("Royal Cattle Feed", "/images/cattle-food.png"),
    ("Royal Hen Feed / Royal Kozhi Theevanam*", "/images/hen-food.png"),
    ("Royal Birds Food", "/images/birds-food.png"),
    ("Royal oil-cake(Punnaku)", "/images/royal-punnakku.png"),
    ("Uzhavan Thavitu Vagaigal - nutrition", "/images/royal-nutrition.png"),
    ("Cereals and Grains Category", "/images/royal-cereals.jpg"),
    ("Uzhavan Thusi Vagaigal", "/images/royal-thoosu-vagaigal.jpg"),
    ("Uzhavan Vittha Mattum Theevana Vagaigal", "/images/royal-seed-theevanam.png"),
    ("Hen and Pigeon Supplements", "/images/hen-pigeon-supplement.png")
]

products = [
    # 1.Royal Cattle Feed
    ("Royal Kalappu", "Royal Cattle Feed", "Cattle", 1000.00, ""),
    ("Royal Standard Mix", "Royal Cattle Feed", "Cattle", 1000.00, ""),
    ("Royal Gold Kalappu Theevanam", "Royal Cattle Feed", "Cattle", 1000.00, ""),
    ("Royal Arisitham", "Royal Cattle Feed", "Cattle", 1000.00, ""),
    ("Royal Kandra Weight gain", "Royal Cattle Feed", "Cattle", 1000.00, ""),
    ("Royal Makka Cholam Maavu", "Royal Cattle Feed", "Cattle", 1000.00, ""),
    ("Royal Makka Cholam Kurunai", "Royal Cattle Feed", "Cattle", 1000.00, ""),

    # 2.Royal Hen Feed / Royal Kozhi Theevanam*
    ("Royal Pre Stater", "Royal Hen Feed / Royal Kozhi Theevanam*", "Poultry", 1000.00, ""),
    ("Royal Stater", "Royal Hen Feed / Royal Kozhi Theevanam*", "Poultry", 1000.00, ""),
    ("Royal Grower", "Royal Hen Feed / Royal Kozhi Theevanam*", "Poultry", 1000.00, ""),
    ("Royal Layer", "Royal Hen Feed / Royal Kozhi Theevanam*", "Poultry", 1000.00, ""),
    ("Royal Hen Crumble", "Royal Hen Feed / Royal Kozhi Theevanam*", "Poultry", 1000.00, ""),
    ("Royal கோழி தவிடு", "Royal Hen Feed / Royal Kozhi Theevanam*", "Poultry", 1000.00, ""),
    ("Royal பக்கா சோளம் குருணை", "Royal Hen Feed / Royal Kozhi Theevanam*", "Poultry", 1000.00, ""),

    # 3.Royal Birds Food
    ("Royal Pigeon SF", "Royal Birds Food", "Birds", 1000.00, ""),
    ("Royal Pigeon PT", "Royal Birds Food", "Birds", 1000.00, ""),
    ("Royal Budgies & Finches Mix", "Royal Birds Food", "Birds", 1000.00, ""),
    ("Royal African & Cockatiel Mix", "Royal Birds Food", "Birds", 1000.00, ""),

    # 4.Royal oil-cake(Punnaku)
    ("Royal Multi Mix Oil Cake", "Royal oil-cake(Punnaku)", "Livestock", 1000.00, ""),
    ("Groundnut Oil Cake", "Royal oil-cake(Punnaku)", "Livestock", 1000.00, ""),
    ("Groundnut Oil Cake Powder", "Royal oil-cake(Punnaku)", "Livestock", 1000.00, ""),
    ("Mixed Sesame Oil Cake", "Royal oil-cake(Punnaku)", "Livestock", 1000.00, ""),
    ("Sesame Oil Cake Powder", "Royal oil-cake(Punnaku)", "Livestock", 1000.00, ""),
    ("Coconut Oil Cake / Copra Cake", "Royal oil-cake(Punnaku)", "Livestock", 1000.00, ""),
    ("Mustard Oil Cake", "Royal oil-cake(Punnaku)", "Livestock", 1000.00, ""),
    ("Soya Oil Cake", "Royal oil-cake(Punnaku)", "Livestock", 1000.00, ""),
    ("Mustard / Kadu Oil Cake", "Royal oil-cake(Punnaku)", "Livestock", 1000.00, ""),
    ("Cotton Seed Oil Cake", "Royal oil-cake(Punnaku)", "Livestock", 1000.00, ""),

    # 5.Uzhavan Thavitu Vagaigal - nutrition
    ("Wheat Bran(kothambu tavudu)", "Uzhavan Thavitu Vagaigal - nutrition", "Livestock", 1000.00, ""),
    ("Rice Bran(arisi tavudu)", "Uzhavan Thavitu Vagaigal - nutrition", "Livestock", 1000.00, ""),
    ("Corn Bran", "Uzhavan Thavitu Vagaigal - nutrition", "Livestock", 1000.00, ""),
    ("Sorghum Bran(singaariya tavudu)", "Uzhavan Thavitu Vagaigal - nutrition", "Livestock", 1000.00, ""),
    ("Coarse Bran", "Uzhavan Thavitu Vagaigal - nutrition", "Livestock", 1000.00, ""),

    # 6.Cereals and Grains Category
    ("Maize / Corn", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Broken Maize / Corn Grits", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Maize Flour / Corn Flour", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("White Sorghum / White Jowar", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Red Sorghum / Red Jowar", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Pearl Millet / Bajra", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Finger Millet / Ragi", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Foxtail Millet", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Wheat", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Roasted Gram / Puffed Chickpea", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Groundnut / Peanut", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Green Gram / Moong Dal", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Black Chickpea / Kala Chana", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("White Chickpea / Kabuli Chana", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Paddy / Unpolished Rice Grain", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("White Peas", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Green Peas", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Red Rice", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Black Horse Gram / Black Cowpea", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("White Horse Gram / White Cowpea", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Barley", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Black Wheat", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Black Sunflower Seeds", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Striped / White Sunflower Seeds", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Sorghum Millet - Small Grain", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Flat Bean / Field Bean", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Little Millet", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Kodo Millet", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Barnyard Millet", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Proso Millet", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Linseed & Groundnut Kernels", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Oats", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Sesame Seed", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Niger Seed", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Rapeseed", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Mustard Seed", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Buckwheat", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Quinoa", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Chia Seed", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Pumpkin Seed", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Flax Seed / Lin Seed", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Vetch Seed", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Maple Peas", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Austrian Peas", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("White Millets", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Red Millets", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Japanese Millet", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Yellow Millet", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Cardi Seed", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Small Black Sunflower", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("White Sunflower", "Cereals and Grains Category", "Birds", 1000.00, ""),
    ("Canary Seed", "Cereals and Grains Category", "Birds", 1000.00, ""),

    # 7.Uzhavan Thusi Vagaigal
    ("Black Gram Husk Powder", "Uzhavan Thusi Vagaigal", "Livestock", 1000.00, ""),
    ("Black Gram Small Broken / Powder", "Uzhavan Thusi Vagaigal", "Livestock", 1000.00, ""),
    ("Black Gram Broken & Waste Mix", "Uzhavan Thusi Vagaigal", "Livestock", 1000.00, ""),
    ("Cowpea / Lobia Husk Powder", "Uzhavan Thusi Vagaigal", "Livestock", 1000.00, ""),
    ("Black Green Gram Broken Waste", "Uzhavan Thusi Vagaigal", "Livestock", 1000.00, ""),
    ("Black Karamani / Black Cowpea Husk", "Uzhavan Thusi Vagaigal", "Livestock", 1000.00, ""),
    ("Dried Peas Husk", "Uzhavan Thusi Vagaigal", "Livestock", 1000.00, ""),
    ("Toor Dal / Pigeon Pea Husk", "Uzhavan Thusi Vagaigal", "Livestock", 1000.00, ""),
    ("Masoor Dal / Lentil Husk", "Uzhavan Thusi Vagaigal", "Livestock", 1000.00, ""),
    ("Millet Husk Powder", "Uzhavan Thusi Vagaigal", "Livestock", 1000.00, ""),
    ("Mixed Grains Husk Powder", "Uzhavan Thusi Vagaigal", "Livestock", 1000.00, ""),

    # 8.Uzhavan Vittha Mattum Theevana Vagaigal
    ("Tamarind Seed Broken / Crush", "Uzhavan Vittha Mattum Theevana Vagaigal", "Livestock", 1000.00, ""),
    ("Tamarind Seed Broken", "Uzhavan Vittha Mattum Theevana Vagaigal", "Livestock", 1000.00, ""),
    ("Tamarind Seed Powder", "Uzhavan Vittha Mattum Theevana Vagaigal", "Livestock", 1000.00, ""),
    ("Cotton Seed Cake", "Uzhavan Vittha Mattum Theevana Vagaigal", "Livestock", 1000.00, ""),
    ("Country Cotton Seed / Desi Cotton Seed", "Uzhavan Vittha Mattum Theevana Vagaigal", "Livestock", 1000.00, ""),
    ("Black Cotton Seed", "Uzhavan Vittha Mattum Theevana Vagaigal", "Livestock", 1000.00, ""),

    # 9.Hen and Pigeon Supplements
    ("Pigeon Grit", "Hen and Pigeon Supplements", "Birds", 1000.00, ""),
    ("Calcium Tonic", "Hen and Pigeon Supplements", "Birds", 1000.00, ""),
    ("Calcium Powder", "Hen and Pigeon Supplements", "Birds", 1000.00, ""),
    ("Mineral Mixture", "Hen and Pigeon Supplements", "Birds", 1000.00, ""),
    ("Salt", "Hen and Pigeon Supplements", "Birds", 1000.00, ""),
    ("Liver Tonic", "Hen and Pigeon Supplements", "Birds", 1000.00, ""),
    ("Kadal chippi, powder", "Hen and Pigeon Supplements", "Birds", 1000.00, ""),
    ("Kanava thoodu", "Hen and Pigeon Supplements", "Birds", 1000.00, "")
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
    # Fetch category image to use as fallback product image
    cat_img = next((img for cat, img in categories if cat == category), "/images/cattle-food.png")
    prod_inserts.append(f"  ('{slug}', '{name_esc}', (SELECT id FROM categories WHERE name = '{cat_esc}'), '{animal_type}', {price}, '{cat_img}', ARRAY['Royal Uzhavan Quality'], ARRAY[1, 5, 25], true)")

sql += ",\n".join(prod_inserts) + "\nON CONFLICT (slug) DO NOTHING;\n"

with open("seed.sql", "w", encoding='utf-8') as f:
    f.write(sql)
print("seed.sql generated successfully!")
