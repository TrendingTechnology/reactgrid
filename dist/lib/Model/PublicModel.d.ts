/// <reference types="react" />
export declare type SelectionMode = 'row' | 'column' | 'range';
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
export interface CellTemplates {
    [key: string]: CellTemplate;
}
export interface CellLocation {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly color?: string;
}
export interface Focus {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly className: string;
}
export interface CellChange<TCell extends Cell = Cell> {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly initialCell: TCell;
    readonly newCell: TCell;
}
export interface CellTemplate<TCell extends Cell = Cell> {
    validate(cell: TCell): CompatibleCell<TCell>;
    isFocusable?(cell: TCell): boolean;
    update?(cell: TCell, newCell: TCell | CompatibleCell): TCell;
    handleKeyDown?(cell: TCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: TCell;
        enableEditMode: boolean;
    };
    getStyle?(cell: TCell, isInEditMode: boolean): CellStyle;
    render(cell: TCell, isInEditMode: boolean, onCellChanged: (cell: TCell, commit: boolean) => void): React.ReactNode;
}
export declare type Id = number | string;
export declare type DropPosition = 'before' | 'on' | 'after';
export interface Column {
    readonly columnId: Id;
    readonly width?: number;
    readonly reorderable?: boolean;
    readonly resizable?: boolean;
}
export interface CellStyle {
    readonly color?: string;
    readonly background?: string;
    readonly className?: string;
}
export interface Cell {
    type: string;
    style?: CellStyle;
}
export declare type CompatibleCell<TCell extends Cell = Cell> = TCell & {
    text: string;
    value?: number;
};
export interface Row {
    readonly rowId: Id;
    readonly cells: Cell[];
    readonly height?: number;
    readonly reorderable?: boolean;
}
export interface MenuOption {
    id: string;
    label: string;
    handler: () => void;
}
