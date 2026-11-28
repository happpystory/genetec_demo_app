import type { TimelineGroup, TimelineRow } from './Timeline.types';

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const dayLabelFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const groupItemsByDay = <ItemType>(
  items: ItemType[],
  getItemDate: (item: ItemType) => string,
): TimelineGroup<ItemType>[] => {
  const sortedItems = [...items];

  sortedItems.sort((firstItem, secondItem) => {
    const firstDate = getItemDate(firstItem);
    const secondDate = getItemDate(secondItem);

    if (firstDate < secondDate) {
      return -1;
    }
    if (firstDate > secondDate) {
      return 1;
    }
    return 0;
  });

  const groups: TimelineGroup<ItemType>[] = [];
  let currentGroup: TimelineGroup<ItemType> | null = null;

  for (const item of sortedItems) {
    const date = new Date(getItemDate(item));
    const dayKey = dayKeyFormatter.format(date);

    if (currentGroup === null || currentGroup.dayKey !== dayKey) {
      currentGroup = { dayKey, label: dayLabelFormatter.format(date), items: [] };
      groups.push(currentGroup);
    }

    currentGroup.items.push(item);
  }

  return groups;
};

export const flattenGroups = <ItemType>(groups: TimelineGroup<ItemType>[]): TimelineRow<ItemType>[] => {
  const rows: TimelineRow<ItemType>[] = [];

  for (const group of groups) {
    rows.push({ type: 'header', label: group.label });

    for (const item of group.items) {
      rows.push({ type: 'item', item });
    }
  }

  return rows;
};