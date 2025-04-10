const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Отобразить форму регистрации
router.get('/register', (req, res) => {
    res.render('pages/register');
});

// Обработка регистрации
router.post('/register', (req, res) => {
    const { username, telegram, password } = req.body;
    User.register(new User({ username, telegram }), password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/auth/register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Вы успешно зарегистрированы');
            res.redirect('/');
        });
    });
});

// Отобразить форму входа
router.get('/login', (req, res) => {
    res.render('pages/login');
});

// Обработка входа
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

// Выход из системы
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Вы вышли из системы');
        res.redirect('/');
    });
});

module.exports = router;
