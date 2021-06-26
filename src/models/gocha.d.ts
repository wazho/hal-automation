interface IGocha {
  gachaId: number;
  gachaType: number;
  gachaName: string;
  gachaBanner: string;
  sortWeight: number;
  isShowProbs: boolean;
  characterDetailUrl: string;
  startAt: string | null;
  endAt: string | null;
  prices: {
    gachaPriceId: number;
    gachaPriceType: number;
    currencyObjectType: number;
    objectId: number;
    objectValue: number;
    onCurrencyLack: string | null;
    drawCount: number;
  };
}

interface IGochaItem {
  type: number;
  id: number;
  value: number;
  duplicate: object | null;
  timelines: string[];
}

export interface IGetGochaListResponse {
  result: boolean;
  message: string;
  list: IGocha[];
  users: any;
}

export interface IExecuteGochaResponse {
  result: boolean;
  message: string;
  gacha: IGochaItem[];
  gachaId: number;
  continuePrice: any;
  list: any;
  users: {
    cards: {
      [cardId: string]: {
        heroCardId: number;
        level: number;
        totalExp: number;
        visualType: number;
        isActive: boolean;
        getAt: string;
        equipmentSkills: number[];
        fanValue: number;
        parallelWeapon: {
          parallelWeaponFormId: number;
          level: number;
          totalExp: number;
        };
      };
    };
    sidekicks: {
      [cardId: string]: {
        sidekickCardId: number;
        getAt: string;
        isActive: boolean;
      };
    };
    items: {
      [cardId: string]: {
        itemId: number;
        value: number;
      };
    };
  };
}
