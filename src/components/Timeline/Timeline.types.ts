import type { ReactNode } from 'react';

export interface TimelineProps<ItemType> {
  items: ItemType[];
  getItemId: (item: ItemType) => string;
  getItemDate: (item: ItemType) => string;
  renderItem: (item: ItemType) => ReactNode;
}

export interface TimelineGroup<ItemType> {
  dayKey: string;
  label: string;
  items: ItemType[];
}