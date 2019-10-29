import { State, Range, Column, Row } from "../Common";
export declare function selectRange(state: State, range: Range, incremental: boolean): State;
export declare function updateActiveSelectedRange(state: State, range: Range): State;
export declare function selectOneColumn(state: State, col: Column, incremental: boolean): State;
export declare function unSelectOneColumn(state: State, col: Column): State;
export declare function selectMultipleColumns(state: State, firstCol: Column, lastCol: Column, incremental?: boolean): State;
export declare function selectOneRow(state: State, row: Row, incremental: boolean): State;
export declare function unSelectOneRow(state: State, row: Row): State;
export declare function selectMultipleRows(state: State, firstRow: Row, lastRow: Row, incremental?: boolean): State;
