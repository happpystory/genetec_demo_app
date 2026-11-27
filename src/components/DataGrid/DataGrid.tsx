import { useEffect, useMemo, useState } from "react";
import {
  IfxButton,
  IfxPagination,
  IfxSpinner,
  IfxTextField,
} from "@infineon/design-system-react";
import styles from "./DataGrid.module.scss";
import type { DataGridProps, FilterValues, SortState } from "./DataGrid.types";
import { filterRows, getCellText, sortRows } from "./DataGrid.utils";

const DEFAULT_PAGE_SIZE = 25;
const FILTER_DELAY_IN_MILLISECONDS = 300;

const ITEMS_PER_PAGE_OPTIONS = JSON.stringify([
  { value: "10", selected: false },
  { value: "25", selected: true },
  { value: "50", selected: false },
]);

export const DataGrid = <RowType,>({
  columns,
  rows,
  getRowId,
  status,
  onRetry,
}: DataGridProps<RowType>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortState, setSortState] = useState<SortState<RowType> | null>(null);
  const [filterInputValues, setFilterInputValues] = useState<FilterValues>({});
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilterValues(filterInputValues);
      setCurrentPage(1);
    }, FILTER_DELAY_IN_MILLISECONDS);

    return () => clearTimeout(timeoutId);
  }, [filterInputValues]);

  const filteredRows = useMemo(() => {
    return filterRows(rows, columns, filterValues);
  }, [rows, columns, filterValues]);

  const sortedRows = useMemo(() => {
    if (sortState === null) {
      return filteredRows;
    }

    const sortedColumn = columns.find(
      (column) => column.accessor === sortState.accessor,
    );
    if (sortedColumn === undefined) {
      return filteredRows;
    }

    return sortRows(filteredRows, sortedColumn, sortState.direction);
  }, [filteredRows, columns, sortState]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleRows = sortedRows.slice(startIndex, endIndex);

  const getSortDirection = (accessor: keyof RowType) => {
    if (sortState !== null && sortState.accessor === accessor) {
      return sortState.direction;
    }
    return "none";
  };

  const handleHeaderClick = (accessor: keyof RowType) => {
    if (sortState === null || sortState.accessor !== accessor) {
      setSortState({ accessor, direction: "ascending" });
    } else if (sortState.direction === "ascending") {
      setSortState({ accessor, direction: "descending" });
    } else {
      setSortState(null);
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (accessor: keyof RowType, value: string) => {
    setFilterInputValues({ ...filterInputValues, [String(accessor)]: value });
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
                    {sortDirection === "ascending" && " ▲"}
                    {sortDirection === "descending" && " ▼"}
                  </button>
                </th>
              );
            })}
          </tr>
          <tr>
            {columns.map((column) => (
              <th key={String(column.accessor)} className={styles.filterCell}>
                <IfxTextField
                  size="s"
                  showDeleteIcon={true}
                  ariaLabel={`Filter ${column.label}`}
                  value={filterInputValues[String(column.accessor)] ?? ""}
                  onIfxInput={(event: CustomEvent) =>
                    handleFilterChange(column.accessor, event.detail)
                  }
                />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
        {status === 'loading' && (
          <tr>
            <td colSpan={columns.length} className={styles.stateCell}>
              <IfxSpinner size="m" />
              <p className={styles.stateText}>Loading...</p>
            </td>
          </tr>
        )}

          {status === "error" && (
            <tr>
              <td colSpan={columns.length} className={styles.stateCell}>
                <p className={styles.stateText}>Could not load the data.</p>
                <IfxButton type="button" onClick={onRetry}>
                  Retry
                </IfxButton>
              </td>
            </tr>
          )}

          {status === "ready" && filteredRows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className={styles.stateCell}>
                <p className={styles.stateText}>No results found.</p>
              </td>
            </tr>
          )}

          {status === "ready" &&
            visibleRows.map((row) => (
              <tr key={getRowId(row)} className={styles.bodyRow}>
                {columns.map((column) => (
                  <td key={String(column.accessor)} className={styles.bodyCell}>
                    {getCellText(row, column)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {status === 'ready' && (
        <div className={styles.pagination}>
          <IfxPagination
            total={filteredRows.length}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE_OPTIONS}
            onIfxPageChange={handlePageChange}
            onIfxItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};
