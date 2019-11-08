import { State, Range, GridColumn, GridRow } from '../Model';
export declare function selectRange(state: State, range: Range, incremental: boolean): State;
export declare function updateActiveSelectedRange(state: State, range: Range): State;
export declare function selectOneColumn(state: State, col: GridColumn, incremental: boolean): State;
export declare function unSelectOneColumn(state: State, col: GridColumn): State;
export declare function selectMultipleColumns(state: State, firstCol: GridColumn, lastCol: GridColumn, incremental?: boolean): State;
export declare function selectOneRow(state: State, row: GridRow, incremental: boolean): State;
export declare function unSelectOneRow(state: State, row: GridRow): State;
export declare function selectMultipleRows(state: State, firstRow: GridRow, lastRow: GridRow, incremental?: boolean): State;
