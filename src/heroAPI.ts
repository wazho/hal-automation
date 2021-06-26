// Node modules.
import fetch from 'node-fetch';

class HeroAPI {
  private static host = 'https://gateway.live-a-hero.jp';
  private basedHeaders: any;

  constructor(appVersion: string, userKey: string) {
    this.basedHeaders = {
      'Host': 'gateway.live-a-hero.jp',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate',
      'User-Agent': `LiveAHeroAPI/${appVersion} Android OS 7.1.2 / API-25 (N2G48H/rel.se.infra.20200730.150525) google G011A`,
      'user-identifier': userKey,
      'X-Unity-Version': '2019.4.10f1',
      'Connection': 'close',
    };
  }

  public static async getAppVersion() {
    const res = await fetch(`${HeroAPI.host}/api/status/version`, {
      method: 'GET',
      headers: { 'User-Agent': 'LiveAHeroAPI' },
    });

    if (res.ok) {
      const data = await res.json();
      console.log('app version', data);
      return data.client as string;
    } else {
      return undefined;
    }
  }

  public async login() {
    const res = await fetch(`${HeroAPI.host}/api/user/login`, {
      method: 'GET',
      headers: this.basedHeaders,
    });
    const data = await res.json();
    return data;
  }

  public async getFriends() {
    const res = await fetch(`${HeroAPI.host}/api/friend/get`, {
      method: 'GET',
      headers: this.basedHeaders,
    });
    const data = await res.json();
    return data;
  }

  public async questStart(questId: number) {
    const res = await fetch(`${HeroAPI.host}/api/quest/start`, {
      method: 'POST',
      headers: {
        ...this.basedHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questId }),
    });
    const data = await res.json();
    return data;
  }

  public async questProgressInit(questId: number, supportPlayerId: number, supportCardId: number) {
    const res = await fetch(`${HeroAPI.host}/api/quest/event/progress`, {
      method: 'POST',
      headers: {
        ...this.basedHeaders,
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
    const data = await res.json();
    return data;
  }

  public async questProgressFinish(questId: number) {
    const res = await fetch(`${HeroAPI.host}/api/quest/event/progress`, {
      method: 'POST',
      headers: {
        ...this.basedHeaders,
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
    const data = await res.json();
    return data;
  }

  public async questEnd(questId: number) {
    const res = await fetch(`${HeroAPI.host}/api/quest/end`, {
      method: 'POST',
      headers: {
        ...this.basedHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questId }),
    });
    const data = await res.json();
    return data;
  }

  public async salesStart(salesId: number, members: number[]) {
    const res = await fetch(`${HeroAPI.host}/api/sales/start`, {
      method: 'POST',
      headers: {
        ...this.basedHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        salesId,
        slotId: 1,
        member: members,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return null;
  }

  public async salesEnd(slotId: number) {
    const res = await fetch(`${HeroAPI.host}/api/sales/end`, {
      method: 'POST',
      headers: {
        ...this.basedHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slotId }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return null;
  }

  public async receiveMissionRewards() {
    const res = await fetch(`${HeroAPI.host}/api/mission/end/all`, {
      method: 'POST',
      headers: {
        ...this.basedHeaders,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  }
}

export default HeroAPI;
