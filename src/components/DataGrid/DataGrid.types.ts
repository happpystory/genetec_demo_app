export interface DataGridColumn<RowType> {
  label: string;
  accessor: keyof RowType;
}

export interface DataGridProps<RowType> {
  columns: DataGridColumn<RowType>[];
  rows: RowType[];
  getRowId: (row: RowType) => string;
}