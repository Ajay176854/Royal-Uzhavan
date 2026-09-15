const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, 'src', 'data', 'products.json');
let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

// 1. Change the newly added products category from "Bird Mixes" to "Royal Birds Food"
// This aligns them with the sidebar category the user is viewing.
products = products.map(p => {
  if (['new-conure-food', 'new-cockatiel-food', 'new-finch-food', 'new-lovebirds-food'].includes(p.id)) {
    p.category = "Royal Birds Food";
  }
  return p;
});

// 2. Remove the old "Royal Budgies & Finches Mix" and "Royal African & Cockatiel Mix"
// since they are now replaced by the new specific products (Finch, Cockatiel, Conure, Lovebirds).
products = products.filter(p => {
  return p.id !== '9ac4ee78-6de3-4641-a07a-4fc1ecf30007' && // Royal Budgies & Finches Mix
         p.id !== '2c90cdbf-0209-4d9a-8729-f8b3c69c655e';   // Royal African & Cockatiel Mix
});

fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
console.log("Fixed categories and removed redundant old products.");
