import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, query } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

await initializeDatabase();

const defaultProfile = {
  name: 'Guest traveler',
  email: '',
  phone: '+91 98765 43210',
  rewardPoints: 4250,
  savedCards: ['SBI •••• 4242', 'HDFC •••• 7812'],
  recentSearches: ['JAI → BOM', 'JAI → DEL', 'JAI → BLR'],
};

function createPnr() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  return Array.from({ length: 6 }, () =>
    Math.random() < 0.5
      ? letters[Math.floor(Math.random() * letters.length)]
      : digits[Math.floor(Math.random() * digits.length)]
  ).join('');
}

function buildProfile(userRow, email) {
  if (!userRow) {
    return { ...defaultProfile, email: email || '' };
  }
  return { ...defaultProfile, name: userRow.name, email: userRow.email };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/destinations', async (req, res) => {
  try {
    const [rows] = await query('SELECT id, city, route, price, style FROM destinations ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load destinations.' });
  }
});

app.get('/api/flights', async (req, res) => {
  try {
    const { from, to, date, maxPrice, refundable } = req.query;
    const conditions = [];
    const values = [];

    if (from) {
      conditions.push('from_code = ?');
      values.push(from.toUpperCase());
    }
    if (to) {
      conditions.push('to_code = ?');
      values.push(to.toUpperCase());
    }
    if (date) {
      conditions.push('date = ?');
      values.push(date);
    }
    if (maxPrice) {
      conditions.push('price <= ?');
      values.push(Number(maxPrice));
    }
    if (refundable === 'true') {
      conditions.push('refundable = 1');
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [rows] = await query(`SELECT id, airline, code, label, depart, arrive, duration, type, price, priceLabel, oldPriceLabel, product, baggage, refundable, from_code AS \\`from\\`, to_code AS \\`to\\`, date, logo, badge FROM flights ${where} ORDER BY price`, values);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load flights.' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const { email } = req.query;
    if (email) {
      const [rows] = await query('SELECT * FROM bookings WHERE email = ? ORDER BY created_at DESC', [email]);
      return res.json(rows);
    }
    const [rows] = await query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load bookings.' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { flightId, passengerName, email, phone, seat, paymentMethod } = req.body;
    if (!flightId || !passengerName || !email) {
      return res.status(400).json({ error: 'flightId, passengerName, and email are required.' });
    }

    const [flightRows] = await query('SELECT * FROM flights WHERE id = ?', [flightId]);
    const flight = flightRows[0];
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found.' });
    }

    const bookingId = `BK-${Date.now()}`;
    const pnr = createPnr();
    const route = `${flight.from_code} → ${flight.to_code}`;
    const info = `${flight.airline} · ${flight.code} · ${flight.date} · ${flight.product}`;
    const price = `₹${flight.price + 349}`;

    await query(
      'INSERT INTO bookings (id, status, variant, route, info, price, pnr, email, passengerName, phone, seat, paymentMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [bookingId, 'Upcoming', 'bk-upcoming', route, info, price, pnr, email, passengerName, phone || '', seat || 'Auto assigned', paymentMethod || 'card']
    );

    res.status(201).json({ success: true, booking: { id: bookingId, status: 'Upcoming', variant: 'bk-upcoming', route, info, price, pnr, email, passengerName, phone: phone || '', seat: seat || 'Auto assigned', paymentMethod: paymentMethod || 'card', action: 'View ticket' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const [rows] = await query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    res.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed.' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const [existing] = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    await query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    res.status(201).json({ success: true, user: { name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Signup failed.' });
  }
});

app.get('/api/profile', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.json(defaultProfile);
    }

    const [rows] = await query('SELECT * FROM users WHERE email = ?', [email]);
    res.json(buildProfile(rows[0], email));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load profile.' });
  }
});

app.listen(port, () => {
  console.log(`FlySmart backend running at http://localhost:${port}`);
});
