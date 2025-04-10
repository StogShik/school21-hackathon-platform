const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const cors = require('cors');

const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();
// Инициализация Express
const app = express();

// Подключение к MongoDB (замените URL при необходимости)
mongoose.connect('mongodb://localhost:27017/hackathon', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('MongoDB подключена'))
  .catch(err => console.log(err));

// Настройка view engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors({
  origin: process.env.CORS_ORIGIN, // можно указать конкретный URL, например: 'http://example.com'

}));

// Подключение статических файлов из каталога public
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser для получения данных из форм
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Настройка сессий
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Подключение Passport (конфигурация в файле config/passport.js)
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Подключаем connect-flash для сообщений
app.use(flash());

// Глобальные переменные: текущий пользователь и flash-сообщения
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Импорт и использование роутов
const homeRoutes = require('./routes/home');
const casesRoutes = require('./routes/cases');
const dashboardRoutes = require('./routes/dashboard');
const teamRoutes = require('./routes/team');
const invitationRoutes = require('./routes/invitations');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
// Монтируем роуты (при желании с префиксами)
app.use('/', homeRoutes);
app.use('/', casesRoutes);
app.use('/', dashboardRoutes);
app.use('/', teamRoutes);
app.use('/', invitationRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
