const pool = require("./db");

async function updateDatabase() {
  try {
    console.log("Checking and updating food_donations table...");

    // Add status column if it doesn't exist
    await pool.query(`
      ALTER TABLE food_donations 
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'available'
    `);

    // Add ngo_id column if it doesn't exist
    await pool.query(`
      ALTER TABLE food_donations 
      ADD COLUMN IF NOT EXISTS ngo_id INTEGER REFERENCES users(user_id)
    `);

    // Add created_at column if it doesn't exist
    await pool.query(`
      ALTER TABLE food_donations 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);

    console.log("Database updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating database:", error);
    process.exit(1);
  }
}

updateDatabase();
