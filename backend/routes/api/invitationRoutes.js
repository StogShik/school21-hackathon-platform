const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../utils/auth');
const Team = require('../../models/Team');
const Invitation = require('../../models/Invitation');

router.post('/:id/accept', ensureAuthenticated, async (req, res) => {
    try {
        const invitation = await Invitation.findById(req.params.id);
        if (!invitation) {
            return res.status(404).json({ message: 'Приглашение не найдено' });
        }
        if (!invitation.invitee.equals(req.user._id)) {
            return res.status(403).json({ message: 'Нет прав для этого действия' });
        }
        
        invitation.status = 'accepted';
        await invitation.save();
        
        const team = await Team.findById(invitation.team);
        if (!team.members.includes(req.user._id)) {
            team.members.push(req.user._id);
            await team.save();
        }
        
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при принятии приглашения' });
    }
});

router.post('/:id/decline', ensureAuthenticated, async (req, res) => {
    try {
        const invitation = await Invitation.findById(req.params.id);
        if (!invitation) {
            return res.status(404).json({ message: 'Приглашение не найдено' });
        }
        if (!invitation.invitee.equals(req.user._id)) {
            return res.status(403).json({ message: 'Нет прав для этого действия' });
        }
        
        invitation.status = 'declined';
        await invitation.save();
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при отклонении приглашения' });
    }
});

module.exports = router;
