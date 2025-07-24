const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('querystring');
const app = express();
app.use(bodyParser.json());

const CLIENT_ID = 'ТВОЙ_CLIENT_ID';
const CLIENT_SECRET = 'ТВОЙ_CLIENT_SECRET';
const BASE_URL = 'https://your-app.onrender.com'; // ← замени позже

// Установка приложения (OAuth)
app.get('/install', (req, res) => {
  const redirect = https://oauth.bitrix.info/oauth/authorize/?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${BASE_URL}/oauth;
  res.redirect(redirect);
});

// Обработка OAuth
app.get('/oauth', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenResponse = await axios.post(
      'https://oauth.bitrix.info/oauth/token/',
      qs.stringify({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: ${BASE_URL}/oauth
      })
    );

    const { access_token, domain } = tokenResponse.data;

    // Подписываемся на событие
    await axios.post(`https://${domain}/rest/event.bind.json`, {
      event: 'OnImOpenLineMessageAdd',
      handler: ${BASE_URL}/hook
    }, {
      headers: { Authorization: Bearer ${access_token} }
    });

    res.send(`✅ Приложение установлено для портала ${domain}`);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send('Ошибка установки');
  }
});

// Обработка событий
app.post('/hook', (req, res) => {
  console.log('📥 Событие от Битрикс24:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер слушает порт ${PORT}`));
