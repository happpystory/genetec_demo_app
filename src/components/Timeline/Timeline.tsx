import { useMemo } from 'react';
import styles from './Timeline.module.scss';
import type { TimelineProps } from './Timeline.types';
import { groupItemsByDay } from './Timeline.utils';

export const Timeline = <ItemType,>({
  items,
  getItemId,
  getItemDate,
  renderItem,
}: TimelineProps<ItemType>) => {
  const groups = useMemo(() => {
    return groupItemsByDay(items, getItemDate);
  }, [items, getItemDate]);

  return (
    <div className={styles.timeline}>
      {groups.map((group) => (
        <section key={group.dayKey} className={styles.group}>
          <h3 className={styles.groupTitle}>{group.label}</h3>

          <ul className={styles.itemList}>
            {group.items.map((item) => (
              <li key={getItemId(item)} className={styles.item}>
                {renderItem(item)}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};