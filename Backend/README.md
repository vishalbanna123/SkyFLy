# Flight Booking Backend API

A comprehensive Express.js + PostgreSQL backend for a flight booking system.

## Features

- ✅ User Authentication (Register, Login)
- ✅ Flight Search & Management
- ✅ Flight Booking System
- ✅ Payment Processing
- ✅ User Profiles
- ✅ JWT Authentication
- ✅ PostgreSQL Database with Sequelize ORM

## Getting Started

### Prerequisites

- Node.js v14+
- PostgreSQL installed and running
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory:

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

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE flight_booking;
```

2. Run the server (it will auto-create tables):
```bash
npm run dev
```

### Running the Server

**Development mode** (with hot-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Server will run on `http://localhost:5000`

## Project Structure

```
Backend/
├── config/
│   └── database.js         # Database configuration
├── controllers/            # Business logic
│   ├── authController.js   # Auth logic
│   ├── flightController.js # Flight logic
│   ├── bookingController.js # Booking logic
│   ├── paymentController.js # Payment logic
│   └── userController.js   # User profile logic
├── models/                 # Database models
│   ├── User.js
│   ├── Flight.js
│   ├── Booking.js
│   ├── Payment.js
│   └── index.js           # Model associations
├── routes/                 # API routes
│   ├── auth.js
│   ├── flights.js
│   ├── bookings.js
│   ├── payments.js
│   └── users.js
├── middleware/             # Custom middleware
│   └── auth.js            # JWT authentication
├── index.js               # Main server file
├── package.json
├── .env                   # Environment variables
└── .gitignore
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Flights
- `GET /api/flights/search?departure=NYC&arrival=LAX&departureDate=2025-05-15` - Search flights
- `GET /api/flights` - Get all flights
- `GET /api/flights/:id` - Get flight by ID
- `POST /api/flights` - Create flight (protected)

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get booking by ID (protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)

### Payments
- `POST /api/payments` - Create payment (protected)
- `GET /api/payments` - Get user payments (protected)
- `GET /api/payments/:id` - Get payment by ID (protected)
- `PUT /api/payments/:id/refund` - Refund payment (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Database Models

### User
- id (UUID)
- firstName, lastName, email, phone
- dateOfBirth, address, city, country
- passportNumber
- password (hashed with bcrypt)

### Flight
- id (UUID)
- flightNumber, airline
- departureCity, arrivalCity
- departureTime, arrivalTime
- totalSeats, availableSeats
- economyPrice, businessPrice, firstClassPrice

### Booking
- id (UUID)
- userId, flightId
- bookingReference
- passengerName, seatClass, seatNumber
- totalPrice, status, paymentStatus

### Payment
- id (UUID)
- bookingId, userId
- amount, currency
- paymentMethod, transactionId, status
- cardLastFour, paymentDate

## Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **sequelize** - ORM for database
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **validator** - Input validation

## Development Dependencies

- **nodemon** - Auto-restart on file changes

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Next Steps

1. Connect frontend to these APIs
2. Add payment gateway integration (Stripe, PayPal, etc.)
3. Add email notifications
4. Add admin dashboard
5. Add flight status updates
6. Add reviews and ratings

## License

ISC
