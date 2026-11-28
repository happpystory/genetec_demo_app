import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import styles from './Timeline.module.scss';
import type { TimelineProps } from './Timeline.types';
import {
  findNextHeaderIndex,
  findPreviousHeaderIndex,
  flattenGroups,
  groupItemsByDay,
} from './Timeline.utils';

const HEADER_ROW_HEIGHT = 40;
const ITEM_ROW_HEIGHT = 40;
const OVERSCAN_ROW_COUNT = 10;

export const Timeline = <ItemType,>({ items, getItemDate, renderItem }: TimelineProps<ItemType>) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [activeRowIndex, setActiveRowIndex] = useState(0);

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

  const moveToRow = (rowIndex: number) => {
    setActiveRowIndex(rowIndex);
    virtualizer.scrollToIndex(rowIndex);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const lastRowIndex = rows.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveToRow(Math.min(activeRowIndex + 1, lastRowIndex));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveToRow(Math.max(activeRowIndex - 1, 0));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveToRow(findNextHeaderIndex(rows, activeRowIndex));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveToRow(findPreviousHeaderIndex(rows, activeRowIndex));
    }
  };

  return (
    <div
      ref={scrollElementRef}
      className={styles.timeline}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.rowsContainer} style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          const rowClassName = row.type === 'header' ? styles.groupTitle : styles.item;
          const activeClassName = virtualRow.index === activeRowIndex ? styles.activeRow : '';

          return (
            <div
              key={virtualRow.key}
              className={`${styles.row} ${rowClassName} ${activeClassName}`}
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