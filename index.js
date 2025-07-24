const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Главная проверка
app.get('/', (req, res) => {
  res.send('B24 Webhook app is running.');
});

// Установка приложения
app.post('/install', async (req, res) => {
  const { auth } = req.body;

  if (!auth  !auth.access_token  !auth.domain) {
    console.log('Ошибка: нет auth данных');
    return res.status(400).send('Ошибка установки');
  }

  console.log('▶ Установка приложения с портала:', auth.domain);
  console.log('▶ Токен:', auth.access_token);

  // Подписка на событие входящего сообщения в открытой линии
  try {
    const result = await axios.post(`https://${auth.domain}/rest/event.bind`, null, {
      params: {
        event: 'OnImOpenLineMessageAdd',
        handler: 'https://hikkebana.onrender.com/hook',
        auth: auth.access_token
      }
    });

    console.log('✅ Подписка успешно создана:', result.data);
  } catch (err) {
    console.error('❌ Ошибка подписки:', err.response?.data || err.message);
  }

  res.status(200).send('Приложение установлено');
});

// Обработка события входящего сообщения
app.post('/hook', (req, res) => {
  console.log('📨 Новое сообщение из открытой линии:');
  console.dir(req.body, { depth: null });
  res.status(200).send('ok');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
