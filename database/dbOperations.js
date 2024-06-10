const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('mydatabase.db');

async function addReferralToDatabase(data) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO referrals_data (telegramSourceId, telegramReferralId, clicked, verified) VALUES (?, ?, ?, ?)",
            [+data.sourceTelegramId, +data.referralTelegramId, 0, 0],
            function (err) {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

async function updateReferralClicked(telegramId) {
    return new Promise((resolve, reject) => {
        db.run("UPDATE referrals_data SET clicked = 1 WHERE telegramReferralId = ?", [telegramId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function getReferralsForUser(telegramSourceId) {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM referrals_data WHERE telegramSourceId = ?", [telegramSourceId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function updateReferralVerified(telegramId) {
    return new Promise((resolve, reject) => {
        db.run("UPDATE referrals_data SET verified = 1 WHERE telegramReferralId = ?", [telegramId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function getGameDataForUser(telegramId) {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users_data WHERE telegramId = ?", [telegramId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function insertGameData(data) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO users_data (telegramId, energy, coins, time) VALUES (?, ?, ?, ?)",
            [+data.telegramId, data.energy, data.coins, data.time],
            function (err) {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

async function addUserIfNotExists(data) {
    const userExists = await checkUserExists(data.telegramId);
    if (userExists) {
        return 'User already exists';
    }
    await addUser(data);
    return 'User added successfully';
}

async function checkUserExists(telegramId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT 1 FROM users_information WHERE telegramId = ?", [telegramId], (err, row) => {
            if (err) reject(err);
            else resolve(!!row);
        });
    });
}

async function getUserData(telegramId) {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users_information WHERE telegramId = ?", [telegramId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function addUser(data) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO users_information (telegramId, username, photo, isPremium) VALUES (?, ?, ?, ?)",
            [+data.telegramId, data.telegramUsername, data.photo, `${data.isPremium}`],
            function (err) {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

module.exports = {
    addReferralToDatabase,
    updateReferralClicked,
    getReferralsForUser,
    updateReferralVerified,
    getGameDataForUser,
    insertGameData,
    addUserIfNotExists,
    getUserData
};
