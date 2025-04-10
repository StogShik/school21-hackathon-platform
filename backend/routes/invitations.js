// routes/invitations.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/auth');
const Invitation = require('../models/Invitation');
const Team = require('../models/Team');
const User = require('../models/User');

// Получение списка входящих приглашений
router.get('/invitations', ensureAuthenticated, async (req, res) => {
  try {
    const invitations = await Invitation.find({ invitee: req.user._id, status: 'pending' })
                                          .populate('team inviter');
    res.render('pages/invitations', { invitations });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ошибка при получении приглашений');
    res.redirect('/dashboard');
  }
});

// Принятие приглашения
router.post('/invitations/:id/accept', ensureAuthenticated, async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) {
      req.flash('error', 'Приглашение не найдено');
      return res.redirect('/dashboard');
    }
    if (!invitation.invitee.equals(req.user._id)) {
      req.flash('error', 'Нет прав для этого действия');
      return res.redirect('/dashboard');
    }
    invitation.status = 'accepted';
    await invitation.save();
    const team = await Team.findById(invitation.team);
    if (!team.members.includes(req.user._id)) {
      team.members.push(req.user._id);
      await team.save();
    }
    req.flash('success', 'Вы приняли приглашение и присоединились к команде');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ошибка при принятии приглашения');
    res.redirect('/dashboard');
  }
});

// Отклонение приглашения
router.post('/invitations/:id/decline', ensureAuthenticated, async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) {
      req.flash('error', 'Приглашение не найдено');
      return res.redirect('/dashboard');
    }
    if (!invitation.invitee.equals(req.user._id)) {
      req.flash('error', 'Нет прав для этого действия');
      return res.redirect('/dashboard');
    }
    invitation.status = 'declined';
    await invitation.save();
    req.flash('success', 'Приглашение отклонено');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ошибка при отклонении приглашения');
    res.redirect('/dashboard');
  }
});

// Отправка приглашения (если не реализована в team.js)
router.post('/invitations/send', ensureAuthenticated, async (req, res) => {
  const { teamId, inviteeUsername } = req.body;
  try {
    const team = await Team.findById(teamId);
    if (!team.members.includes(req.user._id)) {
      req.flash('error', 'Вы не состоите в этой команде');
      return res.redirect('/dashboard');
    }
    const invitedUser = await User.findOne({ username: inviteeUsername });
    if (!invitedUser) {
      req.flash('error', `Пользователь с именем ${inviteeUsername} не найден`);
      return res.redirect(`/team/${teamId}/invite`);
    }
    if (team.members.includes(invitedUser._id)) {
      req.flash('error', 'Пользователь уже является участником команды');
      return res.redirect(`/team/${teamId}/invite`);
    }
    const invitation = new Invitation({
      team: team._id,
      inviter: req.user._id,
      invitee: invitedUser._id,
      status: 'pending'
    });
    await invitation.save();
    req.flash('success', 'Приглашение отправлено');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ошибка при отправке приглашения');
    res.redirect('/dashboard');
  }
});

module.exports = router;
