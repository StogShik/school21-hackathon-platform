const express = require('express');
const router = express.Router();

const authRoutes = require('./api/authRoutes');
const dashboardRoutes = require('./api/dashboardRoutes');
const teamRoutes = require('./api/teamRoutes');
const invitationRoutes = require('./api/invitationRoutes');
const casesRoutes = require('./api/casesRoutes');
const adminRoutes = require('./api/adminRoutes');

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/team', teamRoutes);
router.use('/invitations', invitationRoutes);
router.use('/cases', casesRoutes);
router.use('/admin', adminRoutes);

router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports = router;
