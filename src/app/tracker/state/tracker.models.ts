
// Track item tag
export interface TrackItemTag {
  id: string;
  tag: string;
}

// Track item
export interface TrackItem {
  id: string;
  title: string;
  body: string;
  when: Date;
  who: string;
  tags: Array<TrackItemTag>;
}

// Default data / initial state
export const defaultTrackItem = {
  ids: <string[]>[],
  entities: {}
};
