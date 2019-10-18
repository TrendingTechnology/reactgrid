import { Row, Column, Cell } from '.';

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE! 
// INTERNAL
export interface GridColumn extends Column {
    readonly idx: number;
    readonly left: number;
    readonly right: number;
    readonly width: number;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE! 
// INTERNAL
export interface GridRow extends Row {
    readonly idx: number;
    readonly top: number;
    readonly bottom: number;
    readonly height: number;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE! 
// INTERNAL
export interface Borders {
    top?: boolean;
    left?: boolean;
    bottom?: boolean;
    right?: boolean;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE! 
// INTERNAL
export class Location {
    constructor(
        public readonly row: GridRow,
        public readonly col: GridColumn,
    ) { }
    get cell(): Cell { return this.row.cells[this.col.idx] };
    equals(location?: Location) {
        return location && this.col.idx === location.col.idx && this.row.idx === location.row.idx;
    }
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE! 
// INTERNAL
export class PointerLocation extends Location {
    constructor(
        public readonly row: GridRow,
        public readonly col: GridColumn,
        public readonly viewportX: number,
        public readonly viewportY: number,
        public readonly cellX: number,
        public readonly cellY: number) {
        super(row, col);
    }
}
