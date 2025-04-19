const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const apiRoutes = require('./routes/api');

require('dotenv').config();
const app = express();

app.use((req, res, next) => {
  console.log(`[DEBUG] ${new Date().toISOString()} - Request received: ${req.method} ${req.originalUrl}`);
  next();
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/hackathon', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('MongoDB успешно подключена'))
  .catch(err => {
    console.error('Ошибка подключения к MongoDB:', err);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at', uploadsDir);
}

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost',
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/cases/files', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filepath) => {
        console.log('Serving file directly:', filepath);
        res.set('Content-Disposition', 'attachment');
    }
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false
}));

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/debug', (req, res) => {
    res.status(200).json({
        status: 'ok', 
        message: 'Backend server is running',
        env: {
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT,
            MONGODB_URI: process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set',
            SESSION_SECRET: process.env.SESSION_SECRET ? 'Set (hidden)' : 'Not set',
            CORS_ORIGIN: process.env.CORS_ORIGIN
        }
    });
});

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Request body keys:', Object.keys(req.body || {}));
    }
    next();
});

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use('/auth', apiRoutes);
app.use('/', apiRoutes);

app.use('*', (req, res) => {
  console.log(`[DEBUG] No route found for ${req.method} ${req.originalUrl}`);
  res.status(404).send(`No route found for ${req.method} ${req.originalUrl}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
