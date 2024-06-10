const express = require('express');
const router = express.Router();
const { getReferralsForUser } = require('../../database/dbOperations');

router.get('/:telegramSourceId', async (req, res) => {
    const { telegramSourceId } = req.params;
    if (!telegramSourceId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const data = await getReferralsForUser(telegramSourceId);
        res.status(200).json({ data });
    } catch (error) {
        console.error('Error retrieving referrals:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
