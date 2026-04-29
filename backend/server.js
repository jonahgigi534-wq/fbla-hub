const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { initDb, query, run, get } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'super_secret_fbla_key_2026';

const allowedOrigins = [
  'http://localhost:5173',
  'https://fbla-hub-vlwo.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

// Manual CORS middleware - handles preflight and all cross-origin requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie');
  res.setHeader('Access-Control-Max-Age', '86400'); // cache preflight for 24h

  // Respond to preflight immediately
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});


app.use(express.json());
app.use(cookieParser());

initDb();

// Health check - visit https://fbla-hub-backend.onrender.com/health to verify server is up
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

// --- AUTH ROUTES ---

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
    
    res.json({ id: user.id, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const { id } = await run('INSERT INTO users (name, email, password, role, total_points) VALUES (?, ?, ?, ?, ?)', 
      [name, email, hash, 'student', 0]);

    const token = jwt.sign({ id, email, role: 'student' }, JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
    
    res.json({ id, name, role: 'student' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await get('SELECT id, name, email, role, total_points FROM users WHERE id = ?', [req.user.id]);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API ROUTES ---

app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await get('SELECT id, name, total_points FROM users WHERE id = ?', [req.user.id]);
    const history = await query('SELECT * FROM points_history WHERE user_id = ? ORDER BY date DESC', [req.user.id]);
    
    // Calculate rank
    const usersByPoints = await query("SELECT id, total_points FROM users WHERE role = 'student' ORDER BY total_points DESC");
    let rank = usersByPoints.findIndex(u => u.id === req.user.id) + 1;
    if (user.role === 'admin') rank = '-';
    
    // Events attended count
    const eventsAttended = history.length;
    
    // Points this month
    const thisMonth = new Date();
    const currentMonthStr = thisMonth.toISOString().slice(0, 7);
    const pointsThisMonth = history
        .filter(h => h.date && h.date.startsWith(currentMonthStr))
        .reduce((sum, h) => sum + h.points, 0);

    res.json({
        user,
        history,
        stats: {
            rank,
            eventsAttended,
            pointsThisMonth
        }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/leaderboard', authenticateToken, async (req, res) => {
  try {
    const leaderboard = await query("SELECT id, name, total_points FROM users WHERE role = 'student' ORDER BY total_points DESC LIMIT 5");
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const events = await query('SELECT * FROM events ORDER BY date ASC');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN ROUTES ---

app.post('/api/events', authenticateToken, requireAdmin, async (req, res) => {
  const { name, date, location, points_value, description } = req.body;
  try {
    await run('INSERT INTO events (name, date, location, points_value, description) VALUES (?, ?, ?, ?, ?)', 
      [name, date, location, points_value, description]);
    res.json({ message: 'Event added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/points/award', authenticateToken, requireAdmin, async (req, res) => {
  const { user_id, event_name, points } = req.body;
  const userIdInt = parseInt(user_id, 10);
  try {
    await run('INSERT INTO points_history (user_id, event_name, date, points) VALUES (?, ?, ?, ?)', 
      [userIdInt, event_name, new Date().toISOString(), points]);
    
    await run('UPDATE users SET total_points = total_points + ? WHERE id = ?', [points, userIdInt]);
    
    res.json({ message: 'Points awarded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk import points from parsed CSV rows
// Expected body: { rows: [{ email, event_name, points }] }
app.post('/api/points/bulk', authenticateToken, requireAdmin, async (req, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'No rows provided' });
  }

  const results = [];
  for (const row of rows) {
    const { email, event_name, points } = row;
    if (!email || !points) {
      results.push({ email, status: 'skipped', reason: 'Missing email or points' });
      continue;
    }
    try {
      const user = await get('SELECT id, name FROM users WHERE email = ?', [email]);
      if (!user) {
        results.push({ email, status: 'not_found', reason: 'No user with this email' });
        continue;
      }
      const pts = Number(points);
      if (isNaN(pts) || pts === 0) {
        results.push({ email, status: 'skipped', reason: 'Invalid points value' });
        continue;
      }
      await run('INSERT INTO points_history (user_id, event_name, date, points) VALUES (?, ?, ?, ?)',
        [user.id, event_name || 'Sheet Import', new Date().toISOString(), pts]);
      await run('UPDATE users SET total_points = total_points + ? WHERE id = ?', [pts, user.id]);
      results.push({ email, name: user.name, status: 'success', points: pts });
    } catch (err) {
      results.push({ email, status: 'error', reason: err.message });
    }
  }

  const succeeded = results.filter(r => r.status === 'success').length;
  res.json({ message: `Imported ${succeeded}/${rows.length} rows`, results });
});


app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role, total_points FROM users ORDER BY name ASC');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    await run('INSERT INTO users (name, email, password, role, total_points) VALUES (?, ?, ?, ?, ?)', 
      [name, email, hash, role || 'student', 0]);

    res.json({ message: 'User added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    await run('DELETE FROM points_history WHERE user_id = ?', [userId]);
    await run('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/events/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    await run('DELETE FROM events WHERE id = ?', [eventId]);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
