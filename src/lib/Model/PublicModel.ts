//
//  This is the public API for ReactGrid
//  PLEASE
//  ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE
//  THANKS!
//  Michael Matejko

export type SelectionMode = 'row' | 'column' | 'range';

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface ReactGridProps {
    readonly columns: Column[];
    readonly rows: Row[];
    readonly license: 'non-commercial' | string;
    readonly customCellTemplates?: CellTemplates;
    readonly focusLocation?: CellLocation;
    readonly highlightLocations?: CellLocation[];
    readonly frozenTopRows?: number;
    readonly frozenBottomRows?: number;
    readonly frozenLeftColumns?: number;
    readonly frozenRightColumns?: number;
    readonly disableFillHandle?: boolean;
    readonly disableRangeSelection?: boolean;
    readonly enableRowSelection?: boolean;
    readonly enableColumnSelection?: boolean;

    readonly onCellsChanged?: (cellChanges: CellChange<Cell>[]) => boolean;
    readonly onFocusLocationChanged?: (location: CellLocation) => boolean;
    readonly onColumnResized?: (columnId: Id, width: number) => void;
    readonly canReorderRows?: (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => boolean;
    readonly onRowsReordered?: (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => void;
    readonly canReorderColumns?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => boolean;
    readonly onColumnsReordered?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => void;
    readonly onContextMenu?: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]) => MenuOption[];
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface CellTemplates {
    [key: string]: CellTemplate;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface CellLocation {
    readonly rowId: Id;
    readonly columnId: Id;
}

export interface Focus {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly className: string;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface CellChange<TCell extends Cell = Cell> {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly initialCell: TCell;
    readonly newCell: TCell;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// This interface is used for the communication between ReactGrid and a cell
export interface CellTemplate<TCell extends Cell = Cell> {
    // Validate and convert to exchangable cell type
    validate(cell: TCell): CompatibleCell<TCell>
    // Returns true if the data in the cell is not replacable
    // Default: _ => true
    isFocusable?(cell: TCell): boolean;
    // Reduces current cell and new cell to one cell
    // If not implemented, cell will be read-only
    update?(cell: TCell, newCell: TCell | CompatibleCell): TCell;
    // The keyCode represents the key pressed on the keyboard, or 1 for a pointer event (double click).
    // Returns the cell data either affected by the event or not.
    // Default: cell => { cell, enableEditMode: false }
    // TODO pass whole event
    handleKeyDown?(cell: TCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: TCell; enableEditMode: boolean };
    // Custom styles based on cell data applied to the cells div element
    // Default: _ => cell.style | {}
    getStyle?(cell: TCell, isInEditMode: boolean): CellStyle;
    // Render the cell content
    render(cell: TCell, isInEditMode: boolean, onCellChanged: (cell: TCell, commit: boolean) => void): React.ReactNode;
}

export type Id = number | string;

export type DropPosition = 'before' | 'on' | 'after';

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Column {
    readonly columnId: Id;
    // default: 150
    readonly width?: number;
    // default: false
    readonly reorderable?: boolean;
    // default: false
    readonly resizable?: boolean;
    //readonly canDrop?: (columnIds: Id[], position: DropPosition) => boolean;
    //readonly onDrop?: (columnIds: Id[], position: DropPosition) => void;
    // if onResize === undefined => not resizable
    //readonly onResize?: (newWidth: number) => void;
}

export interface CellStyle {
    readonly color?: string;
    readonly background?: string;
    readonly className?: string;
    // TODO
    //readonly borderLeft
    //readonly borderRight
    //readonly borderTop
    //readonly borderBottom
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Cell {
    type: string;
    style?: CellStyle;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// Extended & excangable cell (compatible between different types)
export type CompatibleCell<TCell extends Cell = Cell> = TCell & {
    text: string;
    value?: number;
};

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Row {
    readonly rowId: Id;
    readonly cells: Cell[];
    // default: 25
    readonly height?: number;
    // default: false
    readonly reorderable?: boolean;
    //readonly canDrop?: (rowIds: Id[], position: DropPosition) => boolean;
    //readonly onDrop?: (rowIds: Id[], position: DropPosition) => void;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface MenuOption {
    id: string;
    label: string;
    handler: () => void;
}
