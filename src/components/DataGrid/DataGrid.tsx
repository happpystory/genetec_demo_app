import { useMemo, useState } from 'react';
import { IfxPagination } from '@infineon/design-system-react';
import styles from './DataGrid.module.scss';
import type { DataGridProps, SortState } from './DataGrid.types';
import { sortRows } from './DataGrid.utils';

const DEFAULT_PAGE_SIZE = 25;

const ITEMS_PER_PAGE_OPTIONS = JSON.stringify([
  { value: '10', selected: false },
  { value: '25', selected: true },
  { value: '50', selected: false },
]);

export const DataGrid = <RowType,>({ columns, rows, getRowId }: DataGridProps<RowType>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortState, setSortState] = useState<SortState<RowType> | null>(null);

  const sortedRows = useMemo(() => {
    if (sortState === null) {
      return rows;
    }

    const sortedColumn = columns.find((column) => column.accessor === sortState.accessor);
    if (sortedColumn === undefined) {
      return rows;
    }

    return sortRows(rows, sortedColumn, sortState.direction);
  }, [rows, columns, sortState]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleRows = sortedRows.slice(startIndex, endIndex);

  const getSortDirection = (accessor: keyof RowType) => {
    if (sortState !== null && sortState.accessor === accessor) {
      return sortState.direction;
    }
    return 'none';
  };

  const handleHeaderClick = (accessor: keyof RowType) => {
    if (sortState === null || sortState.accessor !== accessor) {
      setSortState({ accessor, direction: 'ascending' });
    } else if (sortState.direction === 'ascending') {
      setSortState({ accessor, direction: 'descending' });
    } else {
      setSortState(null);
    }
    setCurrentPage(1);
  };

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
            {columns.map((column) => {
              const sortDirection = getSortDirection(column.accessor);

              return (
                <th
                  key={String(column.accessor)}
                  className={styles.headerCell}
                  scope="col"
                  aria-sort={sortDirection}
                >
                  <button
                    type="button"
                    className={styles.headerButton}
                    onClick={() => handleHeaderClick(column.accessor)}
                  >
                    {column.label}
                    {sortDirection === 'ascending' && ' ▲'}
                    {sortDirection === 'descending' && ' ▼'}
                  </button>
                </th>
              );
            })}
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