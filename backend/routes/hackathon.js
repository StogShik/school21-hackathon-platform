const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/auth');
const Team = require('../models/Team');
const User = require('../models/User');
const Invitation = require('../models/Invitation');
const Case = require('../models/Case');
// Главная страница
router.get('/', (req, res) => {
    res.render('pages/home');
});

// Список кейсов
router.get('/cases', ensureAuthenticated,async (req, res) => {
    try {
        const cases = await Case.find({}).sort({ createdAt: -1 });
        res.render('pages/cases', { cases });
    } catch (err) {
        res.status(500).send('Ошибка при получении кейсов');
    }
});

// Личный кабинет (dashboard) – только для аутентифицированных пользователей
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const teams = await Team.find({ members: req.user._id });
        const invitations = await Invitation.find({ invitee: req.user._id, status: 'pending' })
        .populate('team inviter');
        res.render('pages/dashboard', { teams, invitations, user: req.user});
    } catch (err) {
        res.status(500).send('Ошибка при получении данных личного кабинета');
    }
});



router.get('/team/create', ensureAuthenticated, (req, res) => {
    res.render('pages/createTeam'); // Обновлённый шаблон (см. ниже)
  });
  
  // Обработка отправки формы создания команды (без приглашений)
  router.post('/team/create', ensureAuthenticated, async (req, res) => {
    const { teamName, githubLink } = req.body;
    try {
      // Создаём новую команду
      const newTeam = new Team({ name: teamName, githubLink });
      // Добавляем создателя команды
      newTeam.members.push(req.user._id);
      await newTeam.save();
      
      req.flash('success', 'Команда успешно создана');
      res.redirect(`/dashboard`); // Перенаправляем пользователя в личный кабинет или на страницу команды
    } catch (err) {
      console.error(err);
      req.flash('error', 'Ошибка при создании команды');
      res.redirect('/team/create');
    }
  });
  
// routes/hackathon.js (продолжение)
router.get('/invitations', ensureAuthenticated, async (req, res) => {
    try {
      // Получаем все приглашения, где текущий пользователь является invitee и статус "pending"
      const invitations = await Invitation.find({ invitee: req.user._id, status: 'pending' })
                                          .populate('team inviter');
      res.render('pages/invitations', { invitations });
    } catch (err) {
      console.error(err);
      req.flash('error', 'Ошибка при получении приглашений');
      res.redirect('/dashboard');
    }
  });
  

// routes/hackathon.js (продолжение)
router.post('/invitations/:id/accept', ensureAuthenticated, async (req, res) => {
    try {
      const invitation = await Invitation.findById(req.params.id);
      if (!invitation) {
        req.flash('error', 'Приглашение не найдено');
        return res.redirect('/dashboard');
      }
      // Проверяем, что приглашение адресовано текущему пользователю
      if (!invitation.invitee.equals(req.user._id)) {
        req.flash('error', 'Нет прав для этого действия');
        return res.redirect('/dashboard');
      }
      // Обновляем статус
      invitation.status = 'accepted';
      await invitation.save();
  
      // Добавляем пользователя в команду, если ещё не добавлен
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
  
  // routes/hackathon.js (продолжение)
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
router.get('/team/:id', ensureAuthenticated, async (req, res) => {
    try {
      // Находим команду по ID и подгружаем данные участников
      const team = await Team.findById(req.params.id).populate('members');
      if (!team) {
        req.flash('error', 'Команда не найдена');
        return res.redirect('/dashboard');
      }
      // Рендерим страницу команды, передавая объект team
      res.render('pages/team', { team, user: req.user });
    } catch (err) {
      console.error(err);
      req.flash('error', 'Ошибка при получении информации о команде');
      res.redirect('/dashboard');
    }
});
  
  // Отобразить форму для приглашения участника в команду
router.get('/team/:teamId/invite', ensureAuthenticated, async (req, res) => {
    try {
      const team = await Team.findById(req.params.teamId);
      // Проверяем, что текущий пользователь является участником команды (или её создателем)
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
  
  // Обработка отправки приглашения
  router.post('/team/:teamId/invite', ensureAuthenticated, async (req, res) => {
    const { inviteeUsername } = req.body;
    try {
      const team = await Team.findById(req.params.teamId);
      if (!team.members.includes(req.user._id)) {
        req.flash('error', 'Вы не состоите в этой команде');
        return res.redirect('/dashboard');
      }
      const invitedUser = await User.findOne({ username: inviteeUsername });
      if (!invitedUser) {
        req.flash('error', `Пользователь с именем ${inviteeUsername} не найден`);
        return res.redirect(`/team/${team._id}/invite`);
      }
      // Проверим, что пользователь ещё не в команде
      if (team.members.includes(invitedUser._id)) {
        req.flash('error', 'Пользователь уже является участником команды');
        return res.redirect(`/team/${team._id}/invite`);
      }
      // Создаём приглашение
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
  
  // Маршрут для выхода из команды
router.post('/team/:id/leave', ensureAuthenticated, async (req, res) => {
    try {
      // Находим команду по ID
      const team = await Team.findById(req.params.id);
      if (!team) {
        req.flash('error', 'Команда не найдена');
        return res.redirect('/dashboard');
      }
      // Проверяем, что текущий пользователь является участником команды
      if (!team.members.includes(req.user._id)) {
        req.flash('error', 'Вы не состоите в этой команде');
        return res.redirect(`/team/${req.params.id}`);
      }
      
      // Удаляем пользователя из массива участников (members)
      team.members = team.members.filter(member => !member.equals(req.user._id));
      
      // Если после удаления участников массив пустой – удаляем команду
      if (team.members.length === 0) {
        await Team.findByIdAndDelete(req.params.id);
        req.flash('success', 'Вы успешно покинули команду');
        return res.redirect('/dashboard');
      }
      
      // Иначе сохраняем обновлённую команду
      await team.save();
      req.flash('success', 'Вы успешно покинули команду');
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Ошибка при выходе из команды');
      res.redirect(`/team/${req.params.id}`);
    }
  });

// Маршрут для обновления GitHub-ссылки команды
router.post('/team/:id/edit-github', ensureAuthenticated, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      req.flash('error', 'Команда не найдена');
      return res.redirect('/dashboard');
    }
    // Проверяем, что текущий пользователь является участником команды
    // (Преобразуем ObjectId в строку для корректного сравнения)
    if (!team.members.some(member => member.equals(req.user._id))) {
      req.flash('error', 'Вы не состоите в этой команде');
      return res.redirect(`/team/${req.params.id}`);
    }
    // Обновляем GitHub-ссылку из данных формы
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


  

module.exports = router;
