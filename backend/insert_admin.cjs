require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function addAdmin() {
  const hash = '$2b$12$N37lO.Ofayx0ZLQ.uYOZ5u.fOOBG2QKZvwFB0.LYeA7D.B8kS0q26';
  try {
    await pool.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ('Admin', 'admin@royaluzhavan.com', $1, 'admin')
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role;
    `, [hash]);
    console.log("Admin user seeded successfully!");
  } catch (err) {
    console.error("Error seeding admin user:", err);
  } finally {
    await pool.end();
  }
}

addAdmin();
