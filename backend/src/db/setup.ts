import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pg from "pg";

const { Client } = pg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set in .env");
  process.exit(1);
}

// Parse the DATABASE_URL to extract the database name
const url = new URL(DATABASE_URL);
const dbName = url.pathname.slice(1); // remove leading "/"
const adminUrl = `${url.protocol}//${url.username}:${url.password}@${url.host}/postgres`;

async function createDatabaseIfNeeded() {
  const adminClient = new Client({ connectionString: adminUrl });

  try {
    await adminClient.connect();

    // Check if database exists
    const result = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (result.rows.length === 0) {
      console.log(`📦 Creating database "${dbName}"...`);
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created\n`);
    } else {
      console.log(`✅ Database "${dbName}" already exists\n`);
    }
  } finally {
    await adminClient.end();
  }
}

async function setup() {
  console.log("🚀 Royal Uzhavan — Database Setup\n");

  // Step 1: Create database if it doesn't exist
  await createDatabaseIfNeeded();

  // Step 2: Connect to the target database
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    // Run schema
    console.log("📋 Running schema...");
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, "schema.sql"),
      "utf-8"
    );
    await client.query(schemaSQL);
    console.log("✅ Schema created successfully\n");

    // Run seed data
    console.log("🌱 Seeding data...");
    const seedSQL = fs.readFileSync(
      path.join(__dirname, "seed.sql"),
      "utf-8"
    );
    await client.query(seedSQL);
    console.log("✅ Seed data inserted successfully\n");

    // Verify
    const categories = await client.query("SELECT COUNT(*) FROM categories");
    const products = await client.query("SELECT COUNT(*) FROM products");
    const users = await client.query("SELECT COUNT(*) FROM users");

    console.log("📊 Database Summary:");
    console.log(`   Categories: ${categories.rows[0].count}`);
    console.log(`   Products:   ${products.rows[0].count}`);
    console.log(`   Users:      ${users.rows[0].count}`);
    console.log("\n🎉 Setup complete! Run 'npm run dev' to start the server.");
  } catch (err) {
    console.error("❌ Setup failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setup();
