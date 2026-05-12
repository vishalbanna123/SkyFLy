#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

const dbName = process.env.DB_NAME || 'flysmart';

async function setupDatabase() {
  let client;
  try {
    // Connect as admin user first
    client = new Client(config);
    await client.connect();
    console.log('✓ Connected to PostgreSQL');

    // Create database if not exists
    try {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✓ Database '${dbName}' created`);
    } catch (err) {
      if (err.code === '42P04') {
        console.log(`✓ Database '${dbName}' already exists`);
      } else {
        throw err;
      }
    }

    // Close the admin connection
    await client.end();

    // Connect to the new database
    const dbClient = new Client({
      ...config,
      database: dbName,
    });
    await dbClient.connect();
    console.log(`✓ Connected to database '${dbName}'`);

    // Read SQL file
    const sqlPath = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    await dbClient.query(sql);
    console.log('✓ Tables created');
    console.log('✓ Sample data inserted');

    await dbClient.end();
    console.log('✓ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('✗ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
