
// Money direction
export enum MoneyDirection {
  In,
  Out
}

// Money tag
export interface MoneyTag {
  id: string;
  path: string[];
  title: string;
  color: string;
  code: string;
  description: string;
  when: Date;
  who: string;
}

// Default data / initial state
export const defaultMoneyTag = {
  ids: <string[]>[],
  entities: {}
};


// Money item
export interface MoneyItem {
  id: string;
  title: string;
  direction: MoneyDirection;
  amount: number;
  when: Date;
  where: Coordinates;
  who: string;
  tags: MoneyTag[];
}

export function getMoneyItemTagsConcat(moneyItem: MoneyItem): string {
  if (moneyItem && moneyItem.tags && moneyItem.tags.length > 0) {
    return moneyItem.tags.map((t: MoneyTag): string => t.code).join('; ');
  }
  return '';
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
  whosConcat: () => string;
  tags: MoneyTag[];
  tagsConcat: () => string;
}

export function buildMoneyStat(direction: MoneyDirection, items: MoneyItem[]): MoneyStat {
  const r: MoneyStat = <MoneyStat>{
    direction: direction,
    itemCount: 0,
    totalAmount: 0,
    from: new Date(3000, 1, 1),
    to: new Date(1000, 1, 1),
    whos: [],
    whosConcat: function(): string {
      if (this.whos && this.whos.length > 0) {
        return this.whos.join('; ');
      }
      return '';
    },
    tags: [],
    tagsConcat: function(): string {
      if (this.tags && this.tags.length > 0) {
        return this.tags.map((t: MoneyTag): string => t.code).join('; ');
      }
      return '';
    }
  };
  // ++
  if (items && items.length > 0) {
    items.forEach((i: MoneyItem) => {
      if (i.direction === direction) {
        r.itemCount++; // items in this stat
        r.totalAmount += i.amount; // amount from items
        if (r.whos.indexOf(i.who) < 0) { r.whos.push(i.who); } // who(s) made this
        if (i.tags && i.tags.length > 0) {
          i.tags.forEach((t: MoneyTag) => {
            if (r.tags.indexOf(t) < 0) { r.tags.push(t); } // money tags associated
          });
        }
        if (r.from > i.when) { r.from = i.when; } // when it all started
        if (r.to < i.when) { r.to = i.when; } // when it all ended
      }
    });
  }
  // ++
  return r;
}
