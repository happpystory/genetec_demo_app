import type { TimelineGroup, TimelineRow } from './Timeline.types';

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
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

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

export const findNextHeaderIndex = <ItemType>(
  rows: TimelineRow<ItemType>[],
  activeRowIndex: number,
): number => {
  for (let rowIndex = activeRowIndex + 1; rowIndex < rows.length; rowIndex++) {
    if (rows[rowIndex].type === 'header') {
      return rowIndex;
    }
  }

  return activeRowIndex;
};

export const findPreviousHeaderIndex = <ItemType>(
  rows: TimelineRow<ItemType>[],
  activeRowIndex: number,
): number => {
  for (let rowIndex = activeRowIndex - 1; rowIndex >= 0; rowIndex--) {
    if (rows[rowIndex].type === 'header') {
      return rowIndex;
    }
  }

  return activeRowIndex;
};