/// <reference types="react" />
export declare type Orientation = 'horizontal' | 'vertical';
export declare type Direction = 'horizontal' | 'vertical' | 'both';
export declare type SelectionMode = 'row' | 'column' | 'range';
export interface Focus {
    columnId: Id;
    rowId: Id;
    color: string;
}
export interface ReactGridProps {
    readonly cellMatrixProps: CellMatrixProps;
    readonly license: string;
    readonly style?: React.CSSProperties;
    readonly cellTemplates?: CellTemplates;
    readonly customFocuses?: Focus[];
    readonly disableFillHandle?: boolean;
    readonly disableRangeSelection?: boolean;
    readonly disableRowSelection?: boolean;
    readonly disableColumnSelection?: boolean;
    readonly onDataChanged?: (dataChanges: DataChange[]) => void;
    readonly onCellFocused?: (cellId: CellId) => void;
    readonly onRowContextMenu?: (selectedIds: Id[], menuOptions: MenuOption[]) => MenuOption[];
    readonly onColumnContextMenu?: (selectedColumnIds: Id[], menuOptions: MenuOption[]) => MenuOption[];
    onRangeContextMenu?: (selectedRowIds: Id[], selectedColIds: Id[], menuOptions: MenuOption[]) => MenuOption[];
}
export interface CellTemplates {
    [key: string]: CellTemplate<any, any>;
}
export interface CellId {
    readonly rowId: Id;
    readonly columnId: Id;
}
export interface DataChange {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly type: string;
    readonly initialData: any;
    readonly newData: any;
}
export interface CellMatrixProps {
    readonly columns: ColumnProps[];
    readonly rows: RowProps[];
    readonly frozenTopRows?: number;
    readonly frozenBottomRows?: number;
    readonly frozenLeftColumns?: number;
    readonly frozenRightColumns?: number;
}
export interface CellTemplate<TCellData, TCellProps> {
    isReadonly?(data: TCellData, props?: TCellProps): boolean;
    isValid(data: TCellData, props?: TCellProps): boolean;
    isFocusable?(data: TCellData, props?: TCellProps): boolean;
    textToCellData?(text: string): TCellData | null;
    cellDataToText(cellData: TCellData, props?: TCellProps): string;
    handleKeyDown?(cellData: TCellData, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cellData: TCellData;
        enableEditMode: boolean;
        props?: any;
    };
    getCustomStyle?(cellData: TCellData, isInEditMode: boolean, props?: any): React.CSSProperties;
    renderContent(props: CellRenderProps<TCellData, TCellProps>): React.ReactNode;
}
export interface CellRenderProps<TCellData, TCellProps> {
    cellData: TCellData;
    props?: TCellProps;
    onCellDataChanged(cellData: TCellData, commit: boolean): void;
    readonly isInEditMode: boolean;
}
export declare type Id = number | string;
export declare type DropPosition = 'before' | 'on' | 'after';
export interface ColumnProps {
    readonly id: Id;
    readonly width: number;
    readonly reorderable: boolean;
    readonly resizable: boolean;
    readonly canDrop?: (columnIds: Id[], position: DropPosition) => boolean;
    readonly onDrop?: (columnIds: Id[], position: DropPosition) => void;
    readonly onResize?: (newWidth: number) => void;
}
export interface Cell {
    data: any;
    type: string;
    props?: any;
}
export interface RowProps {
    readonly id: Id;
    cells: Cell[];
    readonly height: number;
    readonly reorderable: boolean;
    readonly canDrop?: (rowIds: Id[], position: DropPosition) => boolean;
    readonly onDrop?: (rowIds: Id[], position: DropPosition) => void;
}
export interface MenuOption {
    title: string;
    handler: () => void;
}
