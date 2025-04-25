const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../utils/auth');
const Team = require('../../models/Team');
const Invitation = require('../../models/Invitation');

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const teams = await Team.find({ members: req.user._id }).populate('members');
        const invitations = await Invitation.find({ 
            invitee: req.user._id, 
            status: 'pending' 
        }).populate('team inviter');
        
        res.json({ teams, invitations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при получении данных личного кабинета' });
    }
});

module.exports = router;
