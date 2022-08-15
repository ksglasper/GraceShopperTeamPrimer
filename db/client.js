// Connect to DB
const { Client } = require('pg');

const test = []

// change the DB_NAME string to whatever your group decides on
const DB_NAME = 'grace-shopper';

const DB_URL =
  process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`;

let client;

// github actions client config
if (process.env.CI) {
  client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  });
} else {
  // local / heroku client config
  client = new Client(config={connectionString: DB_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,});
}
// const connectionString =
//   process.env.DATABASE_URL || "https://localhost:5432/grace-shopper";

// const client = new Pool({
//   connectionString,
//   ssl:
//     process.env.NODE_ENV === "production"
//       ? { rejectUnauthorized: false }
//       : undefined,
// });

module.exports = client;
