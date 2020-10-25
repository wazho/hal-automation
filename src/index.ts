// Node modules.
import fetch from 'node-fetch';
import delay from 'delay';

const host = 'https://gateway.live-a-hero.jp';

// Secret parmeters.
const userKey = String(process.env.USER_KEY);
const supportPlayerId = Number(process.env.SUPPORT_PLAYER_ID);
const supportCardId = Number(process.env.SUPPORT_CARD_ID);
const questId = Number(process.env.QUEST_ID);

const basedHeaders = {
  'Host': 'gateway.live-a-hero.jp',
  'Accept': '*/*',
  'Accept-Encoding': 'gzip, deflate',
  'User-Agent': 'LiveAHeroAPI/1.0.4 Android OS 7.1.2 / API-25 (N2G48H/rel.se.infra.20200730.150525) google G011A',
  'user-identifier': userKey,
  'X-Unity-Version': '2019.4.10f1',
  'Connection': 'close',
};

(async () => {
  await fetch(`${host}/api/user/login`, {
    method: 'GET',
    headers: basedHeaders,
  });

  console.log('Login');
  await delay(5 * 1000);

  await fetch(`${host}/api/quest/start`, {
    method: 'POST',
    headers: {
      ...basedHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questId }),
  });

  console.log('Quest start');
  await delay(2 * 1000);

  await fetch(`${host}/api/quest/event/progress`, {
    method: 'POST',
    headers: {
      ...basedHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      questId,
      team: {
        teamType: 0,
        teamId: 1,
        supportPosition: 1,
        supportPlayerId,
        supportType: 1,
        supportCardId,
        positions: null,
      }
    }),
  });

  console.log('Progress init');
  await delay(10 * 1000);

  await fetch(`${host}/api/quest/event/progress`, {
    method: 'POST',
    headers: {
      ...basedHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      questId,
      battleResult: {
        isWin: true,
        enemies: [
          { nowHp: 0, positionId: 0 },
          { nowHp: 0, positionId: 1 },
          { nowHp: 0, positionId: 2 },
          { nowHp: 0, positionId: 3 },
        ]
      }
    }),
  });

  console.log('Progress report');
  await delay(1 * 1000);

  await fetch(`${host}/api/quest/end`, {
    method: 'POST',
    headers: {
      ...basedHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questId }),
  });

  console.log('Quest end');
})();
