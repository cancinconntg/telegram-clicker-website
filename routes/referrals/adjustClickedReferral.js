const express = require('express');
const router = express.Router();
const { updateReferralClicked } = require('../../database/dbOperations');

router.patch('/:telegramId', async (req, res) => {
    const { telegramId } = req.params;
    if (!telegramId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await updateReferralClicked(telegramId);
        res.status(200).json({ message: 'Referral clicked updated' });
    } catch (error) {
        console.error('Error updating referral:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
