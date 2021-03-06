export interface Card {
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
}

export interface Message {
  id: number;
  subject: string;
  body: string;
  receiveLimitAt: string | null;
  receivedAt: string | null;
  reward: {
    rewardType: number;
    objectId: number;
    objectValue: number;
    bonus: number;
    fixAddValue: number;
  }
}

export interface LoginUsers {
  profile: {
    playerId: number;
    playerName: string;
    genderId: number;
    bodyTypeId: number;
    voiceTypeId: number;
    activeTeamId: number;
    activeSupportTeamId: number;
    userRank: number;
    userTotalExp: number;
    loginBonusCount: number;
    totalLoginDays: number;
    tutorialFlag: number;
    isParallelWeaponReleased: boolean;
  }
  cards: {
    [cardId: string]: Card;
  }
  messages: {
    [messageId: string]: Message;
  }
  [key: string]: any;
}
