require('dotenv').config();
const { Pool } = require('pg');

// Reuse database connections instead of opening one for every request.
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'bookstore',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
});

module.exports = pool;
