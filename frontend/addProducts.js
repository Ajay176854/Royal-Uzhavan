const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const productsFile = path.join(__dirname, 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

const newProducts = [
  {
    "id": "new-turkey-feed",
    "slug": "royal-turkey-feed",
    "name": "Royal Turkey Feed",
    "category": "Poultry Feed",
    "animal_type": "Poultry",
    "description": "Daily Care Mix - Premium Nutrition for Healthy Turkeys. Complete & Balanced Blend. High energy, vital vitamins, healthy gut, high palatability.",
    "image": "/turkey-feed.jpg",
    "tags": ["Royal Uzhavan Quality", "Turkey", "Daily Care Mix"],
    "variants": [25],
    "in_stock": true,
    "created_at": new Date().toISOString(),
    "name_tamil": "ராயல் வான்கோழி தீவனம்"
  },
  {
    "id": "new-pig-feed",
    "slug": "royal-pig-feed",
    "name": "Royal Pig Feed",
    "category": "Livestock Feed",
    "animal_type": "Pig",
    "description": "Daily Care Mix - Premium Nutrition for Healthy Swine. Complete & Balanced Blend. High energy, vital vitamins, healthy gut, high palatability.",
    "image": "/pig-feed.png",
    "tags": ["Royal Uzhavan Quality", "Pig", "Swine", "Daily Care Mix"],
    "variants": [25],
    "in_stock": true,
    "created_at": new Date().toISOString(),
    "name_tamil": "ராயல் பன்றி தீவனம்"
  },
  {
    "id": "new-horse-feed",
    "slug": "royal-horse-feed",
    "name": "Royal Horse Feed",
    "category": "Livestock Feed",
    "animal_type": "Horse",
    "description": "Daily Care Mix - Premium Nutrition for a Healthy Horse. Complete & Balanced Blend. High energy, vital vitamins, healthy gut, high palatability.",
    "image": "/horse-feed.jpg",
    "tags": ["Royal Uzhavan Quality", "Horse", "Equine", "Daily Care Mix"],
    "variants": [25],
    "in_stock": true,
    "created_at": new Date().toISOString(),
    "name_tamil": "ராயல் குதிரை தீவனம்"
  }
];

// Prepend to array
const updatedProducts = [...newProducts, ...products];

fs.writeFileSync(productsFile, JSON.stringify(updatedProducts, null, 2));
console.log("Added new products to products.json");
