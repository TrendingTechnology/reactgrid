import { Row, Column, Cell, State } from '.';
import { EventHandlers } from '../Functions/EventHandlers';

export type Orientation = 'horizontal' | 'vertical';

export type Direction = 'horizontal' | 'vertical' | 'both';

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
    constructor(public readonly row: GridRow, public readonly column: GridColumn) { }
    get cell(): Cell {
        return this.row.cells[this.column.idx];
    }
    equals(location?: Location) {
        return location && this.column.idx === location.column.idx && this.row.idx === location.row.idx;
    }
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// INTERNAL
export class PointerLocation extends Location {
    constructor(public readonly row: GridRow, public readonly column: GridColumn, public readonly viewportX: number, public readonly viewportY: number, public readonly cellX: number, public readonly cellY: number) {
        super(row, column);
    }
}

export interface GridRendererProps {
    state: State;
    eventHandlers: EventHandlers;
}

