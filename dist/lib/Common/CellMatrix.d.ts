import { CellMatrixProps, Id } from "./PublicModel";
import { Range } from "./Range";
import { Column, Row, Location, Cell } from ".";
export declare class CellMatrix {
    readonly props: CellMatrixProps;
    readonly frozenTopRange: Range;
    readonly frozenBottomRange: Range;
    readonly frozenLeftRange: Range;
    readonly frozenRightRange: Range;
    readonly scrollableRange: Range;
    readonly width: number;
    readonly height: number;
    readonly cols: Column[];
    readonly rows: Row[];
    readonly first: Location;
    readonly last: Location;
    private readonly id;
    private readonly rowIndexLookup;
    private readonly columnIndexLookup;
    constructor(props: CellMatrixProps);
    getRange(start: Location, end: Location): Range;
    getLocation(rowIdx: number, colIdx: number): Location;
    getLocationById(rowId: Id, colId: Id): Location;
    validateLocation(location: Location): Location;
    validateRange(range: Range): Range;
    getCell(rowId: Id, colId: Id): Cell;
}
