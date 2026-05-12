const sequelize = require('./config/database');
const { Flight } = require('./models');

const seedFlights = async () => {
  try {
    console.log('🌱 Seeding database with sample flights...');

    // Connect to database
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Sync models
    await sequelize.sync({ alter: false });
    console.log('✓ Models synced');

    // Sample flights data - Indian routes
    const flights = [
      // Jaipur to Delhi
      {
        flightNumber: 'SG101',
        airline: 'SpiceJet',
        departureCity: 'Jaipur',
        arrivalCity: 'Delhi',
        departureAirport: 'JAI',
        arrivalAirport: 'DEL',
        departureTime: new Date('2026-05-15 08:00:00'),
        arrivalTime: new Date('2026-05-15 09:00:00'),
        duration: '1h 00m',
        totalSeats: 180,
        availableSeats: 140,
        economyPrice: 1899.00,
        businessPrice: 3500.00,
        firstClassPrice: 5000.00,
        stops: 0,
        aircraft: 'Boeing 737',
      },
      // Jaipur to Mumbai
      {
        flightNumber: 'SG102',
        airline: 'SpiceJet',
        departureCity: 'Jaipur',
        arrivalCity: 'Mumbai',
        departureAirport: 'JAI',
        arrivalAirport: 'BOM',
        departureTime: new Date('2026-05-15 06:00:00'),
        arrivalTime: new Date('2026-05-15 08:30:00'),
        duration: '2h 30m',
        totalSeats: 180,
        availableSeats: 125,
        economyPrice: 3499.00,
        businessPrice: 6500.00,
        firstClassPrice: 9500.00,
        stops: 0,
        aircraft: 'Boeing 787',
      },
      {
        flightNumber: 'AI200',
        airline: 'Air India',
        departureCity: 'Jaipur',
        arrivalCity: 'Mumbai',
        departureAirport: 'JAI',
        arrivalAirport: 'BOM',
        departureTime: new Date('2026-05-15 10:00:00'),
        arrivalTime: new Date('2026-05-15 12:30:00'),
        duration: '2h 30m',
        totalSeats: 200,
        availableSeats: 165,
        economyPrice: 3200.00,
        businessPrice: 6200.00,
        firstClassPrice: 9200.00,
        stops: 0,
        aircraft: 'Airbus A320',
      },
      {
        flightNumber: 'IXI303',
        airline: 'AirAsia',
        departureCity: 'Jaipur',
        arrivalCity: 'Mumbai',
        departureAirport: 'JAI',
        arrivalAirport: 'BOM',
        departureTime: new Date('2026-05-15 14:00:00'),
        arrivalTime: new Date('2026-05-15 16:30:00'),
        duration: '2h 30m',
        totalSeats: 160,
        availableSeats: 95,
        economyPrice: 2899.00,
        businessPrice: 4500.00,
        firstClassPrice: null,
        stops: 0,
        aircraft: 'Airbus A320',
      },
      // Jaipur to Bengaluru
      {
        flightNumber: 'SG104',
        airline: 'SpiceJet',
        departureCity: 'Jaipur',
        arrivalCity: 'Bengaluru',
        departureAirport: 'JAI',
        arrivalAirport: 'BLR',
        departureTime: new Date('2026-05-15 08:30:00'),
        arrivalTime: new Date('2026-05-15 11:00:00'),
        duration: '2h 30m',
        totalSeats: 180,
        availableSeats: 150,
        economyPrice: 4199.00,
        businessPrice: 7500.00,
        firstClassPrice: 10500.00,
        stops: 0,
        aircraft: 'Boeing 737',
      },
      // Jaipur to Kolkata
      {
        flightNumber: 'AI201',
        airline: 'Air India',
        departureCity: 'Jaipur',
        arrivalCity: 'Kolkata',
        departureAirport: 'JAI',
        arrivalAirport: 'CCU',
        departureTime: new Date('2026-05-15 09:00:00'),
        arrivalTime: new Date('2026-05-15 12:00:00'),
        duration: '3h 00m',
        totalSeats: 200,
        availableSeats: 175,
        economyPrice: 4890.00,
        businessPrice: 8500.00,
        firstClassPrice: 12000.00,
        stops: 0,
        aircraft: 'Airbus A320',
      },
      // Jaipur to Hyderabad
      {
        flightNumber: 'SG105',
        airline: 'SpiceJet',
        departureCity: 'Jaipur',
        arrivalCity: 'Hyderabad',
        departureAirport: 'JAI',
        arrivalAirport: 'HYD',
        departureTime: new Date('2026-05-15 11:00:00'),
        arrivalTime: new Date('2026-05-15 13:00:00'),
        duration: '2h 00m',
        totalSeats: 180,
        availableSeats: 155,
        economyPrice: 3750.00,
        businessPrice: 6800.00,
        firstClassPrice: 9500.00,
        stops: 0,
        aircraft: 'Boeing 737',
      },
      // Jaipur to Chennai
      {
        flightNumber: 'AI202',
        airline: 'Air India',
        departureCity: 'Jaipur',
        arrivalCity: 'Chennai',
        departureAirport: 'JAI',
        arrivalAirport: 'MAA',
        departureTime: new Date('2026-05-15 07:30:00'),
        arrivalTime: new Date('2026-05-15 10:30:00'),
        duration: '3h 00m',
        totalSeats: 200,
        availableSeats: 180,
        economyPrice: 4620.00,
        businessPrice: 8200.00,
        firstClassPrice: 11500.00,
        stops: 0,
        aircraft: 'Airbus A320',
      },
      // Delhi to Mumbai
      {
        flightNumber: 'SG110',
        airline: 'SpiceJet',
        departureCity: 'Delhi',
        arrivalCity: 'Mumbai',
        departureAirport: 'DEL',
        arrivalAirport: 'BOM',
        departureTime: new Date('2026-05-15 08:00:00'),
        arrivalTime: new Date('2026-05-15 10:00:00'),
        duration: '2h 00m',
        totalSeats: 220,
        availableSeats: 190,
        economyPrice: 3000.00,
        businessPrice: 5500.00,
        firstClassPrice: 8500.00,
        stops: 0,
        aircraft: 'Boeing 787',
      },
      {
        flightNumber: 'AI210',
        airline: 'Air India',
        departureCity: 'Delhi',
        arrivalCity: 'Mumbai',
        departureAirport: 'DEL',
        arrivalAirport: 'BOM',
        departureTime: new Date('2026-05-15 12:00:00'),
        arrivalTime: new Date('2026-05-15 14:00:00'),
        duration: '2h 00m',
        totalSeats: 200,
        availableSeats: 165,
        economyPrice: 2800.00,
        businessPrice: 5200.00,
        firstClassPrice: 8000.00,
        stops: 0,
        aircraft: 'Airbus A320',
      },
      // Mumbai to Bengaluru
      {
        flightNumber: 'SG120',
        airline: 'SpiceJet',
        departureCity: 'Mumbai',
        arrivalCity: 'Bengaluru',
        departureAirport: 'BOM',
        arrivalAirport: 'BLR',
        departureTime: new Date('2026-05-15 09:00:00'),
        arrivalTime: new Date('2026-05-15 10:45:00'),
        duration: '1h 45m',
        totalSeats: 180,
        availableSeats: 140,
        economyPrice: 2500.00,
        businessPrice: 4500.00,
        firstClassPrice: 7000.00,
        stops: 0,
        aircraft: 'Boeing 737',
      },
      // Additional flights for May 15
      {
        flightNumber: 'SG106',
        airline: 'SpiceJet',
        departureCity: 'Jaipur',
        arrivalCity: 'Delhi',
        departureAirport: 'JAI',
        arrivalAirport: 'DEL',
        departureTime: new Date('2026-05-15 12:00:00'),
        arrivalTime: new Date('2026-05-15 13:00:00'),
        duration: '1h 00m',
        totalSeats: 180,
        availableSeats: 155,
        economyPrice: 1899.00,
        businessPrice: 3500.00,
        firstClassPrice: 5000.00,
        stops: 0,
        aircraft: 'Boeing 737',
      },
      {
        flightNumber: 'SG107',
        airline: 'SpiceJet',
        departureCity: 'Jaipur',
        arrivalCity: 'Delhi',
        departureAirport: 'JAI',
        arrivalAirport: 'DEL',
        departureTime: new Date('2026-05-15 16:00:00'),
        arrivalTime: new Date('2026-05-15 17:00:00'),
        duration: '1h 00m',
        totalSeats: 180,
        availableSeats: 165,
        economyPrice: 1899.00,
        businessPrice: 3500.00,
        firstClassPrice: 5000.00,
        stops: 0,
        aircraft: 'Boeing 737',
      },
    ];

    // Create flights
    await Flight.bulkCreate(flights);
    console.log('✓ Sample flights created successfully');

    console.log('✅ Database seeded with sample data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

seedFlights();

