const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../utils/auth');
const Team = require('../../models/Team');
const User = require('../../models/User');
const Invitation = require('../../models/Invitation');

router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('members');
        if (!team) {
            return res.status(404).json({ message: 'Команда не найдена' });
        }
        res.json({ team });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при получении информации о команде' });
    }
});

router.post('/create', ensureAuthenticated, async (req, res) => {
    const { teamName, githubLink } = req.body;
    try {
        const newTeam = new Team({ 
            name: teamName, 
            githubLink: githubLink || '' 
        });
        newTeam.members.push(req.user._id);
        await newTeam.save();
        res.json({ success: true, team: newTeam });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при создании команды' });
    }
});

router.post('/:id/leave', ensureAuthenticated, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Команда не найдена' });
        }
        if (!team.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Вы не состоите в этой команде' });
        }
        
        team.members = team.members.filter(member => !member.equals(req.user._id));
        
        if (team.members.length === 0) {
            await Team.findByIdAndDelete(req.params.id);
            return res.json({ success: true, message: 'Вы покинули команду, команда удалена' });
        }
        
        await team.save();
        res.json({ success: true, message: 'Вы успешно покинули команду' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при выходе из команды' });
    }
});

router.post('/:id/edit-github', ensureAuthenticated, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Команда не найдена' });
        }
        if (!team.members.some(member => member.equals(req.user._id))) {
            return res.status(403).json({ message: 'Вы не состоите в этой команде' });
        }
        
        team.githubLink = req.body.githubLink;
        await team.save();
        res.json({ success: true, team });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при обновлении GitHub-ссылки' });
    }
});

router.post('/:teamId/invite', ensureAuthenticated, async (req, res) => {
    const { inviteeUsername } = req.body;
    try {
        const team = await Team.findById(req.params.teamId);
        if (!team) {
            return res.status(404).json({ message: 'Команда не найдена' });
        }
        if (!team.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Вы не состоите в этой команде' });
        }
        
        const invitedUser = await User.findOne({ username: inviteeUsername });
        if (!invitedUser) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        
        if (team.members.includes(invitedUser._id)) {
            return res.status(400).json({ message: 'Пользователь уже в команде' });
        }
        
        const existingInvitation = await Invitation.findOne({
            team: team._id,
            invitee: invitedUser._id,
            status: 'pending'
        });
        
        if (existingInvitation) {
            return res.status(400).json({ message: 'Приглашение уже отправлено' });
        }
        
        const invitation = new Invitation({
            team: team._id,
            inviter: req.user._id,
            invitee: invitedUser._id,
            status: 'pending'
        });
        
        await invitation.save();
        res.json({ success: true, invitation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при отправке приглашения' });
    }
});

module.exports = router;
