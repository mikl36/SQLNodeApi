const sqlite3 = require('sqlite3').verbose()
const DATABASE_NAME = process.env.DATABASE_NAME || './database.db'

// create database connection with sqlite
const db = new sqlite3.Database(DATABASE_NAME, (err) => {
  if (err) {
    console.error('Database connection error:', err.message)
  } else {
    console.log('Connected to the SQLite database.')
  }
})

module.exports = db
