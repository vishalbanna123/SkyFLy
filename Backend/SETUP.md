# Backend Setup Guide

## Prerequisites

- Node.js v14+ (already installed ✓)
- PostgreSQL 12+ 

## Step 1: Install PostgreSQL

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

### Windows
Download from: https://www.postgresql.org/download/windows/

## Step 2: Create Database

### Option A: Using the setup script (macOS/Linux)
```bash
chmod +x setup-db.sh
./setup-db.sh
```

### Option B: Manual setup
```bash
# Connect to PostgreSQL
psql -U postgres

# Run these commands:
CREATE DATABASE flight_booking;
\q
```

## Step 3: Configure Environment

The `.env` file is already created with default values:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flight_booking
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

**Update `DB_PASSWORD` if your PostgreSQL password is different.**

## Step 4: Start the Server

### Development mode (with auto-reload)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

You should see:
```
✓ Database connection successful
✓ Database models synced
✓ Server running on http://localhost:5000
✓ Environment: development
```

## Step 5: Seed Sample Data (Optional)

After the server starts successfully, in a new terminal run:

```bash
npm run seed
```

This will create 5 sample flights for testing.

## API Testing

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Search Flights
```bash
curl "http://localhost:5000/api/flights/search?departure=New York&arrival=Los Angeles&departureDate=2025-05-20"
```

### Create Booking (requires token)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "flightId": "flight-uuid",
    "passengerName": "John Doe",
    "seatClass": "economy"
  }'
```

## Troubleshooting

### Error: database "flight_booking" does not exist
✅ Solution: Create the database first (see Step 2)

### Error: ECONNREFUSED for PostgreSQL
✅ Solution: Make sure PostgreSQL is running
- macOS: `brew services start postgresql`
- Ubuntu: `sudo service postgresql start`
- Windows: Check PostgreSQL service in Services

### Error: connection timeout
✅ Solution: Check your `.env` database credentials

### Port 5000 already in use
✅ Solution: Change PORT in `.env` or kill the process:
```bash
lsof -ti:5000 | xargs kill -9
```

## PostgreSQL Commands (Useful)

```bash
# Connect to database
psql -U postgres -d flight_booking

# Inside psql:
\dt                    # List tables
\d Users               # Describe Users table
SELECT * FROM "Users"; # Query data
\q                     # Quit

# Backup database
pg_dump -U postgres flight_booking > backup.sql

# Restore database
psql -U postgres flight_booking < backup.sql
```

## Security Notes

⚠️ **Before production deployment:**

1. Change `JWT_SECRET` to a strong random key
2. Change default database password
3. Set `NODE_ENV=production`
4. Add rate limiting
5. Enable HTTPS
6. Add request validation
7. Implement proper error handling (don't expose internal errors)
8. Add logging and monitoring

## Next Steps

1. ✅ Backend API is set up and running
2. Connect Frontend to Backend APIs
3. Integrate payment gateway (Stripe/PayPal)
4. Add email notifications
5. Set up admin dashboard
6. Deploy to production

## File Structure Reference

```
Backend/
├── config/
│   └── database.js              # Database connection
├── models/
│   ├── User.js                  # User model
│   ├── Flight.js                # Flight model
│   ├── Booking.js               # Booking model
│   ├── Payment.js               # Payment model
│   └── index.js                 # Model associations
├── controllers/
│   ├── authController.js        # Auth logic
│   ├── flightController.js      # Flight logic
│   ├── bookingController.js     # Booking logic
│   ├── paymentController.js     # Payment logic
│   └── userController.js        # Profile logic
├── routes/
│   ├── auth.js                  # Auth routes
│   ├── flights.js               # Flight routes
│   ├── bookings.js              # Booking routes
│   ├── payments.js              # Payment routes
│   └── users.js                 # User routes
├── middleware/
│   └── auth.js                  # JWT authentication
├── index.js                     # Main server file
├── seed.js                      # Database seeder
├── setup-db.sh                  # Database setup script
├── package.json
├── .env                         # Environment variables
└── README.md                    # Full documentation
```

## Support

For issues or questions, check:
- The main README.md for API documentation
- PostgreSQL logs: `tail -f /usr/local/var/log/postgres.log` (macOS)
- Node.js console output
