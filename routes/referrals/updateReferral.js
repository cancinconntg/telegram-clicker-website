const express = require('express');
const router = express.Router();
const { updateReferralStatus } = require('../../database/dbOperations');

router.patch('/:telegramId', async (req, res) => {
    const { telegramId } = req.params;
    const { updateType } = req.body;
    if (!telegramId || !updateType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['clicked', 'verified'].includes(updateType)) {
        return res.status(400).json({ error: 'Invalid update type' });
    }

    try {
        await updateReferralStatus(telegramId, updateType);
        res.status(200).json({ message: `Referral ${updateType} status updated` });
    } catch (error) {
        console.error(`Error updating referral ${updateType} status:`, error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
