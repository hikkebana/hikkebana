const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Проверка доступности
app.get('/', (req, res) => {
  res.send('✅ B24 приложение работает');
});

// Установка приложения
app.get('/install', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    console.log('❌ Нет кода авторизации в query');
    return res.status(400).send('No auth code provided');
  }

  console.log('▶ Получен код авторизации:', code);

  try {
    // Обмен кода на токен
    const tokenRes = await axios.post('https://oauth.bitrix.info/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: 'local.68826ad3562c69.50575076',       // <== сюда
        client_secret: 'oFEfKF9BAh5Ae6IeRNE0PGknqJNPSWAtef8JS5qR5WICXLkpm8', // <== и сюда
        code
      }
    });

    const { access_token, refresh_token, domain, member_id } = tokenRes.data;

    console.log('✅ Токен получен:', access_token);
    console.log('🌍 Домен портала:', domain);

    // Подписка на событие
    const eventRes = await axios.post(`https://${domain}/rest/event.bind`, null, {
      params: {
        event: 'OnImOpenLineMessageAdd',
        handler: 'https://hikkebana.onrender.com/hook', // 👈 сюда можно подставить свой Render-URL
        auth: access_token
      }
    });

    console.log('✅ Подписка успешна:', eventRes.data);

    res.send('✅ Приложение установлено и подписано');
  } catch (error) {
    console.error('❌ Ошибка при установке:', error.response?.data || error.message);
    res.status(500).send('Ошибка при установке приложения');
  }
});

// Хук обработки события входящего сообщения
app.post('/hook', (req, res) => {
  console.log('📨 Входящее сообщение в открытой линии:');
  console.dir(req.body, { depth: null });
  res.send('ok');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
