// Node modules.
import fs from 'fs';
import _ from 'lodash';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
// Local modules.
import { IGochaItem } from './models/gocha';
import HeroAPI from './heroAPI';
import { getCardDetails } from './libs/card-master';

const createUser = async (client: HeroAPI) => {
  const name = uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: '', length: 2 }).slice(0, 8);
  const { key: userKey } = await client.createUser(name);
  const loginUsers = await client.login(userKey);
  const messageIds = Object.values(loginUsers.messages).map((m) => m.id);

  await client.receiveAllMessages(messageIds);
  await client.receiveMissionRewards();

  return { userKey };
};

const firstGacha = async (client: HeroAPI, gachaId: number, times = 1) => {
  const gachaItems: IGochaItem[] = [];

  // Novice gacha.
  await client.setUserTutotialFlag(1);
  await client.setUserTutotialFlag(9);
  gachaItems.push(...(await client.executeGacha(1, 1)).gacha);

  // TODO:
  // const gochaList = await client.getGachaList();
  // console.log(gochaList);

  // Normal gacha.
  for (let i = 0; i < times; i++) {
    gachaItems.push(...(await client.executeGacha(gachaId, 2)).gacha);
  }

  return { gachaItems };
};

(async () => {
  const appVersion = await HeroAPI.getAppVersion();

  if (!appVersion) {
    console.error('Cannot connect to server');
    process.exit(0);
  }

  const cardDetails = await getCardDetails();

  const client = new HeroAPI(appVersion);

  const gochaId = 20;
  const gochaTimes = 2;

  for (let i = 0; i < 10000; i++) {
    try {
      const { userKey } = await createUser(client);
      const { gachaItems } = await firstGacha(client, gochaId, gochaTimes);

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

      // Only over 3 five-stars heroes.
      if (summary >= 3) {
        const text = `${userKey}\t${summary}\t${JSON.stringify(list)}\n`;
        fs.appendFileSync('gacha.tsv', text);
      }

      console.log({
        userKey,
        summary,
        list,
      }, `Current: ${i + 1}`);
    } catch (e) {
      console.error(e, `Current: ${i + 1}`);
    }
  }
})();
