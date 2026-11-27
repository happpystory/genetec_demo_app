export interface DataGridColumn<RowType> {
  label: string;
  accessor: keyof RowType;
}

export interface DataGridProps<RowType> {
  columns: DataGridColumn<RowType>[];
  rows: RowType[];
  getRowId: (row: RowType) => string;
}

export type SortDirection = 'ascending' | 'descending';

export interface SortState<RowType> {
  accessor: keyof RowType;
  direction: SortDirection;
}

export interface DataGridColumn<RowType> {
  label: string;
  accessor: keyof RowType;
  renderCell?: (row: RowType) => string;
}

export interface FilterValues {
  [accessor: string]: string;
}

export type DataGridStatus = 'loading' | 'ready' | 'error';

export interface DataGridProps<RowType> {
  columns: DataGridColumn<RowType>[];
  rows: RowType[];
  getRowId: (row: RowType) => string;
  status: DataGridStatus;
  onRetry: () => void;
}