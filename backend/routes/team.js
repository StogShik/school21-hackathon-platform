// routes/team.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/auth');
const Team = require('../models/Team');

// Отображение формы для создания команды
router.get('/team/create', ensureAuthenticated, (req, res) => {
  res.render('pages/createTeam');
});

// Обработка создания команды (без приглашений)
router.post('/team/create', ensureAuthenticated, async (req, res) => {
  const { teamName, githubLink } = req.body;
  try {
    const newTeam = new Team({ name: teamName, githubLink });
    newTeam.members.push(req.user._id);
    await newTeam.save();
    req.flash('success', 'Команда успешно создана');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ошибка при создании команды');
    res.redirect('/team/create');
  }
});

// Отображение страницы с деталями команды
router.get('/team/:id', ensureAuthenticated, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members');
    if (!team) {
      req.flash('error', 'Команда не найдена');
      return res.redirect('/dashboard');
    }
    res.render('pages/team', { team, user: req.user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ошибка при получении информации о команде');
    res.redirect('/dashboard');
  }
});

// Выход из команды (и удаление команды, если она пуста)
router.post('/team/:id/leave', ensureAuthenticated, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      req.flash('error', 'Команда не найдена');
      return res.redirect('/dashboard');
    }
    if (!team.members.includes(req.user._id)) {
      req.flash('error', 'Вы не состоите в этой команде');
      return res.redirect(`/team/${req.params.id}`);
    }
    team.members = team.members.filter(member => !member.equals(req.user._id));
    if (team.members.length === 0) {
      await Team.findByIdAndDelete(req.params.id);
      req.flash('success', 'Вы покинули команду, команда удалена так как стала пустой');
      return res.redirect('/dashboard');
    }
    await team.save();
    req.flash('success', 'Вы успешно покинули команду');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ошибка при выходе из команды');
    res.redirect(`/team/${req.params.id}`);
  }
});

// Обновление GitHub-ссылки команды
router.post('/team/:id/edit-github', ensureAuthenticated, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      req.flash('error', 'Команда не найдена');
      return res.redirect('/dashboard');
    }
    if (!team.members.some(member => member.equals(req.user._id))) {
      req.flash('error', 'Вы не состоите в этой команде');
      return res.redirect(`/team/${req.params.id}`);
    }
    team.githubLink = req.body.githubLink;
    await team.save();
    req.flash('success', 'GitHub-ссылка успешно обновлена');
    res.redirect(`/team/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ошибка при обновлении GitHub-ссылки');
    res.redirect(`/team/${req.params.id}`);
  }
});

// Отображение формы для приглашения участника в команду
router.get('/team/:teamId/invite', ensureAuthenticated, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team.members.includes(req.user._id)) {
      req.flash('error', 'Вы не состоите в этой команде');
      return res.redirect('/dashboard');
    }
    res.render('pages/inviteTeam', { team });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ошибка при получении данных команды');
    res.redirect('/dashboard');
  }
});

module.exports = router;
