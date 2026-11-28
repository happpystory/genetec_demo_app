import type { ReactNode } from 'react';

export interface TimelineProps<ItemType> {
  items: ItemType[];
  getItemDate: (item: ItemType) => string;
  renderItem: (item: ItemType) => ReactNode;
}

export interface TimelineGroup<ItemType> {
  dayKey: string;
  label: string;
  items: ItemType[];
}

export interface TimelineHeaderRow {
  type: 'header';
  label: string;
}

export interface TimelineItemRow<ItemType> {
  type: 'item';
  item: ItemType;
}

export type TimelineRow<ItemType> = TimelineHeaderRow | TimelineItemRow<ItemType>;