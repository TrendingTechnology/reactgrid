var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Range } from "./Range";
import { Location } from ".";
var CellMatrix = (function () {
    function CellMatrix(props) {
        var _this = this;
        this.props = props;
        this.width = 0;
        this.height = 0;
        this.id = Math.random();
        this.rowIndexLookup = {};
        this.columnIndexLookup = {};
        var frozenBottomFirstIdx = props.rows.length - (props.frozenBottomRows || 0);
        var frozenRightFirstIdx = props.columns.length - (props.frozenRightColumns || 0);
        var height = 0, width = 0;
        this.rows = props.rows.reduce(function (rows, row, idx) {
            var top = idx === 0 || idx === props.frozenTopRows || idx === frozenBottomFirstIdx
                ? 0
                : rows[idx - 1].top + rows[idx - 1].height;
            rows.push(__assign({}, row, { top: top, idx: idx, bottom: top + row.height }));
            height += row.height;
            _this.rowIndexLookup[row.id] = idx;
            return rows;
        }, []);
        this.cols = props.columns.reduce(function (cols, column, idx) {
            var left = idx === 0 || idx === props.frozenLeftColumns || idx === frozenRightFirstIdx
                ? 0
                : cols[idx - 1].left + cols[idx - 1].width;
            cols.push(__assign({}, column, { idx: idx, left: left, right: left + column.width }));
            width += column.width;
            _this.columnIndexLookup[column.id] = idx;
            return cols;
        }, []);
        this.height = height;
        this.width = width;
        this.frozenLeftRange = new Range(this.cols.slice(0, props.frozenLeftColumns || 0), this.rows);
        this.frozenRightRange = new Range(this.cols.slice(frozenRightFirstIdx, this.cols.length), this.rows);
        this.frozenTopRange = new Range(this.cols, this.rows.slice(0, props.frozenTopRows || 0));
        this.frozenBottomRange = new Range(this.cols, this.rows.slice(frozenBottomFirstIdx, this.rows.length));
        this.scrollableRange = new Range(this.cols.slice(props.frozenLeftColumns || 0, frozenRightFirstIdx), this.rows.slice(props.frozenTopRows || 0, frozenBottomFirstIdx));
        this.first = this.getLocation(0, 0);
        this.last = this.getLocation(this.rows.length - 1, this.cols.length - 1);
    }
    CellMatrix.prototype.getRange = function (start, end) {
        var cols = this.cols.slice(start.col.idx < end.col.idx ? start.col.idx : end.col.idx, start.col.idx > end.col.idx ? start.col.idx + 1 : end.col.idx + 1);
        var rows = this.rows.slice(start.row.idx < end.row.idx ? start.row.idx : end.row.idx, start.row.idx > end.row.idx ? start.row.idx + 1 : end.row.idx + 1);
        return new Range(cols, rows);
    };
    CellMatrix.prototype.getLocation = function (rowIdx, colIdx) {
        return new Location(this.rows[rowIdx], this.cols[colIdx]);
    };
    CellMatrix.prototype.getLocationById = function (rowId, colId) {
        var row = this.rows[this.rowIndexLookup[rowId]];
        var col = this.cols[this.columnIndexLookup[colId]];
        return this.validateLocation(new Location(row, col));
    };
    CellMatrix.prototype.validateLocation = function (location) {
        var colIdx = this.columnIndexLookup[location.col.id] !== undefined ? this.columnIndexLookup[location.col.id]
            : (location.col.idx < this.last.col.idx) ? location.col.idx
                : this.last.col.idx;
        var rowIdx = this.rowIndexLookup[location.row.id] !== undefined ? this.rowIndexLookup[location.row.id]
            : (location.row.idx < this.last.row.idx) ? location.row.idx
                : this.last.row.idx;
        return this.getLocation(rowIdx, colIdx);
    };
    CellMatrix.prototype.validateRange = function (range) {
        return this.getRange(this.validateLocation(range.first), this.validateLocation(range.last));
    };
    CellMatrix.prototype.getCell = function (rowId, colId) {
        var row = this.rows[this.rowIndexLookup[rowId]];
        return row.cells[this.columnIndexLookup[colId]];
    };
    return CellMatrix;
}());
export { CellMatrix };
