var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import React from 'react';
import { ReactGrid } from './lib/Components/ReactGrid';
import './lib/assets/core.scss';
var columns_count = 10;
var columns_width = 100;
var rows_height = 25;
var rows_count = 16;
var DevGrid = (function (_super) {
    __extends(DevGrid, _super);
    function DevGrid(props) {
        var _this = _super.call(this, props) || this;
        var columns = new Array(props.columns).fill(props.columnsWidth || 100).map(function (width, idx) { return ({ id: _this.getRandomId(), width: width, idx: idx }); });
        _this.state = {
            columns: columns,
            rows: new Array(props.rows).fill(props.rowsHeight || 25).map(function (height, idx) { return columns.reduce(function (row, column) { row.data[column.id] = (idx + ' - ' + columns.findIndex(function (c) { return c.id == column.id; })); return row; }, { id: _this.getRandomId(), height: height, data: {} }); }),
        };
        return _this;
    }
    DevGrid.prototype.getRandomId = function () {
        return Math.random().toString(36).substr(2, 9);
    };
    DevGrid.prototype.getMatrix = function () {
        var _this = this;
        var columns = this.state.columns.slice().map(function (c, cIdx) { return ({
            id: c.id,
            width: c.width,
            reorderable: true,
            resizable: true,
            onDrop: function (idxs) { return _this.setState({ columns: _this.getReorderedColumns(idxs, cIdx) }); },
            onResize: function (width) {
                var state = __assign({}, _this.state);
                state.columns[cIdx].width = width;
                _this.setState(state);
            }
        }); });
        var rows = this.state.rows.slice().map(function (r, rIdx) { return ({
            id: r.id,
            height: r.height,
            reorderable: true,
            cells: _this.state.columns.slice().map(function (c) { return ({ data: r.data[c.id], type: 'text' }); }),
            onDrop: function (idxs) { return _this.setState({ rows: _this.getReorderedRows(idxs, rIdx) }); },
        }); });
        return { rows: rows, columns: columns };
    };
    DevGrid.prototype.prepareDataChanges = function (dataChanges) {
        var state = __assign({}, this.state);
        dataChanges.forEach(function (change) {
            state.rows.map(function (r) { return r.id == change.rowId ? r.data[change.columnId] = change.newData : r; });
        });
        return state;
    };
    DevGrid.prototype.getReorderedColumns = function (colIds, to) {
        var movedColumns = this.state.columns.slice().filter(function (c) { return colIds.includes(c.id); });
        var clearedColumns = this.state.columns.slice().filter(function (c) { return !colIds.includes(c.id); });
        if (to > this.state.columns.slice().findIndex(function (c) { return c.id == colIds[0]; }))
            to -= colIds.length - 1;
        clearedColumns.splice.apply(clearedColumns, [to, 0].concat(movedColumns));
        return clearedColumns;
    };
    DevGrid.prototype.getReorderedRows = function (rowIds, to) {
        var movedRows = this.state.rows.slice().filter(function (r) { return rowIds.includes(r.id); });
        var clearedRows = this.state.rows.slice().filter(function (r) { return !rowIds.includes(r.id); });
        if (to > this.state.rows.slice().findIndex(function (r) { return r.id == rowIds[0]; }))
            to -= rowIds.length - 1;
        clearedRows.splice.apply(clearedRows, [to, 0].concat(movedRows));
        return clearedRows;
    };
    DevGrid.prototype.render = function () {
        var _this = this;
        return React.createElement(ReactGrid, { cellMatrixProps: this.getMatrix(), onDataChanged: function (changes) { return _this.setState(_this.prepareDataChanges(changes)); }, license: 'non-commercial' });
    };
    return DevGrid;
}(React.Component));
export default DevGrid;
