// Node modules.
import _ from 'lodash';
import fetch from 'node-fetch';

interface ICardDetail {
  heroCardId: number;
  cardName: string;
  rarity: number;
  resourceName: string;
}

export const getCardDetails = async () => {
  const url = 'https://raw.githubusercontent.com/liveahero-community/translations/main/master-data/latest/zh-TW/CardMaster.json';
  const res = await fetch(url);
  const raw = await res.json();

  const fields =  ['heroCardId', 'cardName', 'rarity', 'resourceName'];
  const cardDetails = Object.values(raw).map((o) => _.pick(o, fields)) as ICardDetail[];

  return cardDetails;
};
