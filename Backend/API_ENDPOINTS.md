// API ENDPOINT SUMMARY

// ============ AUTHENTICATION ============

// POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
// Response: token, user

// POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
// Response: token, user

// GET /api/auth/me (Protected)
// Response: current user data

// ============ FLIGHTS ============

// GET /api/flights/search?departure=NYC&arrival=LAX&departureDate=2025-05-20
// Response: Array of flights matching criteria

// GET /api/flights
// GET /api/flights?page=1&limit=10
// Response: Array of all flights (paginated)

// GET /api/flights/:id
// Response: Single flight details

// POST /api/flights (Protected)
{
  "flightNumber": "UA100",
  "airline": "United Airlines",
  "departureCity": "New York",
  "arrivalCity": "Los Angeles",
  "departureAirport": "JFK",
  "arrivalAirport": "LAX",
  "departureTime": "2025-05-20T08:00:00Z",
  "arrivalTime": "2025-05-20T11:30:00Z",
  "totalSeats": 180,
  "economyPrice": 250,
  "businessPrice": 500,
  "firstClassPrice": 800
}

// ============ BOOKINGS ============

// POST /api/bookings (Protected)
{
  "flightId": "flight-uuid",
  "passengerName": "John Doe",
  "seatClass": "economy"  // economy, business, first-class
}
// Response: booking confirmation

// GET /api/bookings (Protected)
// GET /api/bookings?page=1&limit=10
// Response: User's bookings (paginated)

// GET /api/bookings/:id (Protected)
// Response: Single booking details with flight info

// PUT /api/bookings/:id/cancel (Protected)
// Response: Cancelled booking

// ============ PAYMENTS ============

// POST /api/payments (Protected)
{
  "bookingId": "booking-uuid",
  "amount": 250,
  "paymentMethod": "credit_card",  // credit_card, debit_card, paypal, bank_transfer
  "cardLastFour": "1234"
}
// Response: payment confirmation

// GET /api/payments (Protected)
// GET /api/payments?page=1&limit=10
// Response: User's payments (paginated)

// GET /api/payments/:id (Protected)
// Response: Single payment details

// PUT /api/payments/:id/refund (Protected)
// Response: Refunded payment

// ============ USER PROFILE ============

// GET /api/users/profile (Protected)
// Response: User profile data

// PUT /api/users/profile (Protected)
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "passportNumber": "AB123456"
}
// Response: Updated user data

// ============ HEALTH CHECK ============

// GET /api/health
// Response: { "status": "Server is running" }

// GET /
// Response: { "message": "Welcome to Flight Booking API" }
