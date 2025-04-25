const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/User');

router.post('/register', (req, res) => {
    const { username, telegram, password } = req.body;
    User.register(new User({ username, telegram }), password, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        passport.authenticate('local')(req, res, () => {
            return res.json({ 
                success: true, 
                user: { 
                    username: user.username, 
                    isAdmin: user.isAdmin,
                    id: user._id
                }
            });
        });
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Неверное имя пользователя или пароль' });
        }
        
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
            
            return res.json({ 
                success: true, 
                user: { 
                    username: user.username, 
                    isAdmin: user.isAdmin,
                    id: user._id
                } 
            });
        });
    })(req, res, next);
});

router.get('/current-user', (req, res) => {
    if (req.isAuthenticated()) {
        const { username, isAdmin, _id } = req.user;
        return res.json({ user: { username, isAdmin, id: _id } });
    }
    res.status(401).json({ message: 'Не авторизован' });
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { 
            return res.status(500).json({ success: false, message: err.message });
        }
        return res.json({ success: true });
    });
});

module.exports = router;
