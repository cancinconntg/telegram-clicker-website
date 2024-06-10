const TelegramBot = require('node-telegram-bot-api');

const token = '7039700796:AAFMj4Ujd9hLfhRelTptmw3nOhz7EhHWeu0';

const bot = new TelegramBot(token, { polling: true }); 

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  

  // Extract referral code from the message text
  const referralCode = msg.text.split(' ')[1];
  setCustomChatMenuButton(chatId, referralCode);

  // Use the referral code as needed
  
  const webAppUrl = `https://telegram-clicker-website.onrender.com/?start=${referralCode}`;

  // Continue with your bot's logic...


  if (msg.text != '') {
    await bot.sendMessage(chatId, "Click on the button 'Play', in order to start a game.", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Play", web_app: { url: webAppUrl } }]
        ]
      }
    });
  };
});

function setCustomChatMenuButton(chatId, referralCode) {
  const webAppUrl = `https://telegram-clicker-website.onrender.com/?start=${referralCode}`;
  console.log(referralCode)
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