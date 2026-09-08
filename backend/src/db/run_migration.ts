import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pg from "pg";

const { Client } = pg;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    const sql = fs.readFileSync(
      path.join(__dirname, "migrate_wishlist_cart.sql"),
      "utf-8"
    );
    await client.query(sql);
    console.log("✅ Wishlist & Cart tables created successfully");

    // Verify
    const wishlist = await client.query("SELECT COUNT(*) FROM wishlist");
    const cart = await client.query("SELECT COUNT(*) FROM cart_items");
    console.log(`   Wishlist rows: ${wishlist.rows[0].count}`);
    console.log(`   Cart rows:     ${cart.rows[0].count}`);
    console.log("\n🎉 Migration complete!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
