// routes/cases.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/auth');
const Case = require('../models/Case');

router.get('/cases', ensureAuthenticated, async (req, res) => {
  try {
    const cases = await Case.find({}).sort({ createdAt: -1 });
    res.render('pages/cases', { cases });
  } catch (err) {
    res.status(500).send('Ошибка при получении кейсов');
  }
});

module.exports = router;
