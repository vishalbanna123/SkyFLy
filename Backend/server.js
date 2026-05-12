const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'flysmart',
});

// Test database connection
pool.connect().then(client => {
  console.log('✓ PostgreSQL database connected');
  client.release();
}).catch(err => {
  console.error('✗ PostgreSQL connection error:', err.message);
});

function createPnr() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  return Array.from({ length: 6 }, () =>
    Math.random() < 0.5
      ? letters[Math.floor(Math.random() * letters.length)]
      : digits[Math.floor(Math.random() * digits.length)]
  ).join('');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Get all destinations
app.get('/api/destinations', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, city, route, price, style FROM destinations ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// Get flights with filtering
app.get('/api/flights', async (req, res) => {
  try {
    const { from, to, date, maxPrice, refundable } = req.query;
    let query = 'SELECT * FROM flights WHERE 1=1';
    const params = [];

    let paramCount = 1;

    if (from) {
      query += ` AND "from" = $${paramCount++}`;
      params.push(from);
    }

    if (to) {
      query += ` AND "to" = $${paramCount++}`;
      params.push(to);
    }
    if (date) {
      query += ` AND date = $${paramCount++}`;
      params.push(date);
    }
    if (maxPrice) {
      query += ` AND price <= $${paramCount++}`;
      params.push(Number(maxPrice));
    }
    if (refundable === 'true') {
      query += ' AND refundable = true';
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

// Get user bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const { email } = req.query;
    
    let query = 'SELECT * FROM bookings';
    const params = [];
    
    if (email) {
      query += ' WHERE email = $1';
      params.push(email);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    const rows = result.rows;
    
    // Format response to match frontend expectations
    const formattedBookings = rows.map(b => ({
      ...b,
      variant: b.status === 'Upcoming' ? 'bk-upcoming' : b.status === 'Completed' ? 'bk-completed' : 'bk-cancelled',
      route: b.route || `${b.passenger_name}'s booking`,
      info: `${b.passenger_name} · ${b.seat} · ${b.status}`,
      pnr: b.pnr,
      action: b.status === 'Upcoming' ? 'View ticket' : b.status === 'Completed' ? 'Download e-ticket' : 'Refund processed'
    }));
    
    res.json(formattedBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { flightId, passengerName, email, phone, seat, paymentMethod } = req.body;
    
    if (!flightId || !passengerName || !email) {
      return res.status(400).json({ error: 'flightId, passengerName, and email are required.' });
    }

    // Get flight details
    const flightResult = await pool.query('SELECT * FROM flights WHERE id = $1', [flightId]);
    
    if (flightResult.rows.length === 0) {
      return res.status(404).json({ error: 'Flight not found.' });
    }

    const flight = flightResult.rows[0];
    const bookingId = `BK-${Date.now()}`;
    const pnr = createPnr();
    const price = `₹${flight.price + 349}`;

    await pool.query(
      `INSERT INTO bookings (id, flight_id, passenger_name, email, phone, seat, payment_method, status, price, pnr, route)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [bookingId, flightId, passengerName, email, phone, seat || '14A', paymentMethod || 'card', 'Upcoming', price, pnr, `${flight.from} → ${flight.to}`]
    );

    res.status(201).json({ 
      success: true, 
      booking: {
        id: bookingId,
        status: 'Upcoming',
        route: `${flight.from} → ${flight.to}`,
        info: `${flight.airline} · ${flight.code} · ${flight.date} · ${flight.product}`,
        price,
        pnr,
        action: 'View ticket'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const result = await pool.query('SELECT id, name, email FROM users WHERE email = $1 AND password = $2', [email, password]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];
    res.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    // Check if email already exists
    const existingResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingResult.rows.length > 0) {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    // Insert new user
    await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);

    res.status(201).json({ success: true, user: { name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Get user profile
app.get('/api/profile', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.json({
        id: 1,
        name: 'Guest',
        email: 'guest@example.com',
        phone: '',
        rewardPoints: 0,
        savedCards: [],
        recentSearches: []
      });
    }

    const result = await pool.query('SELECT id, name, email, phone FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.json({
        name: 'Passenger',
        email,
        phone: '',
        rewardPoints: 0,
        savedCards: [],
        recentSearches: []
      });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      rewardPoints: 4250,
      savedCards: ['SBI •••• 4242', 'HDFC •••• 7812'],
      recentSearches: ['JAI → BOM', 'JAI → DEL', 'JAI → BLR']
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.listen(port, () => {
  console.log(`FlySmart backend running at http://localhost:${port}`);
});
