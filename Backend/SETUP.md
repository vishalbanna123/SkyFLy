# FlySmart MySQL Database Setup

## Prerequisites

1. **MySQL Server** must be installed on your system
   - Windows: Download from https://dev.mysql.com/downloads/mysql/
   - Mac: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Start MySQL Server**
   - Windows: MySQL typically runs as a service automatically
   - Mac: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

## Setup Steps

### 1. Configure Database Connection

Edit the `.env` file in the Backend folder:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flysmart
PORT=4000
```

Change `DB_PASSWORD` if your MySQL root user has a password.

### 2. Initialize Database

Run the setup script to create database and tables:

```bash
cd Backend
node setup-db.js
```

You should see:
```
✓ Connected to MySQL
✓ Database initialized successfully!
✓ Database: flysmart
✓ Tables created
✓ Sample data inserted
```

### 3. Start the Backend Server

```bash
cd Backend
npm run dev
```

You should see:
```
✓ MySQL database connected
FlySmart backend running at http://localhost:4000
```

### 4. Start the Frontend Server

In a new terminal:

```bash
cd Frontend
npm run dev
```

Open http://localhost:5173 in your browser.

## Test Credentials

**Email:** rahul.sharma@gmail.com  
**Password:** demo1234

## Database Tables

- **users** - User accounts
- **flights** - Flight listings
- **bookings** - Flight bookings
- **destinations** - Popular routes

## Troubleshooting

### "MySQL connection error"
- Check if MySQL server is running
- Verify DB_HOST and DB_PORT in .env
- Ensure DB_USER and DB_PASSWORD are correct

### "Database does not exist"
- Run `node setup-db.js` again
- Check MySQL error logs

### Port 3306 already in use
- Change `DB_PORT` in .env to another port (e.g., 3307)
- Update MySQL connection string

## Manual Database Setup (Alternative)

If the setup script fails, manually initialize:

1. Open MySQL client:
   ```bash
   mysql -u root -p
   ```

2. Run commands from `database.sql`:
   ```sql
   CREATE DATABASE IF NOT EXISTS flysmart;
   USE flysmart;
   -- ... run all CREATE TABLE and INSERT statements from database.sql
   ```
