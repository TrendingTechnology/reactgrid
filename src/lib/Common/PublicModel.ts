//
//  This is the core API for ReactGrid
//  PLEASE
//  ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE
//  THANKS!
//  Michael Matejko

export type Orientation = 'horizontal' | 'vertical';

export type Direction = 'horizontal' | 'vertical' | 'both';

export type SelectionMode = 'row' | 'column' | 'range';

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Focus {
    columnId: Id;
    rowId: Id;
    color: string;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface ReactGridProps {
    readonly columns: Column[];
    readonly rows: Row[];
    readonly license: 'non-commercial' | string;
    readonly style?: React.CSSProperties;
    readonly customCellTemplates?: CellTemplates;
    readonly additionalFocuses?: Focus[];
    readonly frozenTopRows?: number;
    readonly frozenBottomRows?: number;
    readonly frozenLeftColumns?: number;
    readonly frozenRightColumns?: number;
    readonly enableFillHandle?: boolean;
    readonly enableRangeSelection?: boolean;
    readonly enableRowSelection?: boolean;
    readonly enableColumnSelection?: boolean;
    readonly onDataChanged?: (dataChanges: DataChange[]) => void;
    readonly onCellFocused?: (cellId: CellId) => void;
    readonly onContextMenu?: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]) => MenuOption[];
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface CellTemplates {
    [key: string]: CellTemplate;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface CellId {
    readonly rowId: Id;
    readonly columnId: Id;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface DataChange {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly type: string;
    readonly initialData: any;
    readonly newData: any;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// This interface is used for the communication between DynaGrid and a cell
export interface CellTemplate<TCell extends Cell = Cell> {
    // Returns true if the data in the cell is not replacable
    // Default: _ => false
    isReadonly?(cell: TCell): boolean;
    // Returns true if the data is valid
    isValid(cell: TCell): boolean;
    // Returns true if accepts focus
    // Default: _ => true
    isFocusable?(cell: TCell): boolean;
    // Convert plain text (not encoded stuff) to cell data
    // Returns null when the data couldn't be converted
    // Default: cell => cell
    update?(cell: TCell, newCell: TCell): TCell;

    toText(cell: TCell): string;
    // The keyCode represents the key pressed on the keyboard, or 1 for a pointer event (double click).
    // Returns the cell data either affected by the event or not.
    // Default: _ => { cellData: null, enableEditMode: false }
    handleKeyDown?(cell: TCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: TCell; enableEditMode: boolean };
    // Custom styles based on cell data applied to the cells div element
    // Default: _ => {}
    getCustomStyle?(cell: TCell, isInEditMode: boolean): React.CSSProperties;
    // Render the cell content
    renderContent(props: CellRenderProps<TCell>): React.ReactNode;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface CellRenderProps<TCell extends Cell> {
    cell: TCell;
    readonly isInEditMode: boolean;
    onCellChanged(cell: TCell, commit: boolean): void;
}

export type Id = number | string;

export type DropPosition = 'before' | 'on' | 'after';

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Column {
    readonly id: Id;
    // default: 150
    readonly width?: number;
    // default: false
    readonly reorderable?: boolean;
    // default: false
    readonly resizable?: boolean;
    readonly canDrop?: (columnIds: Id[], position: DropPosition) => boolean;
    readonly onDrop?: (columnIds: Id[], position: DropPosition) => void;
    readonly onResize?: (newWidth: number) => void;
}

export interface CellStyle {
    readonly backgroundColor: string;
    readonly color: string;
    //readonly borderLeft
    //readonly borderRight
    //readonly borderTop
    //readonly borderBottom
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Cell<TCellType extends string = string, TCellData = any, TCellProps = any> {
    type: TCellType;
    data: TCellData;
    props?: TCellProps;
    style?: CellStyle;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Row {
    readonly id: Id;
    readonly cells: Cell[];
    // default: 25
    readonly height?: number;
    // default: false
    readonly reorderable?: boolean;
    readonly canDrop?: (rowIds: Id[], position: DropPosition) => boolean;
    readonly onDrop?: (rowIds: Id[], position: DropPosition) => void;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface MenuOption {
    title: string;
    handler: () => void;
}
