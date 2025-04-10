const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../utils/auth');
const Case = require('../models/Case');
const Team = require('../models/Team');
const User = require('../models/User');

// Панель управления
router.get('/', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.render('admin/dashboard');
});

// Управление кейсами
router.get('/cases', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const cases = await Case.find({}).sort({ createdAt: -1 });
      res.render('admin/cases', { title: 'Кейсы', user: req.user, cases, error: req.flash('error'), success: req.flash('success') });
    } catch (err) {
      console.error(err);
      req.flash('error', 'Ошибка при получении кейсов');
      res.redirect('/admin');
    }
  });

  router.get('/cases/new', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.render('admin/new_case', { title: 'Создать кейс', user: req.user, error: req.flash('error'), success: req.flash('success') });
  });
  
  // POST маршрут для создания кейса
  router.post('/cases', ensureAuthenticated, ensureAdmin, async (req, res) => {
    const { title, description } = req.body;
    try {
      const newCase = new Case({ title, description });
      await newCase.save();
      req.flash('success', 'Кейс успешно создан!');
      res.redirect('/admin/cases');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Ошибка при создании кейса');
      res.redirect('/admin/cases/new');
    }
  });
  
  // POST маршрут для удаления кейса
  router.post('/cases/:id/delete', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      await Case.findByIdAndDelete(req.params.id);
      req.flash('success', 'Кейс удалён успешно');
      res.redirect('/admin/cases');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Ошибка при удалении кейса');
      res.redirect('/admin/cases');
    }
  });
  

// Управление командами
router.get('/teams', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const teams = await Team.find({}).populate('members').sort({ createdAt: -1 });
        res.render('admin/teams', { teams });
    } catch (err) {
        res.status(500).send('Ошибка при получении команд');
    }
});

// Управление пользователями
router.get('/users', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const users = await User.find({}).sort({ username: 1 });
        res.render('admin/users', { users });
    } catch (err) {
        res.status(500).send('Ошибка при получении пользователей');
    }
});

router.post('/users/:id/delete', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      req.flash('success', 'Пользователь удалён успешно');
      res.redirect('/admin/users');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Ошибка при удалении пользователя');
      res.redirect('/admin/users');
    }
  });
router.post('/users/:id/promote', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        req.flash('error', 'Пользователь не найден');
        return res.redirect('/admin/users');
      }

      user.isAdmin = true;
      await user.save();

      req.flash('success', 'Пользователь успешно повышен');
      res.redirect('/admin/users');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Ошибка при повышении пользователя');
      res.redirect('/admin/users');
    }
  });

  router.post('/users/:id/demote', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        req.flash('error', 'Пользователь не найден');
        return res.redirect('/admin/users');
      }

      user.isAdmin = false;
      await user.save();

      req.flash('success', 'Пользователь успешно понижен');
      res.redirect('/admin/users');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Ошибка при понижении пользователя');
      res.redirect('/admin/users');
    }
  });
module.exports = router;
