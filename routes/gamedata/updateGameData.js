const express = require('express');
const router = express.Router();
const { insertGameData } = require('../../database/dbOperations');

router.patch('/:telegramId', async (req, res) => {
    const { telegramId } = req.params;
    const data = req.body;
    if (!telegramId || !data.energy || !data.coins || !data.time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await insertGameData(data);
        res.status(201).json({ message: 'Game data updated successfully' });
    } catch (error) {
        console.error('Error updating game data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
