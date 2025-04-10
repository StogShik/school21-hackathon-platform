// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/auth');
const Team = require('../models/Team');
const Invitation = require('../models/Invitation');

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id });
    const invitations = await Invitation.find({ invitee: req.user._id, status: 'pending' })
                                        .populate('team inviter');
    res.render('pages/dashboard', { teams, invitations, user: req.user });
  } catch (err) {
    res.status(500).send('Ошибка при получении данных личного кабинета');
  }
});

module.exports = router;
