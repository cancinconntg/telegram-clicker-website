const express = require('express');
const router = express.Router();
const { getGameDataForUser } = require('../../database/dbOperations');

router.get('/:telegramId', async (req, res) => {
    const { telegramId } = req.params;
    if (!telegramId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const data = await getGameDataForUser(telegramId);
        res.status(200).json({ data });
    } catch (error) {
        console.error('Error retrieving game data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
