import type {
  DataGridColumn,
  FilterValues,
  SortDirection,
} from "./DataGrid.types";

const collator = new Intl.Collator(undefined, { numeric: true });

export const sortRows = <RowType>(
  rows: RowType[],
  column: DataGridColumn<RowType>,
  direction: SortDirection,
): RowType[] => {
  const directionMultiplier = direction === "ascending" ? 1 : -1;
  const sortedRows = [...rows];

  sortedRows.sort((firstRow, secondRow) => {
    const firstValue = firstRow[column.accessor];
    const secondValue = secondRow[column.accessor];

    if (typeof firstValue === "number" && typeof secondValue === "number") {
      return (firstValue - secondValue) * directionMultiplier;
    }

    const comparison = collator.compare(
      String(firstValue),
      String(secondValue),
    );
    return comparison * directionMultiplier;
  });

  return sortedRows;
};

export const getCellText = <RowType>(
  row: RowType,
  column: DataGridColumn<RowType>,
): string => {
  if (column.renderCell !== undefined) {
    return column.renderCell(row);
  }

  return String(row[column.accessor]);
};

export const filterRows = <RowType>(
  rows: RowType[],
  columns: DataGridColumn<RowType>[],
  filterValues: FilterValues,
): RowType[] => {
  const activeColumns = columns.filter((column) => {
    const filterText = filterValues[String(column.accessor)];
    return filterText !== undefined && filterText.trim() !== "";
  });

  if (activeColumns.length === 0) {
    return rows;
  }

  return rows.filter((row) =>
    activeColumns.every((column) => {
      const filterText = filterValues[String(column.accessor)]
        .trim()
        .toLowerCase();
      const cellText = getCellText(row, column).toLowerCase();
      return cellText.includes(filterText);
    }),
  );
};
