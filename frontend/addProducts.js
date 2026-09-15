const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const productsFile = path.join(__dirname, 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

const newProducts = [
  {
    "id": "new-buffalo-feed",
    "slug": "royal-buffalo-feed",
    "name": "Royal Buffalo Feed",
    "category": "Royal Cattle Feed",
    "animal_type": "Cattle",
    "description": "Daily Care Mix - Premium Nutrition for Healthy Buffalo. Complete & Balanced Blend. High energy, vital vitamins, healthy gut, high palatability.",
    "image": "/buffalo-feed.png",
    "tags": ["Royal Uzhavan Quality", "Buffalo", "Cattle", "Daily Care Mix"],
    "variants": [25],
    "in_stock": true,
    "created_at": new Date().toISOString(),
    "name_tamil": "ராயல் எருமை மாட்டு தீவனம்"
  },
  {
    "id": "new-conure-food",
    "slug": "royal-conure-food",
    "name": "Royal Conure Food",
    "category": "Bird Mixes",
    "animal_type": "Bird",
    "description": "Daily Care Mix - Premium Nutrition for Healthy Conures. Complete & Balanced Blend. High energy, vital vitamins, healthy plumage, easy digestion.",
    "image": "/conure-feed.png",
    "tags": ["Royal Uzhavan Quality", "Conure", "Bird", "Daily Care Mix"],
    "variants": [25],
    "in_stock": true,
    "created_at": new Date().toISOString(),
    "name_tamil": "ராயல் கானூர் பறவை உணவு"
  },
  {
    "id": "new-cockatiel-food",
    "slug": "royal-cockatiel-food",
    "name": "Royal Cockatiel Food",
    "category": "Bird Mixes",
    "animal_type": "Bird",
    "description": "Daily Care Mix - Premium Nutrition for Healthy Cockatiels. Complete & Balanced Blend. High energy, vital vitamins, healthy plumage, easy digestion.",
    "image": "/cockatiel-feed.jpg",
    "tags": ["Royal Uzhavan Quality", "Cockatiel", "Bird", "Daily Care Mix"],
    "variants": [25],
    "in_stock": true,
    "created_at": new Date().toISOString(),
    "name_tamil": "ராயல் காக்டீல் பறவை உணவு"
  },
  {
    "id": "new-finch-food",
    "slug": "royal-finch-food",
    "name": "Royal Finch Food",
    "category": "Bird Mixes",
    "animal_type": "Bird",
    "description": "Daily Care Mix - Premium Nutrition for Healthy Finches. Complete & Balanced Blend. High energy, vital vitamins.",
    "image": "/finch-feed.jpg",
    "tags": ["Royal Uzhavan Quality", "Finch", "Bird", "Daily Care Mix"],
    "variants": [25],
    "in_stock": true,
    "created_at": new Date().toISOString(),
    "name_tamil": "ராயல் பின்ச் பறவை உணவு"
  },
  {
    "id": "new-lovebirds-food",
    "slug": "royal-love-birds-food",
    "name": "Royal Love Birds Food",
    "category": "Bird Mixes",
    "animal_type": "Bird",
    "description": "Daily Care Mix - Premium Nutrition for Healthy Lovebirds. Complete & Balanced Blend. High energy, vital vitamins, healthy plumage, easy digestion.",
    "image": "/lovebirds-feed.png",
    "tags": ["Royal Uzhavan Quality", "Lovebirds", "Bird", "Daily Care Mix"],
    "variants": [25],
    "in_stock": true,
    "created_at": new Date().toISOString(),
    "name_tamil": "ராயல் லவ்பேர்ட்ஸ் உணவு"
  }
];

// Prepend to array
const updatedProducts = [...newProducts, ...products];

fs.writeFileSync(productsFile, JSON.stringify(updatedProducts, null, 2));
console.log("Added 5 new products to products.json");
