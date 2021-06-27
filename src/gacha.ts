// Node modules.
import fs from 'fs';
import _ from 'lodash';
import delay from 'delay';
// Local modules.
import HeroAPI from './heroAPI';
import { getCardDetails } from './libs/card-master';

const firstGacha = async (client: HeroAPI, gachaId: number) => {
  const { key: userKey } = await client.createUser('hello');
  const loginUsers = await client.login(userKey);
  const messageIds = Object.values(loginUsers.messages).map((m) => m.id);

  await client.receiveAllMessages(messageIds);

  await client.setUserTutotialFlag(1);

  await client.setUserTutotialFlag(9);

  const first = await client.executeGacha(1, 1);
  const second = await client.executeGacha(gachaId, 2);

  return {
    userKey,
    gachaItems: [...first.gacha, ...second.gacha],
  };
};

(async () => {
  const appVersion = await HeroAPI.getAppVersion();

  if (!appVersion) {
    console.error('Cannot connect to server');
    process.exit(0);
  }

  const client = new HeroAPI(appVersion);

  const cardDetails = await getCardDetails();

  for (let i = 0 ; i < 1000 ; i ++) {
    const { userKey, gachaItems } = await firstGacha(client, 12);

    const list = _.chain(gachaItems)
      .countBy(({ type, id }) => {
        if (type === 1) {
          const card = cardDetails.find((d) => d.heroCardId === id);
          // return `${card?.rarity}☆_${card?.cardName}_${card?.resourceName}`;
          return `${card?.rarity}*_${card?.resourceName}`;
        } else {
          return '0_sidekick';
        }
      })
      .toPairs()
      .sortBy(([name, _value]) => name)
      .reverse()
      .value();

    const summary = _.sumBy(list, ([name, count]) => name.includes('5*') ? count : 0);

    if (summary) {
      const text = `${userKey}\t${summary}\t${JSON.stringify(list)}\n`;
      fs.appendFileSync('gacha.tsv', text);
    }

    console.log({
      userKey,
      summary,
      list,
    }, `Current: ${i + 1}`);
  }
})();
