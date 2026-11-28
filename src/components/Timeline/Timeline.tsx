import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import styles from './Timeline.module.scss';
import type { TimelineProps } from './Timeline.types';
import { flattenGroups, groupItemsByDay } from './Timeline.utils';

const HEADER_ROW_HEIGHT = 40;
const ITEM_ROW_HEIGHT = 40;
const OVERSCAN_ROW_COUNT = 10;

export const Timeline = <ItemType,>({ items, getItemDate, renderItem }: TimelineProps<ItemType>) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    const groups = groupItemsByDay(items, getItemDate);
    return flattenGroups(groups);
  }, [items, getItemDate]);

  const getRowHeight = (rowIndex: number) => {
    return rows[rowIndex].type === 'header' ? HEADER_ROW_HEIGHT : ITEM_ROW_HEIGHT;
  };

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: getRowHeight,
    overscan: OVERSCAN_ROW_COUNT,
  });

  return (
    <div ref={scrollElementRef} className={styles.timeline}>
      <div className={styles.rowsContainer} style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          const rowClassName = row.type === 'header' ? styles.groupTitle : styles.item;

          return (
            <div
              key={virtualRow.key}
              className={`${styles.row} ${rowClassName}`}
              style={{ height: virtualRow.size, transform: `translateY(${virtualRow.start}px)` }}
            >
              {row.type === 'header' ? row.label : renderItem(row.item)}
            </div>
          );
        })}
      </div>
    </div>
  );
};