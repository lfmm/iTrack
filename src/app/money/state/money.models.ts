
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

// Money stats for selector use
export interface MoneyStat {
  direction: MoneyDirection;
  itemCount: number;
  totalAmount: number;
  from: Date;
  to: Date;
  whos: string[];
}

export function buildMoneyStat(direction: MoneyDirection, items: MoneyItem[]): MoneyStat {
  const r: MoneyStat = <MoneyStat>{
    direction: direction,
    itemCount: 0,
    totalAmount: 0,
    from: new Date(3000, 1, 1),
    to: new Date(1000, 1, 1),
    whos: []
  };
  // ++
  if (items && items.length > 0) {
    items.forEach((i: MoneyItem) => {
      if (i.direction === direction) {
        r.itemCount++; // items in this stat
        r.totalAmount += i.amount; // amount from items
        if (r.whos.indexOf(i.who) < 0) { r.whos.push(i.who); } // who(s) made this
        if (r.from > i.when) { r.from = i.when; } // when it all started
        if (r.to < i.when) { r.to = i.when; } // when it all ended
      }
    });
  }
  // ++
  return r;
}
