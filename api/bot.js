const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Mesaj metninden referans kodunu çıkarın
  const referralCode = text.split(' ')[1] || '';

  // Telegram Web App URL'si
  const webAppUrl = `https://t.me/CinnconBot/webapp?start=${referralCode}`;

  if (text != '') {
    await bot.sendMessage(chatId, "Click on the button 'Play', in order to start a game.", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Play", web_app: { url: webAppUrl } }]
        ]
      }
    });
  }
});

function setCustomChatMenuButton(chatId, referralCode) {
  const webAppUrl = `https://t.me/CinnconBot/webapp?start=${referralCode}`;
  console.log(referralCode);
  const menuButtonData = {
    chat_id: chatId,
    menu_button: {
      type: "web_app",
      text: "Play",
      web_app: {
        url: webAppUrl
      }
    }
  };

  fetch(`https://api.telegram.org/bot${token}/setChatMenuButton`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menuButtonData)
  })
  .then(response => response.json())
  .then(result => {
    if (result.ok) {
      console.log('Custom chat menu button set successfully');
    } else {
      console.error('Failed to set custom chat menu button:', result);
    }
  })
  .catch(error => {
    console.error('Error setting custom chat menu button:', error);
  });
}
