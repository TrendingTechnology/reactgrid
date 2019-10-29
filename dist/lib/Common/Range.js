import { Location } from ".";
var Range = (function () {
    function Range(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.width = 0;
        this.height = 0;
        this.first = new Location(this.rows[0], this.cols[0]);
        this.last = new Location(this.rows[this.rows.length - 1], this.cols[this.cols.length - 1]);
        this.height = this.rows.map(function (c) { return c.height; }).reduce(function (a, b) { return a + b; }, 0);
        this.width = this.cols.map(function (c) { return c.width; }).reduce(function (a, b) { return a + b; }, 0);
    }
    Range.prototype.contains = function (location) {
        return (location.col.idx >= this.first.col.idx &&
            location.col.idx <= this.last.col.idx &&
            location.row.idx >= this.first.row.idx &&
            location.row.idx <= this.last.row.idx);
    };
    Range.prototype.containsRange = function (range) {
        return (range.first.col.idx >= this.first.col.idx &&
            range.first.row.idx >= this.first.row.idx &&
            range.last.col.idx <= this.last.col.idx &&
            range.last.row.idx <= this.last.row.idx);
    };
    Range.prototype.intersectsWith = function (range) {
        return (range.first.col.idx <= this.last.col.idx &&
            range.first.row.idx <= this.last.row.idx &&
            range.last.col.idx >= this.first.col.idx &&
            range.last.row.idx >= this.first.row.idx);
    };
    Range.prototype.slice = function (range, direction) {
        var firstRow = direction === 'rows' ? range.first.row : this.first.row;
        var firstCol = direction === 'columns' ? range.first.col : this.first.col;
        var lastRow = direction === 'rows' ? range.last.row : this.last.row;
        var lastCol = direction === 'columns' ? range.last.col : this.last.col;
        var slicedRows = this.rows.slice(firstRow.idx - this.first.row.idx, lastRow.idx - this.first.row.idx + 1);
        var slicedCols = this.cols.slice(firstCol.idx - this.first.col.idx, lastCol.idx - this.first.col.idx + 1);
        return new Range(slicedCols, slicedRows);
    };
    return Range;
}());
export { Range };
