import { RowProps, ColumnProps, Cell } from ".";
export interface Column extends ColumnProps {
    readonly idx: number;
    readonly left: number;
    readonly right: number;
}
export interface Row extends RowProps {
    readonly idx: number;
    readonly top: number;
    readonly bottom: number;
}
export interface Borders {
    top?: boolean;
    left?: boolean;
    bottom?: boolean;
    right?: boolean;
}
export declare class Location {
    readonly row: Row;
    readonly col: Column;
    constructor(row: Row, col: Column);
    readonly cell: Cell;
    equals(location?: Location): boolean | undefined;
}
export declare class PointerLocation extends Location {
    readonly row: Row;
    readonly col: Column;
    readonly viewportX: number;
    readonly viewportY: number;
    readonly cellX: number;
    readonly cellY: number;
    constructor(row: Row, col: Column, viewportX: number, viewportY: number, cellX: number, cellY: number);
}
