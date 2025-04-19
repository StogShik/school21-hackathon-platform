const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../utils/auth');
const Case = require('../../models/Case');
const path = require('path');
const fs = require('fs');

// Get all cases
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const cases = await Case.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ cases });
    } catch (err) {
        console.error('Error fetching cases:', err);
        return res.status(500).json({ message: 'Ошибка при получении кейсов' });
    }
});

// Ultra-simple direct file download approach
router.get('/files/:filename', ensureAuthenticated, (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../../uploads', filename);
        
        console.log(`File request received for: ${filename}`);
        console.log(`Looking in path: ${filePath}`);
        
        // Simple way - use res.download which handles most things
        res.download(filePath, (err) => {
            if (err) {
                console.error(`Error sending file: ${err.message}`);
                if (!res.headersSent) {
                    return res.status(404).send('Файл не найден');
                }
            }
        });
    } catch (err) {
        console.error('Download error:', err);
        res.status(500).send('Ошибка при загрузке файла');
    }
});

module.exports = router;
