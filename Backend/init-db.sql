CREATE DATABASE IF NOT EXISTS `flysmart` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `flysmart`;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS destinations (
  id INT PRIMARY KEY,
  city VARCHAR(60) NOT NULL,
  route VARCHAR(120),
  price VARCHAR(60),
  style VARCHAR(30)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS flights (
  id VARCHAR(32) PRIMARY KEY,
  airline VARCHAR(60),
  code VARCHAR(32),
  label VARCHAR(16),
  depart VARCHAR(16),
  arrive VARCHAR(16),
  duration VARCHAR(32),
  type VARCHAR(64),
  price INT,
  priceLabel VARCHAR(32),
  oldPriceLabel VARCHAR(32),
  product VARCHAR(32),
  baggage VARCHAR(32),
  refundable BOOLEAN,
  from_code VARCHAR(16),
  to_code VARCHAR(16),
  date VARCHAR(16),
  logo VARCHAR(32),
  badge VARCHAR(32)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(32) PRIMARY KEY,
  status VARCHAR(24),
  variant VARCHAR(24),
  route VARCHAR(64),
  info VARCHAR(180),
  price VARCHAR(32),
  pnr VARCHAR(16),
  email VARCHAR(160),
  passengerName VARCHAR(120),
  phone VARCHAR(32),
  seat VARCHAR(32),
  paymentMethod VARCHAR(32),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO users (id, name, email, password) VALUES
  (1, 'Rahul Sharma', 'rahul.sharma@gmail.com', 'demo1234');

INSERT IGNORE INTO destinations (id, city, route, price, style) VALUES
  (1,'Delhi','JAI → DEL · 55 min','from ₹1,899','bg1'),
  (2,'Mumbai','JAI → BOM · 1h 55m','from ₹3,499','bg2'),
  (3,'Bengaluru','JAI → BLR · 2h 10m','from ₹4,199','bg3'),
  (4,'Kolkata','JAI → CCU · 2h 30m','from ₹4,890','bg4'),
  (5,'Hyderabad','JAI → HYD · 2h 5m','from ₹3,750','bg5'),
  (6,'Chennai','JAI → MAA · 2h 25m','from ₹4,620','bg6');

INSERT IGNORE INTO flights (id, airline, code, label, depart, arrive, duration, type, price, priceLabel, oldPriceLabel, product, baggage, refundable, from_code, to_code, date, logo, badge) VALUES
  ('6E2108','IndiGo','6E 2108','6E','06:10','08:05','1h 55m','Nonstop',3890,'₹3,890','₹4,500','Economy','15 kg bag',1,'JAI','BOM','2026-05-15','al-6e','Best value'),
  ('AI445','Air India','AI 445','AI','08:30','10:35','2h 05m','Nonstop',4250,'₹4,250',NULL,'Economy','25 kg bag',1,'JAI','BOM','2026-05-15','al-ai',NULL),
  ('UK695','Vistara','UK 695','UK','11:15','13:35','2h 20m','Nonstop',8900,'₹8,900',NULL,'Business','30 kg bag',1,'JAI','BOM','2026-05-15','al-uk',NULL),
  ('AI879','Air India','AI 879','AI','14:20','18:10','3h 50m','1 stop · DEL',3150,'₹3,150',NULL,'Economy','15 kg bag',0,'JAI','BOM','2026-05-15','al-ai',NULL),
  ('SG434','SpiceJet','SG 434','SG','19:45','21:45','2h 00m','Nonstop',3420,'₹3,420',NULL,'Economy','15 kg bag',0,'JAI','BOM','2026-05-15','al-sg',NULL);
