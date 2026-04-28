const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        total_points INTEGER DEFAULT 0
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS points_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        event_name TEXT,
        date TEXT,
        points INTEGER
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name TEXT,
        date TEXT,
        location TEXT,
        points_value INTEGER,
        description TEXT
      )
    `);

    // Seed data only if tables are empty
    const { rows } = await client.query("SELECT COUNT(*) as count FROM users");
    if (parseInt(rows[0].count) === 0) {
      console.log("Seeding database...");

      const adminHash = await bcrypt.hash('admin123', 10);
      await client.query(
        "INSERT INTO users (name, email, password, role, total_points) VALUES ($1, $2, $3, $4, $5)",
        ["Admin User", "admin@antigravity.com", adminHash, "admin", 0]
      );

      const students = [
        { name: "Jonah Reynolds", email: "jonah@example.com", points: 310 },
        { name: "Sarah Jenkins", email: "sarah@example.com", points: 280 },
        { name: "Michael Chen", email: "michael@example.com", points: 215 },
        { name: "Emily Watson", email: "emily@example.com", points: 150 },
        { name: "David Kim", email: "david@example.com", points: 40 }
      ];

      const defaultPassword = await bcrypt.hash('password123', 10);

      for (const student of students) {
        await client.query(
          "INSERT INTO users (name, email, password, role, total_points) VALUES ($1, $2, $3, $4, $5)",
          [student.name, student.email, defaultPassword, "student", student.points]
        );
      }

      // Seed events
      const today = new Date();
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
      const nextMonth = new Date(today); nextMonth.setMonth(nextMonth.getMonth() + 1);

      const events = [
        { name: "Chapter Meeting", date: tomorrow.toISOString(), location: "Room 302", points: 10, description: "Monthly chapter meeting." },
        { name: "Regional Competition", date: nextMonth.toISOString(), location: "State University", points: 50, description: "Annual regional competitive events." },
        { name: "Community Service Day", date: nextWeek.toISOString(), location: "City Park", points: 25, description: "Park cleanup and community service." },
        { name: "Business Plan Workshop", date: nextWeek.toISOString(), location: "Library", points: 15, description: "Learn how to write a winning business plan." },
        { name: "FBLA Week Spirit Events", date: nextMonth.toISOString(), location: "School-wide", points: 20, description: "Participate in FBLA spirit week activities." },
        { name: "State Leadership Conference", date: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(), location: "Capital City", points: 100, description: "SLC for top competitors." }
      ];

      for (const ev of events) {
        await client.query(
          "INSERT INTO events (name, date, location, points_value, description) VALUES ($1, $2, $3, $4, $5)",
          [ev.name, ev.date, ev.location, ev.points, ev.description]
        );
      }

      // Seed some history for students
      const studentRows = await client.query("SELECT id, name FROM users WHERE role = 'student'");
      for (const u of studentRows.rows) {
        await client.query(
          "INSERT INTO points_history (user_id, event_name, date, points) VALUES ($1, $2, $3, $4)",
          [u.id, "Past Chapter Meeting", new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(), 10]
        );
        await client.query(
          "INSERT INTO points_history (user_id, event_name, date, points) VALUES ($1, $2, $3, $4)",
          [u.id, "Fundraiser Participation", new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), 30]
        );
      }

      console.log("Database seeded successfully!");
    }
  } catch (err) {
    console.error("Database init error:", err.message);
  } finally {
    client.release();
  }
};

// Keep the same API as before so server.js doesn't need changes
const query = async (sql, params = []) => {
  // Convert SQLite-style ? placeholders to PostgreSQL $1, $2, etc.
  let paramIndex = 0;
  const pgSql = sql.replace(/\?/g, () => `$${++paramIndex}`);
  const { rows } = await pool.query(pgSql, params);
  return rows;
};

const get = async (sql, params = []) => {
  const rows = await query(sql, params);
  return rows[0] || null;
};

const run = async (sql, params = []) => {
  // Convert ? placeholders to $1, $2, etc.
  let paramIndex = 0;
  const pgSql = sql.replace(/\?/g, () => `$${++paramIndex}`);
  
  // For INSERT statements, add RETURNING id to get the last inserted ID
  let finalSql = pgSql;
  if (pgSql.trim().toUpperCase().startsWith('INSERT')) {
    finalSql = pgSql + ' RETURNING id';
  }
  
  const result = await pool.query(finalSql, params);
  return {
    id: result.rows[0]?.id || null,
    changes: result.rowCount,
  };
};

module.exports = { initDb, query, run, get };
