const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../utils/auth');
const User = require('../../models/User');
const Team = require('../../models/Team');
const Case = require('../../models/Case');
const upload = require('../../utils/fileUpload');
const path = require('path');

const ensureAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Доступ запрещён' });
    }
    next();
};

router.get('/cases', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const cases = await Case.find({}).sort({ createdAt: -1 });
        res.json({ cases });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при получении кейсов' });
    }
});

router.post('/cases', ensureAuthenticated, ensureAdmin, upload.array('files', 5), async (req, res) => {
    const { title, description } = req.body;
    try {
        const files = req.files ? req.files.map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            encodedName: Buffer.from(file.originalname).toString('utf8'), // Store UTF-8 encoded name
            mimetype: file.mimetype,
            size: file.size
        })) : [];

        const newCase = new Case({ 
            title, 
            description,
            files
        });
        await newCase.save();
        res.json({ success: true, case: newCase });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при создании кейса' });
    }
});

router.post('/cases/:id/delete', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        await Case.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при удалении кейса' });
    }
});

router.get('/teams', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const teams = await Team.find({}).populate('members').sort({ createdAt: -1 });
        res.json({ teams });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при получении команд' });
    }
});

router.get('/users', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const users = await User.find({}).sort({ username: 1 });
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при получении пользователей' });
    }
});

router.post('/users/:id/delete', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при удалении пользователя' });
    }
});

router.post('/users/:id/promote', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        
        user.isAdmin = true;
        await user.save();
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при повышении пользователя' });
    }
});

router.post('/users/:id/demote', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        
        user.isAdmin = false;
        await user.save();
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при понижении пользователя' });
    }
});

router.post('/teams/:id/delete', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при удалении команды' });
    }
});

module.exports = router;
