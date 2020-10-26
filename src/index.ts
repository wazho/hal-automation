// Node modules.
import _ from 'lodash';
import delay from 'delay';
// Local modules.
import HeroAPI from './heroAPI';

// Secret parmeters.
const userKeys = String(process.env.USER_KEYS).split(',');
const supportPlayerIds = String(process.env.SUPPORT_PLAYER_IDS).split(',').map(Number);
const supportCardIds = String(process.env.SUPPORT_CARD_IDS).split(',').map(Number);
const questId = Number(process.env.QUEST_ID);

const delayRange = (min: number, max: number) => {
  const range = _.range(min, max, 0.1);
  const seconds = _.sample(range)!;
  return delay(seconds * 1000);
};

(async () => {
  const appVersion = await HeroAPI.getAppVersion();

  if (!appVersion) {
    console.error('Cannot connect to server');
    process.exit(0);
  }

  await Promise.all(userKeys.map(async (userKey, userIndex) => {
    // Select a supporter randomly.
    const supportIndex = _.sample(_.range(supportPlayerIds.length))!;
    const supportPlayerId = supportPlayerIds[supportIndex];
    const supportCardId = supportCardIds[supportIndex];

    const client = new HeroAPI(appVersion, userKey);

    // Delay 0 ~ 5 mins.
    // Make instances be triggered in different time.
    await delayRange(0, 5 * 60);

    await client.login();
    console.log(`[User: ${userIndex}] Login`);
    await delayRange(5, 10);

    await client.questStart(questId);
    console.log(`[User: ${userIndex}] Quest start`);
    await delayRange(5, 10);

    await client.questProgressInit(questId, supportPlayerId, supportCardId);
    console.log(`[User: ${userIndex}] Progress init (support: ${supportIndex})`);
    await delayRange(10, 20);

    await client.questProgressFinish(questId);
    console.log(`[User: ${userIndex}] Progress finish`);
    await delayRange(1, 2);

    await client.questEnd(questId);
    console.log(`[User: ${userIndex}] Quest end`);
  }));
})();
