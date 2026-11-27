import { useState } from 'react';
import { IfxPagination } from '@infineon/design-system-react';
import styles from './DataGrid.module.scss';
import type { DataGridProps } from './DataGrid.types';

const DEFAULT_PAGE_SIZE = 25;

const ITEMS_PER_PAGE_OPTIONS = JSON.stringify([
  { value: '10', selected: false },
  { value: '25', selected: true },
  { value: '50', selected: false },
]);

export const DataGrid = <RowType,>({ columns, rows, getRowId }: DataGridProps<RowType>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleRows = rows.slice(startIndex, endIndex);

  const handlePageChange = (event: CustomEvent) => {
    setCurrentPage(event.detail.currentPage);
  };

  const handleItemsPerPageChange = (event: CustomEvent) => {
    setPageSize(Number(event.detail));
    setCurrentPage(1);
  };

  return (
    <div>
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
          {visibleRows.map((row) => (
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

      <div className={styles.pagination}>
        <IfxPagination
          total={rows.length}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE_OPTIONS}
          onIfxPageChange={handlePageChange}
          onIfxItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};