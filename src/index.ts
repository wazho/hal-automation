// Node modules.
import _ from 'lodash';
import delay from 'delay';
// Local modules.
import HeroAPI from './heroAPI';

// Secret parmeters.
const userKeys = String(process.env.USER_KEYS).split(',');
const questId = Number(process.env.QUEST_ID);
const skipFirstDelay = !!process.env.SKIP_FIRST_DELAY;

const delayRange = (min: number, max: number, user: any) => {
  const range = _.range(min, max, 0.1);
  const seconds = parseInt(String(_.sample(range)));
  console.log(`[User: ${user}] wait ${seconds} seconds`);
  return delay(seconds * 1000);
};

(async () => {
  const appVersion = await HeroAPI.getAppVersion();

  if (!appVersion) {
    console.error('Cannot connect to server');
    process.exit(0);
  }

  await Promise.all(userKeys.map(async (userKey, userIndex) => {
    const client = new HeroAPI(appVersion, userKey);

    // Delay 0 ~ 5 mins.
    // Make instances be triggered in different time.
    if (!skipFirstDelay) {
      await delayRange(0, 5 * 60, userIndex);
    }

    await client.login();
    console.log(`[User: ${userIndex}] Login`);
    await delayRange(5, 10, userIndex);

    const { userList: { friendList } } = await client.getFriends();
    const supporter = _.sample(friendList)!;

    // 10% rate to receive mails.
    if (_.sample(_.range(10))! === 0) {
      await client.receiveMails();
      await delayRange(5, 10, userIndex);
    }

    await client.questStart(questId);
    console.log(`[User: ${userIndex}] Quest start`);
    await delayRange(5, 10, userIndex);

    await client.questProgressInit(questId, supporter.playerId, supporter.supportHeroCard.heroCardId);
    console.log(`[User: ${userIndex}] Progress init (supporter: ${supporter.playerName})`);
    await delayRange(10, 20, userIndex);

    await client.questProgressFinish(questId);
    console.log(`[User: ${userIndex}] Progress finish`);
    await delayRange(1, 2, userIndex);

    try {
      await client.questEnd(questId);
      console.log(`[User: ${userIndex}] Quest end`);
    } catch {
      console.log(`[User: ${userIndex}] Stamina is not enough`);
    }
  }));
})();
