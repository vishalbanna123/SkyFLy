#!/bin/bash

# Database setup script for Flight Booking System
# This script creates the PostgreSQL database and user

echo "📦 Setting up Flight Booking Database..."
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql"
    exit 1
fi

echo "✓ PostgreSQL found"

# Get user input
read -p "Enter PostgreSQL username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Enter PostgreSQL password: " DB_PASSWORD
echo ""

read -p "Enter database name (default: flight_booking): " DB_NAME
DB_NAME=${DB_NAME:-flight_booking}

# Create database
echo ""
echo "Creating database '$DB_NAME'..."

PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USER" -h localhost -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Database '$DB_NAME' created successfully"
else
    echo "⚠️  Database might already exist, proceeding..."
fi

echo ""
echo "✓ Database setup complete!"
echo ""
echo "Update your .env file with:"
echo "DB_USER=$DB_USER"
echo "DB_PASSWORD=$DB_PASSWORD"
echo "DB_NAME=$DB_NAME"
