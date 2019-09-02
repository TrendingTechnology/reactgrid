import { CellMatrixProps, Id } from "./PublicModel";
import { Range } from "./Range";
import { Column, Row, Location, Cell } from ".";

interface IndexLookup {
    [id: string]: number;
}

// INTERNAL
export class CellMatrix {
    readonly frozenTopRange: Range;
    readonly frozenBottomRange: Range;
    readonly frozenLeftRange: Range;
    readonly frozenRightRange: Range;
    readonly scrollableRange: Range;
    readonly width: number = 0;
    readonly height: number = 0;


    readonly cols: Column[];
    readonly rows: Row[];
    readonly first: Location;
    readonly last: Location;

    private readonly id: number = Math.random()
    private readonly rowIndexLookup: IndexLookup = {};
    private readonly columnIndexLookup: IndexLookup = {};

    constructor(public readonly props: CellMatrixProps) {
        const frozenBottomFirstIdx = props.rows.length - (props.frozenBottomRows || 0);
        const frozenRightFirstIdx = props.columns.length - (props.frozenRightColumns || 0);
        let height = 0, width = 0;

        this.rows = props.rows.reduce(
            (rows, row, idx) => {
                const top =
                    idx === 0 || idx === props.frozenTopRows || idx === frozenBottomFirstIdx
                        ? 0
                        : rows[idx - 1].top + rows[idx - 1].height;
                rows.push({ ...row, top: top, idx: idx, bottom: top + row.height });
                height += row.height;
                this.rowIndexLookup[row.id] = idx;
                return rows;
            },
            [] as Row[]
        );
        this.cols = props.columns.reduce(
            (cols, column, idx) => {
                const left =
                    idx === 0 || idx === props.frozenLeftColumns || idx === frozenRightFirstIdx
                        ? 0
                        : cols[idx - 1].left + cols[idx - 1].width;
                cols.push({ ...column, idx, left, right: left + column.width })
                width += column.width;
                this.columnIndexLookup[column.id] = idx;
                return cols;
            },
            [] as Column[]
        );
        this.height = height;
        this.width = width;
        this.frozenLeftRange = new Range(this.cols.slice(0, props.frozenLeftColumns || 0), this.rows);
        this.frozenRightRange = new Range(this.cols.slice(frozenRightFirstIdx, this.cols.length), this.rows);
        this.frozenTopRange = new Range(this.cols, this.rows.slice(0, props.frozenTopRows || 0));
        this.frozenBottomRange = new Range(this.cols, this.rows.slice(frozenBottomFirstIdx, this.rows.length));
        this.scrollableRange = new Range(
            this.cols.slice(props.frozenLeftColumns || 0, frozenRightFirstIdx),
            this.rows.slice(props.frozenTopRows || 0, frozenBottomFirstIdx)
        );
        this.first = this.getLocation(0, 0);
        this.last = this.getLocation(this.rows.length - 1, this.cols.length - 1);
    }

    getRange(start: Location, end: Location): Range {
        const cols = this.cols.slice(
            start.col.idx < end.col.idx ? start.col.idx : end.col.idx,
            start.col.idx > end.col.idx ? start.col.idx + 1 : end.col.idx + 1
        );
        const rows = this.rows.slice(
            start.row.idx < end.row.idx ? start.row.idx : end.row.idx,
            start.row.idx > end.row.idx ? start.row.idx + 1 : end.row.idx + 1
        );
        return new Range(cols, rows);
    }

    getLocation(rowIdx: number, colIdx: number): Location {
        return new Location(this.rows[rowIdx], this.cols[colIdx]);
    }

    getLocationById(rowId: Id, colId: Id): Location {
        const row = this.rows[this.rowIndexLookup[rowId]]
        const col = this.cols[this.columnIndexLookup[colId]]
        return this.validateLocation(new Location(row, col))
    }

    validateLocation(location: Location): Location {
        if (this.last.col == undefined) throw new Error('Last column is undefined')
        if (location.row == undefined) throw new Error('Location row is undefined')
        const colIdx = this.columnIndexLookup[location.col.id] !== undefined ? this.columnIndexLookup[location.col.id]
            : (location.col.idx < this.last.col.idx) ? location.col.idx
                : this.last.col.idx;
        const rowIdx = this.rowIndexLookup[location.row.id] !== undefined ? this.rowIndexLookup[location.row.id]
            : (location.row.idx < this.last.row.idx) ? location.row.idx
                : this.last.row.idx;
        return this.getLocation(rowIdx, colIdx);
    }

    validateRange(range: Range): Range {
        return this.getRange(this.validateLocation(range.first), this.validateLocation(range.last));
    }

    getCell(rowId: Id, colId: Id): Cell {
        const row = this.rows[this.rowIndexLookup[rowId]]
        return row.cells[this.columnIndexLookup[colId]]
    }
}
