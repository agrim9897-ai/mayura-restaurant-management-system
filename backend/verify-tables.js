import dotenv from "dotenv";
dotenv.config();
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function verify() {
  const res = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  console.log("\\n=== Tables in mayura_db (public schema) ===");
  res.rows.forEach((row, i) => console.log(`  ${i + 1}. ${row.table_name}`));
  console.log(`\\nTotal: ${res.rows.length} tables\\n`);

  // Verify columns for each model table
  const tables = ["Admin", "Reservation", "MenuCategory", "MenuItem", "ContactMessage", "RestaurantSettings"];
  for (const t of tables) {
    const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `, [t]);
    console.log(`--- ${t} (${cols.rows.length} columns) ---`);
    cols.rows.forEach(c => {
      console.log(`  ${c.column_name}  ${c.data_type}  nullable=${c.is_nullable}  default=${c.column_default || "none"}`);
    });
    console.log();
  }

  await pool.end();
}

verify();
