import type { DataGridColumn, SortDirection } from './DataGrid.types';

const collator = new Intl.Collator(undefined, { numeric: true });

export const sortRows = <RowType>(rows: RowType[], column: DataGridColumn<RowType>, direction: SortDirection,): RowType[] => {
  const directionMultiplier = direction === 'ascending' ? 1 : -1;
  const sortedRows = [...rows];

  sortedRows.sort((firstRow, secondRow) => {
    const firstValue = firstRow[column.accessor];
    const secondValue = secondRow[column.accessor];

    if (typeof firstValue === 'number' && typeof secondValue === 'number') {
      return (firstValue - secondValue) * directionMultiplier;
    }

    const comparison = collator.compare(String(firstValue), String(secondValue));
    return comparison * directionMultiplier;
  });

  return sortedRows;
};