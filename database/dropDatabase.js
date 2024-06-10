const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

const dropTables = () => {
    // Drop users_data table
    db.run(`DROP TABLE IF EXISTS users_data`, (err) => {
        if (err) console.error('Error dropping users_data table:', err.message);
        else console.log('users_data table dropped successfully.');
    });

    // Drop referrals_data table
    db.run(`DROP TABLE IF EXISTS referrals_data`, (err) => {
        if (err) console.error('Error dropping referrals_data table:', err.message);
        else console.log('referrals_data table dropped successfully.');
    });

    // Drop users_information table
    db.run(`DROP TABLE IF EXISTS users_information`, (err) => {
        if (err) console.error('Error dropping users_information table:', err.message);
        else console.log('users_information table dropped successfully.');
    });

    // Drop refferal_origin table
    db.run(`DROP TABLE IF EXISTS refferal_origin`, (err) => {
      if (err) console.error('Error dropping refferal_origin table:', err.message);
      else console.log('refferal_origin table dropped successfully.');
  });
};

dropTables();

db.close();
