document.addEventListener('DOMContentLoaded', () => {
  const tg = window.Telegram.WebApp;

  const LEVELS = [
    { name: 'Bronze', label: 1, max: 5000, next: '5K' },
    { name: 'Silver', label: 2, max: 25000, next: '25K' },
    { name: 'Gold', label: 3, max: 100000, next: '100K' },
    { name: 'Platinum', label: 4, max: 1000000, next: '1M' },
    { name: 'Diamond', label: 5, max: 2000000, next: '2M' },
    { name: 'Epic', label: 6, max: 10000000, next: '10M' },
    { name: 'Legendary', label: 7, max: 50000000, next: '50M' },
    { name: 'Master', label: 8, max: 100000000, next: '100M' },
    { name: 'Grandmaster', label: 9, max: 1000000000, next: '1B' },
    { name: 'Lord', label: 10, max: 10000000000, next: '10B' }
];

  function initApp() {
      registerUser();
      showReferrals();
      identifyReferral();
      tg.expand();
      updateGameDataDisplay();
      setInterval(updateEnergyDisplay, 1000);
      setInterval(syncGameData, 2000);
  }

  async function postData(url, options = {}) {
      try {
          options.headers = {
            'Content-Type': 'application/json'
          }

          if (options.body) {
            options.body = JSON.stringify(options.body)
          }

          if (!options.method) {
            options.method = 'GET'
          }
          
          const response = await fetch(`/api${url}`, options);
          if (!response.ok) throw new Error('Network response was not ok');
          return await response.json();
      } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
      }
  }

  function getTelegramId() {
      return tg.initDataUnsafe.user.id;
  }

  function getLeftEnergy() {
      const energy = document.getElementById('energyLabel').textContent.split('/')[0];
      return parseInt(energy, 10) || 1;
  }

  function getLeftCoins() {
      return parseInt(document.getElementById('coinsLabel').textContent.replace(/,/g, ''), 10) || 1;
  }

  async function updateGameDataDisplay() {
      const data = await postData(`/gamedata/${getTelegramId()}`);
      if (data && data.data.length) {
          const record = data.data[data.data.length - 1];
          updateCoinsDisplay(record.coins);
          updateEnergyDisplay(record.energy, record.time);
          updateProgressBar();
      }
  }

  function updateCoinsDisplay(coins) {
      document.getElementById('coinsLabel').textContent = coins.toLocaleString();
  }

  function updateEnergyDisplay(energy, lastUpdateTime) {
      const currentTime = new Date();
      const lastUpdateTimeDate = new Date(lastUpdateTime);
      const diffInSeconds = Math.floor((currentTime - lastUpdateTimeDate) / 1000);
      const updatedEnergy = Math.min(1000, energy + diffInSeconds);
      document.getElementById('energyLabel').textContent = `${updatedEnergy}/1000`;
  }

  function updateProgressBar() {
      const coins = getLeftCoins();
      const { name, label, max, next } = getLevelProgress(coins);
      const progressBar = document.getElementById('progressBar');
      const barWidth = Math.min((coins / max) * 100, 100);

      document.getElementById('progressBarBoxStatusLabel').textContent = `${name} >`;
      document.getElementById('progressBarBoxLevelLabel').textContent = `Level ${label}/10`;
      document.getElementById('clicksTillLevelUpLabel').textContent = next;

      progressBar.style.width = `${barWidth}%`;
  }

  function getLevelProgress(coins) {
      return LEVELS.find(level => coins <= level.max) || LEVELS[LEVELS.length - 1];
  }

  async function syncGameData() {
      await postData(`/gamedata/${getTelegramId()}`, {
          method: 'PATCH',
          body: {
            energy: getLeftEnergy(),
            coins: getLeftCoins(),
            time: new Date().toISOString()
          }
      });
  }

  async function registerUser() {
      const user = tg.initDataUnsafe.user;
      await postData('/userinformation', {
          method: 'POST',
          body: {
              telegramId: user.id,
              telegramUsername: user.username || 'No username',
              photo: user.photo_url || 'No photo available',
              isPremium: user.is_premium || false,
          }
      });
  }

  async function identifyReferral() {
      const currentUrl = new URL(window.location.href);
      const referralCode = currentUrl.searchParams.get('start');
      if (referralCode && referralCode !== 'undefined') {
          const telegramSourceId = getTelegramId();
          const referrals = await postData(`/referrals/${referralCode}`);
          if (!referrals.data.some(ref => ref.telegramReferralId === telegramSourceId)) {
              await postData('/referrals', {
                  method: 'POST',
                  body: {
                    sourceTelegramId: referralCode,
                    referralTelegramId: telegramSourceId,
                  }
              });
          }
      }
  }

  async function showReferrals() {
      const telegramSourceId = getTelegramId();
      const data = await postData(`/referrals/${telegramSourceId}`);
      const referrals = data.data || [];
      if (referrals.length) {
          document.getElementById('noInvitesMessage').style.display = 'none';
          referrals.forEach(createReferralEntry);
      }
  }

  async function createReferralEntry(referral) {
      const userInfo = await postData(`/userinformation/${referral.telegramReferralId}`);
      const user = userInfo.data[0];
      const isPremium = user.isPremium === 'true';
      const friendEntry = document.createElement('div');
      friendEntry.classList.add('subFriendsBox');
      friendEntry.innerHTML = `
          <h4 class="subFriendsBoxUsername">${user.username}</h4>
          <h4 class="subFriendsBoxStatus">${getReferralStatus(referral, isPremium)}</h4>
      `;
      document.getElementById('friendsBox').appendChild(friendEntry);
  }

  function getReferralStatus(referral, isPremium) {
      if (referral.verified) {
          return 'Bonus already added';
      } 
      
      verifyReferral(referral.telegramReferralId);
      const bonus = isPremium ? 25000 : 5000;
      updateCoinsDisplay(getLeftCoins() + bonus);
      return isPremium ? '-- +25000 --' : '-- +5000 --';
  }

  async function verifyReferral(telegramId) {
      await postData(`/referrals/${telegramId}`, { method: 'PATCH', body: { updateType: 'verified' } });
  }

  function handleMenuClick(event) {
      const targetId = event.target.id;
      const sections = ['gameField', 'referalField', 'earnBox', 'devField'];
      const buttons = ['gameButton', 'friendsButton', 'earnButton', 'developerButton'];
      sections.forEach(section => document.getElementById(section).style.display = 'none');
      buttons.forEach(button => document.getElementById(button).style.color = 'white');
      switch (targetId) {
          case 'gameButton':
              document.getElementById('gameField').style.display = 'block';
              break;
          case 'friendsButton':
              document.getElementById('referalField').style.display = 'block';
              break;
          case 'earnButton':
              document.getElementById('earnBox').style.display = 'block';
              break;
          case 'developerButton':
              document.getElementById('devField').style.display = 'block';
              break;
      }
      event.target.style.color = 'red';
      updateProgressBar();
  }

  function handleMainButtonClick() {
      const energy = getLeftEnergy();
      if (energy > 0) {
          updateCoinsDisplay(getLeftCoins() + 1);
          updateEnergyDisplay(energy - 1, new Date().toISOString());
      }
  }

  function handleReferralButtonClick() {
      const shareUrl = `https://t.me/share/url?url=https%3A%2F%2Ft.me/telegclick_bot?start=${getTelegramId()}&text=Join%20this%20game!`;
      Telegram.WebApp.openTelegramLink(shareUrl);
  }

  document.getElementById('menu').addEventListener('click', handleMenuClick);
  document.getElementById('mainButtonBox').addEventListener('click', handleMainButtonClick);
  document.getElementById('inviteFriendBox').addEventListener('click', handleReferralButtonClick);
  document.getElementById('dailyRewardsBox').addEventListener('click', () => {
      document.getElementById('dailyRewardsPopUpBox').style.display = 'block';
  });
  document.getElementById('closeDailyRewardsPopUpBox').addEventListener('click', () => {
      document.getElementById('dailyRewardsPopUpBox').style.display = 'none';
  });
  document.getElementById('refreshFriendsList').addEventListener('click', updateProgressBar);

  initApp();
});
