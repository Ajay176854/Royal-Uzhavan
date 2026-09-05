import fs from 'fs';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runSeed() {
  try {
    const sql = fs.readFileSync('seed.sql', 'utf8');
    await pool.query(sql);
    print("Seed executed successfully.");
  } catch (error) {
    console.error("Error executing seed:", error);
  } finally {
    pool.end();
  }
}

runSeed();
