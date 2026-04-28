const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'fbla.db');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
  db.serialize(async () => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        total_points INTEGER DEFAULT 0
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS points_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        event_name TEXT,
        date TEXT,
        points INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        date TEXT,
        location TEXT,
        points_value INTEGER,
        description TEXT
      )
    `);

    // Seed data
    db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
      if (row.count === 0) {
        console.log("Seeding database...");
        
        const adminHash = await bcrypt.hash('admin123', 10);
        const stmt = db.prepare("INSERT INTO users (name, email, password, role, total_points) VALUES (?, ?, ?, ?, ?)");
        stmt.run("Admin User", "admin@antigravity.com", adminHash, "admin", 0);
        
        const students = [
          { name: "Jonah Reynolds", email: "jonah@example.com", points: 310 },
          { name: "Sarah Jenkins", email: "sarah@example.com", points: 280 },
          { name: "Michael Chen", email: "michael@example.com", points: 215 },
          { name: "Emily Watson", email: "emily@example.com", points: 150 },
          { name: "David Kim", email: "david@example.com", points: 40 }
        ];

        const defaultPassword = await bcrypt.hash('password123', 10);
        
        for (const student of students) {
          stmt.run(student.name, student.email, defaultPassword, "student", student.points);
        }
        stmt.finalize();

        // Seed events
        const eventStmt = db.prepare("INSERT INTO events (name, date, location, points_value, description) VALUES (?, ?, ?, ?, ?)");
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
          { name: "State Leadership Conference", date: new Date(today.setMonth(today.getMonth() + 2)).toISOString(), location: "Capital City", points: 100, description: "SLC for top competitors." }
        ];

        for (const ev of events) {
          eventStmt.run(ev.name, ev.date, ev.location, ev.points, ev.description);
        }
        eventStmt.finalize();

        // Seed some history for students
        const historyStmt = db.prepare("INSERT INTO points_history (user_id, event_name, date, points) VALUES (?, ?, ?, ?)");
        // Wait for users to be inserted
        setTimeout(() => {
            db.all("SELECT id, name FROM users WHERE role = 'student'", (err, users) => {
              if (err) return;
              for (const u of users) {
                 historyStmt.run(u.id, "Past Chapter Meeting", new Date(new Date().setDate(today.getDate() - 30)).toISOString(), 10);
                 historyStmt.run(u.id, "Fundraiser Participation", new Date(new Date().setDate(today.getDate() - 15)).toISOString(), 30);
              }
              historyStmt.finalize();
            });
        }, 1000);
      }
    });
  });
};

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

module.exports = { initDb, query, run, get };
