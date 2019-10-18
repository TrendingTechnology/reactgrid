import { GridColumn, GridRow, Location } from '.';

export class Range {
    readonly width: number;
    readonly height: number;
    readonly first: Location;
    readonly last: Location;

    constructor(public readonly cols: GridColumn[], public readonly rows: GridRow[]) {
        this.first = new Location(this.rows[0], this.cols[0]);
        this.last = new Location(this.rows[this.rows.length - 1], this.cols[this.cols.length - 1]);
        this.height = this.rows.map(c => c.height).reduce((a, b) => a + b, 0);
        this.width = this.cols.map(c => c.width).reduce((a, b) => a + b, 0);
    }

    contains(location: Location): boolean {
        return location.col.idx >= this.first.col.idx && location.col.idx <= this.last.col.idx && location.row.idx >= this.first.row.idx && location.row.idx <= this.last.row.idx;
    }

    containsRange(range: Range): boolean {
        return range.first.col.idx >= this.first.col.idx && range.first.row.idx >= this.first.row.idx && range.last.col.idx <= this.last.col.idx && range.last.row.idx <= this.last.row.idx;
    }

    intersectsWith(range: Range): boolean {
        return range.first.col.idx <= this.last.col.idx && range.first.row.idx <= this.last.row.idx && range.last.col.idx >= this.first.col.idx && range.last.row.idx >= this.first.row.idx;
    }

    slice(range: Range, direction: 'columns' | 'rows' | 'both'): Range {
        const firstRow = direction === 'rows' ? range.first.row : this.first.row;
        const firstCol = direction === 'columns' ? range.first.col : this.first.col;
        const lastRow = direction === 'rows' ? range.last.row : this.last.row;
        const lastCol = direction === 'columns' ? range.last.col : this.last.col;
        const slicedRows = this.rows.slice(firstRow.idx - this.first.row.idx, lastRow.idx - this.first.row.idx + 1);
        const slicedCols = this.cols.slice(firstCol.idx - this.first.col.idx, lastCol.idx - this.first.col.idx + 1);
        return new Range(slicedCols, slicedRows);
    }
}
