import styles from './DataGrid.module.scss';
import type { DataGridProps } from './DataGrid.types';

export const DataGrid = <RowType,>({ columns, rows, getRowId }: DataGridProps<RowType>) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.accessor)} className={styles.headerCell} scope="col">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={getRowId(row)} className={styles.bodyRow}>
            {columns.map((column) => (
              <td key={String(column.accessor)} className={styles.bodyCell}>
                {String(row[column.accessor])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};