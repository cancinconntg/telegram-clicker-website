const express = require('express');
const router = express.Router();
const { addUserIfNotExists } = require('../../database/dbOperations');

router.post('/', async (req, res) => {
    const data = req.body;
    if (!data.telegramId || !data.telegramUsername) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await addUserIfNotExists(data);
        res.status(201).json({ message: result });
    } catch (error) {
        console.error('Error adding user:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;  