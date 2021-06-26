interface IReward {
  rewardType: number;
  objectId: number;
  objectValue: number;
  bonus: number;
  fixAddValue: number;
}

export interface IReceiveAllMessagesResponse {
  result: boolean;
  message: string;
  rewards: IReward[];
  users: any;
}
