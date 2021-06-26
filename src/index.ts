// Node modules.
import _ from 'lodash';
import delay from 'delay';
// Local modules.
import HeroAPI from './heroAPI';

// Secret parmeters.
const userKeys = String(process.env.USER_KEYS).split(',');
const questId = Number(process.env.QUEST_ID);
const salesId = Number(process.env.SALES_ID);
const skipFirstDelay = !!process.env.SKIP_FIRST_DELAY;

const delayRange = (min: number, max: number, user: any) => {
  const range = _.range(min, max, 0.1);
  const seconds = parseInt(String(_.sample(range)));
  console.log(`[User: ${user}] wait ${seconds} seconds`);
  return delay(seconds * 1000);
};

const probability = (percent: number): boolean => {
  const all = _.range(100);
  const randomPick = _.sample(all)!;
  const pass = randomPick < percent;
  return pass;
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

    const { cards } = await client.login();
    console.log(`[User: ${userIndex}] Login`);
    await delayRange(5, 10, userIndex);

    const { userList: { friendList } } = await client.getFriends();
    const supporter = _.sample(friendList)!;

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
      const result = await client.questEnd(questId);
      console.log(`[User: ${userIndex}] Quest end`, JSON.stringify(result));
    } catch {
      console.log(`[User: ${userIndex}] Stamina is not enough`);
    }
    
    // 50% rate to do sales.
    if (probability(50)) {
      const salesEndRes = await client.salesEnd(1);
      console.log(`[User: ${userIndex}] End sales`, JSON.stringify(salesEndRes));
      await delayRange(5, 10, userIndex);

      const [member] = _.shuffle(Object.values(cards));
      const salesStartRes = await client.salesStart(salesId, [member.heroCardId]);
      console.log(`[User: ${userIndex}] Start sales`, JSON.stringify(salesStartRes));
      await delayRange(5, 10, userIndex);
    }

    // 20% rate to receive mission rewards.
    if (probability(20)) {
      await client.receiveMissionRewards();
      console.log(`[User: ${userIndex}] Receive mission rewards`);
      await delayRange(5, 10, userIndex);
    }
  }));
})();
