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
import { Location } from "../Common";
export function updateSelectedRows(state) {
    var firstCol = state.cellMatrix.first.col;
    var lastCol = state.cellMatrix.last.col;
    var updatedRows = state.cellMatrix.rows.filter(function (r) { return state.selectedIds.includes(r.id); }).sort(function (a, b) { return a.idx - b.idx; });
    var rows = groupedRows(updatedRows);
    var ranges = rows.map(function (arr) { return state.cellMatrix.getRange(new Location(arr[0], firstCol), new Location(arr[arr.length - 1], lastCol)); });
    var activeSelectedRangeIdx = state.selectedRanges.length - 1;
    if (state.focusedLocation) {
        ranges.forEach(function (range, idx) {
            range.rows.forEach(function (row) {
                if (state.focusedLocation.row.id === row.id) {
                    activeSelectedRangeIdx = idx;
                }
            });
        });
    }
    return __assign({}, state, { selectionMode: 'row', activeSelectedRangeIdx: activeSelectedRangeIdx, selectedRanges: ranges.slice(), selectedIndexes: updatedRows.map(function (row) { return row.idx; }), selectedIds: updatedRows.map(function (row) { return row.id; }) });
}
export function updateSelectedColumns(state) {
    var firstRow = state.cellMatrix.first.row;
    var lastRow = state.cellMatrix.last.row;
    var updatedColumns = state.cellMatrix.cols.filter(function (r) { return state.selectedIds.includes(r.id); }).sort(function (a, b) { return a.idx - b.idx; });
    var columns = groupedColumns(updatedColumns);
    var ranges = columns.map(function (arr) { return state.cellMatrix.getRange(new Location(firstRow, arr[0]), new Location(lastRow, arr[arr.length - 1])); });
    var activeSelectedRangeIdx = state.selectedRanges.length - 1;
    if (state.focusedLocation) {
        ranges.forEach(function (range, idx) {
            range.cols.forEach(function (col) {
                if (state.focusedLocation.col.id === col.id) {
                    activeSelectedRangeIdx = idx;
                }
            });
        });
    }
    return __assign({}, state, { selectionMode: 'column', activeSelectedRangeIdx: activeSelectedRangeIdx, selectedRanges: ranges.slice(), selectedIndexes: updatedColumns.map(function (col) { return col.idx; }), selectedIds: updatedColumns.map(function (col) { return col.id; }) });
}
var groupedRows = function (array) {
    var grouped = [];
    var sortIndex = 0;
    array.forEach(function (current, index) {
        if (!array[index - 1]) {
            grouped.push([current]);
            return;
        }
        var prev = array[index - 1];
        if (current.idx - prev.idx == 1) {
            if (!grouped[sortIndex]) {
                grouped.push([prev, current]);
            }
            else {
                grouped[sortIndex].push(current);
            }
        }
        else {
            grouped.push([current]);
            sortIndex += 1;
        }
    });
    return grouped;
};
var groupedColumns = function (array) {
    var grouped = [];
    var sortIndex = 0;
    array.forEach(function (current, index) {
        if (!array[index - 1]) {
            grouped.push([current]);
            return;
        }
        var prev = array[index - 1];
        if (current.idx - prev.idx == 1) {
            if (!grouped[sortIndex]) {
                grouped.push([prev, current]);
            }
            else {
                grouped[sortIndex].push(current);
            }
        }
        else {
            grouped.push([current]);
            sortIndex += 1;
        }
    });
    return grouped;
};