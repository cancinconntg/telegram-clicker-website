const express = require('express');
const router = express.Router();
const { addReferralToDatabase } = require('../../database/dbOperations');

router.post('/', async (req, res) => {
    const data = req.body;
    if (!data.sourceTelegramId || !data.referralTelegramId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await addReferralToDatabase(data);
        res.status(201).json({ message: 'Referral added successfully' });
    } catch (error) {
        console.error('Error adding referral:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
