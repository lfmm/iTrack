
// Money direction
export enum MoneyDirection {
  In,
  Out
}

// Money item
export interface MoneyItem {
  id: string;
  title: string;
  direction: MoneyDirection;
  amount: number;
  when: Date;
  where: Geolocation;
  who: string;
}

// Default data / initial state
export const defaultMoneyItem = {
  ids: <string[]>[],
  entities: {}
};
