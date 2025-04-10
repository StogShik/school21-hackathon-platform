// admin-setup.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Подключаемся к базе данных (укажите свой URL, если необходимо)
mongoose.connect('mongodb://localhost:27017/hackathon', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Подключение к базе данных успешно выполнено');

    // Создаем пользователя-админа
    const adminData = {
      username: "admin",
      telegram: "stogshik",
      isAdmin: true  // Флаг администратора
    };

    // Используем метод register из passport-local-mongoose для регистрации
    User.register(new User(adminData), process.env.ADMIN_PASSWORD, (err, user) => {
      if (err) {
        console.error("Ошибка при создании администратора:", err.message);
      } else {
        console.log("Пользователь-админ создан успешно:", user);
      }
      // После завершения закрываем соединение
      mongoose.connection.close();
    });
  })
  .catch(err => {
    console.error('Ошибка подключения к базе данных:', err);
  });
