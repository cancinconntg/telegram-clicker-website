const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const url = require('url');

const db = new sqlite3.Database('mydatabase.db');

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'website')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const updateGameData = require('./routes/updateGameData');
app.use('/updateGameData', updateGameData);

const getGameData = require('./routes/getGameData');
app.use('/getGameData', getGameData);

const addReferral = require('./routes/addReferral');
app.use('/addReferral', addReferral);

const getReferrals = require('./routes/getReferrals');
app.use('/getReferrals', getReferrals);

const addUserInformation = require('./routes/addUserInformation');
app.use('/addUserInformation', addUserInformation);

const getUserInformation = require('./routes/getUserInformation');
app.use('/getUserInformation', getUserInformation);

const verifyReferral = require('./routes/verifyReferral');
app.use('/verifyReferral', verifyReferral);

const getDailyRewardsState = require('./routes/getDailyRewardsState');
app.use('/getDailyRewardsState', getDailyRewardsState);




const updateDailyRewards = require('./routes/updateDailyRewards');
app.use('/updateDailyRewards', updateDailyRewards);




const getMineCardsInformation = require('./routes/getMineCardsInformation');
app.use('/getMineCardsInformation', getMineCardsInformation);

const updateCardLevel = require('./routes/updateCardLevel');
app.use('/updateCardLevel', updateCardLevel);

const getPPHInfo = require('./routes/getPPHInfo');
app.use('/getPPHInfo', getPPHInfo);

const updatePPH = require('./routes/updatePPH');
app.use('/updatePPH', updatePPH);

//db.run("CREATE TABLE users_data (ID INTEGER PRIMARY KEY, telegramId INTEGER, energy INTEGER, coins INTEGER, time TEXT)");

//db.run("CREATE TABLE refferal_origin (ID INTEGER PRIMARY KEY, telegramId INTEGER, link TEXT)");


//db.run('drop table referrals_data')

//db.run("CREATE TABLE referrals_data (ID INTEGER PRIMARY KEY, telegramSourceId INTEGER, telegramReferralId INTEGER, clicked INTEGER, verified INTEGER)");

//db.run("CREATE TABLE users_information (ID INTEGER PRIMARY KEY, telegramId INTEGER, username TEXT, photo TEXT, isPremium TEXT)");

//db.run('CREATE TABLE daily_rewards (ID INTEGER PRIMARY KEY, telegramId INTEGER, day1_claimed TEXT, day1_date TEXT, day2_claimed TEXT, day2_date TEXT, day3_claimed TEXT, day3_date TEXT, day4_claimed TEXT, day4_date TEXT, day5_claimed TEXT, day5_date TEXT, day6_claimed TEXT, day6_date TEXT, day7_claimed TEXT, day7_date TEXT, day8_claimed TEXT, day8_date TEXT, day9_claimed TEXT, day9_date TEXT, day10_claimed TEXT, day10_date TEXT)')


//db.run("CREATE TABLE mine_cards (ID INTEGER PRIMARY KEY, telegramId INTEGER, funTokens_level INTEGER, staking_level INTEGER, btcPairs_level INTEGER, ethPairs_level INTEGER, top10_level INTEGER, gameFi_level INTEGER, defi_level INTEGER, socialFi_level INTEGER, meme_level INTEGER, shit_level INTEGER)");

//db.run("CREATE TABLE cards (ID INTEGER PRIMARY KEY, telegramId INTEGER, funTokensBox INTEGER, stakingBox INTEGER, btcPairsBox INTEGER, ethPairsBox INTEGER, top10CMCBox INTEGER, gameFiBox INTEGER, defiBox INTEGER, socialFiBox INTEGER, memeCoinsBox INTEGER, shitCoinsBox INTEGER)");

//db.run("create table user_pph(ID INTEGER PRIMARY KEY, telegramId INTEGER, pph INTEGER)");
