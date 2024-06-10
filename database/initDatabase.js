const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

const createTables = () => {
    // Create users_data table
    db.run(`
        CREATE TABLE IF NOT EXISTS users_data (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            telegramId INTEGER NOT NULL,
            energy INTEGER NOT NULL,
            coins INTEGER NOT NULL,
            time TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error('Error creating users_data table:', err.message);
        else console.log('users_data table created successfully.');
    });

    // Create referrals_data table
    db.run(`
        CREATE TABLE IF NOT EXISTS referrals_data (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            telegramSourceId INTEGER NOT NULL,
            telegramReferralId INTEGER NOT NULL,
            clicked INTEGER DEFAULT 0,
            verified INTEGER DEFAULT 0
        )
    `, (err) => {
        if (err) console.error('Error creating referrals_data table:', err.message);
        else console.log('referrals_data table created successfully.');
    });

    // Create users_information table
    db.run(`
        CREATE TABLE IF NOT EXISTS users_information (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            telegramId INTEGER NOT NULL,
            username TEXT NOT NULL,
            photo TEXT,
            isPremium TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error('Error creating users_information table:', err.message);
        else console.log('users_information table created successfully.');
    });

    // Create refferal_origin table
    db.run(`
        CREATE TABLE refferal_origin (
            ID INTEGER PRIMARY KEY,
            telegramId INTEGER,
            link TEXT
        )
    `, (err) => {
      if (err) console.error('Error creating refferal_origin table:', err.message);
      else console.log('refferal_origin table created successfully.');
    });

};

createTables();

db.close();
