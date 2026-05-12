-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flights table
CREATE TABLE IF NOT EXISTS flights (
  id VARCHAR(50) PRIMARY KEY,
  airline VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  label VARCHAR(10),
  logo VARCHAR(100),
  depart VARCHAR(10) NOT NULL,
  arrive VARCHAR(10) NOT NULL,
  duration VARCHAR(20) NOT NULL,
  type VARCHAR(50),
  price INTEGER NOT NULL,
  price_label VARCHAR(20),
  old_price_label VARCHAR(20),
  product VARCHAR(50),
  baggage VARCHAR(50),
  refundable BOOLEAN DEFAULT true,
  "from" VARCHAR(10) NOT NULL,
  "to" VARCHAR(10) NOT NULL,
  "date" DATE NOT NULL,
  badge VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(50) PRIMARY KEY,
  user_id INTEGER,
  flight_id VARCHAR(50) NOT NULL,
  passenger_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  seat VARCHAR(10),
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Upcoming',
  price VARCHAR(20),
  route VARCHAR(100),
  pnr VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
);

-- Destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  route VARCHAR(100),
  price VARCHAR(50),
  style VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (name, email, password, phone) VALUES 
('Rahul Sharma', 'rahul.sharma@gmail.com', 'demo1234', '+91 98765 43210'),
('Priya Singh', 'priya.singh@gmail.com', 'pass1234', '+91 99876 54321')
ON CONFLICT (email) DO NOTHING;

-- Insert sample flights
INSERT INTO flights (id, airline, code, label, depart, arrive, duration, type, price, price_label, old_price_label, product, baggage, refundable, "from", "to", "date", badge) VALUES
('6E2108', 'IndiGo', '6E 2108', '6E', '06:10', '08:05', '1h 55m', 'Nonstop', 3890, '₹3,890', '₹4,500', 'Economy', '15 kg bag', true, 'JAI', 'BOM', '2026-05-15', 'Best value'),
('AI445', 'Air India', 'AI 445', 'AI', '08:30', '10:35', '2h 05m', 'Nonstop', 4250, '₹4,250', NULL, 'Economy', '25 kg bag', true, 'JAI', 'BOM', '2026-05-15', NULL),
('UK695', 'Vistara', 'UK 695', 'UK', '11:15', '13:35', '2h 20m', 'Nonstop', 8900, '₹8,900', NULL, 'Business', '30 kg bag', true, 'JAI', 'BOM', '2026-05-15', NULL),
('AI879', 'Air India', 'AI 879', 'AI', '14:20', '18:10', '3h 50m', '1 stop · DEL', 3150, '₹3,150', NULL, 'Economy', '15 kg bag', false, 'JAI', 'BOM', '2026-05-15', NULL),
('SG434', 'SpiceJet', 'SG 434', 'SG', '19:45', '21:45', '2h 00m', 'Nonstop', 3420, '₹3,420', NULL, 'Economy', '15 kg bag', false, 'JAI', 'BOM', '2026-05-15', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample destinations
INSERT INTO destinations (city, route, price, style) VALUES
('Delhi', 'JAI → DEL · 55 min', 'from ₹1,899', 'bg1'),
('Mumbai', 'JAI → BOM · 1h 55m', 'from ₹3,499', 'bg2'),
('Bengaluru', 'JAI → BLR · 2h 10m', 'from ₹4,199', 'bg3'),
('Kolkata', 'JAI → CCU · 2h 30m', 'from ₹4,890', 'bg4'),
('Hyderabad', 'JAI → HYD · 2h 5m', 'from ₹3,750', 'bg5'),
('Chennai', 'JAI → MAA · 2h 25m', 'from ₹4,620', 'bg6')
ON CONFLICT DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (id, user_id, flight_id, passenger_name, email, phone, seat, payment_method, status, price, route, pnr) VALUES
('BK-1001', 1, '6E2108', 'Rahul Sharma', 'rahul.sharma@gmail.com', '+91 98765 43210', '14A', 'card', 'Upcoming', '₹4,239', 'JAI → BOM', 'SF7K3M'),
('BK-1002', 1, 'AI445', 'Rahul Sharma', 'rahul.sharma@gmail.com', '+91 98765 43210', '12C', 'card', 'Completed', '₹2,150', 'JAI → BOM', 'AI2M9X'),
('BK-1003', 1, '6E2108', 'Rahul Sharma', 'rahul.sharma@gmail.com', '+91 98765 43210', '18B', 'upi', 'Cancelled', '₹4,199', 'JAI → BOM', '6E8VK1')
ON CONFLICT (id) DO NOTHING;
