// admin-setup.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://mongo:27017/hackathon', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Подключение к базе данных успешно выполнено');

    const adminData = {
      username: "admin",
      telegram: "admin",
      isAdmin: true
    };

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    User.register(new User(adminData), adminPassword, (err, user) => {
      if (err) {
        console.error("Ошибка при создании администратора:", err.message);
      } else {
        console.log("Пользователь-админ создан успешно:", user);
      }
      mongoose.connection.close();
    });
  })
  .catch(err => {
    console.error('Ошибка подключения к базе данных:', err);
  });
