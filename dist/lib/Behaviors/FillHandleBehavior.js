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
import * as React from 'react';
import { Behavior, Location } from "../Common";
import { PartialArea } from '../Components/PartialArea';
import { getActiveSelectedRange } from '../Functions/getActiveSelectedRange';
import { trySetDataAndAppendChange } from '../Functions';
var FillHandleBehavior = (function (_super) {
    __extends(FillHandleBehavior, _super);
    function FillHandleBehavior() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fillDirection = '';
        return _this;
    }
    FillHandleBehavior.prototype.handlePointerEnter = function (event, location, state) {
        var selectedRange = getActiveSelectedRange(state);
        this.fillDirection = this.getFillDirection(selectedRange, location);
        this.fillRange = this.getFillRange(state.cellMatrix, selectedRange, location, this.fillDirection);
        return __assign({}, state);
    };
    FillHandleBehavior.prototype.getFillDirection = function (selectedRange, pointerLocation) {
        var differences = [];
        differences.push({ direction: '', value: 0 });
        differences.push({
            direction: 'up',
            value: pointerLocation.row.idx < selectedRange.first.row.idx
                ? selectedRange.first.row.idx - pointerLocation.row.idx
                : 0
        });
        differences.push({
            direction: 'down',
            value: pointerLocation.row.idx > selectedRange.last.row.idx
                ? pointerLocation.row.idx - selectedRange.last.row.idx
                : 0
        });
        differences.push({
            direction: 'left',
            value: pointerLocation.col.idx < selectedRange.first.col.idx
                ? selectedRange.first.col.idx - pointerLocation.col.idx
                : 0
        });
        differences.push({
            direction: 'right',
            value: pointerLocation.col.idx > selectedRange.last.col.idx
                ? pointerLocation.col.idx - selectedRange.last.col.idx
                : 0
        });
        return differences.reduce(function (prev, current) {
            return prev.value >= current.value ? prev : current;
        }).direction;
    };
    FillHandleBehavior.prototype.getFillRange = function (cellMatrix, selectedRange, location, fillDirection) {
        switch (fillDirection) {
            case 'right':
                return cellMatrix.getRange(cellMatrix.getLocation(selectedRange.first.row.idx, cellMatrix.last.col.idx < selectedRange.last.col.idx + 1
                    ? cellMatrix.last.col.idx
                    : selectedRange.last.col.idx + 1), new Location(selectedRange.last.row, location.col));
            case 'left':
                return cellMatrix.getRange(cellMatrix.getLocation(selectedRange.first.row.idx, location.col.idx), cellMatrix.getLocation(selectedRange.last.row.idx, cellMatrix.first.col.idx > selectedRange.first.col.idx - 1
                    ? cellMatrix.first.col.idx
                    : selectedRange.first.col.idx - 1));
            case 'up':
                return cellMatrix.getRange(cellMatrix.getLocation(location.row.idx, selectedRange.first.col.idx), cellMatrix.getLocation(cellMatrix.first.row.idx > selectedRange.first.row.idx - 1
                    ? cellMatrix.first.row.idx
                    : selectedRange.first.row.idx - 1, selectedRange.last.col.idx));
            case 'down':
                return cellMatrix.getRange(cellMatrix.getLocation(cellMatrix.last.row.idx < selectedRange.last.row.idx + 1
                    ? cellMatrix.last.row.idx
                    : selectedRange.last.row.idx + 1, selectedRange.first.col.idx), new Location(location.row, selectedRange.last.col));
        }
        return undefined;
    };
    FillHandleBehavior.prototype.handlePointerUp = function (event, location, state) {
        var activeSelectedRange = getActiveSelectedRange(state);
        var cellMatrix = state.cellMatrix;
        var values;
        if (!activeSelectedRange || this.fillRange === undefined) {
            return state;
        }
        this.fillRange = state.cellMatrix.validateRange(this.fillRange);
        switch (this.fillDirection) {
            case 'right':
                values = activeSelectedRange.rows.map(function (row) {
                    return new Location(row, state.cellMatrix.cols[activeSelectedRange.last.col.idx]).cell;
                });
                state = this.iterateFillRangeRows(state, values);
                state = __assign({}, state, { selectedRanges: [cellMatrix.getRange(activeSelectedRange.first, new Location(activeSelectedRange.last.row, location.col))], selectedIds: activeSelectedRange.cols.map(function (col) { return col.id; }).concat(this.fillRange.cols.map(function (col) { return col.id; })) });
                break;
            case 'left':
                values = activeSelectedRange.rows.map(function (row) {
                    return new Location(row, state.cellMatrix.cols[activeSelectedRange.last.col.idx]).cell;
                });
                state = this.iterateFillRangeRows(state, values);
                state = __assign({}, state, { selectedRanges: [cellMatrix.getRange(activeSelectedRange.last, new Location(activeSelectedRange.first.row, location.col))], selectedIds: activeSelectedRange.cols.map(function (col) { return col.id; }).concat(this.fillRange.cols.map(function (col) { return col.id; })) });
                break;
            case 'up':
                values = activeSelectedRange.cols.map(function (col) {
                    return new Location(state.cellMatrix.rows[activeSelectedRange.last.row.idx], col).cell;
                });
                state = this.iterateFillRangeCols(state, values);
                state = __assign({}, state, { selectedRanges: [cellMatrix.getRange(activeSelectedRange.last, new Location(location.row, activeSelectedRange.first.col))], selectedIds: activeSelectedRange.rows.map(function (row) { return row.id; }).concat(this.fillRange.rows.map(function (row) { return row.id; })) });
                break;
            case 'down':
                values = activeSelectedRange.cols.map(function (col) {
                    return new Location(state.cellMatrix.rows[activeSelectedRange.last.row.idx], col).cell;
                });
                state = this.iterateFillRangeCols(state, values);
                state = __assign({}, state, { selectedRanges: [cellMatrix.getRange(activeSelectedRange.first, new Location(location.row, activeSelectedRange.last.col))], selectedIds: activeSelectedRange.rows.map(function (row) { return row.id; }).concat(this.fillRange.rows.map(function (row) { return row.id; })) });
                break;
        }
        return state;
    };
    FillHandleBehavior.prototype.iterateFillRangeRows = function (state, values) {
        var _this = this;
        this.fillRange && this.fillRange.rows.forEach(function (row, i) {
            return _this.fillRange.cols.forEach(function (col) {
                state = trySetDataAndAppendChange(state, new Location(row, col), values[i]);
            });
        });
        return state;
    };
    FillHandleBehavior.prototype.iterateFillRangeCols = function (state, values) {
        var _this = this;
        this.fillRange && this.fillRange.rows.forEach(function (row) {
            return _this.fillRange.cols.forEach(function (col, i) {
                state = trySetDataAndAppendChange(state, new Location(row, col), values[i]);
            });
        });
        return state;
    };
    FillHandleBehavior.prototype.renderPanePart = function (state, pane) {
        return this.fillDirection && this.fillRange && pane.intersectsWith(this.fillRange) &&
            React.createElement(PartialArea, { range: state.cellMatrix.validateRange(this.fillRange), class: "rg-partial-area-part", pane: pane, style: {
                    backgroundColor: '',
                    borderTop: this.fillDirection === 'down' ? '0px solid transparent' : '',
                    borderBottom: this.fillDirection === 'up' ? '0px solid transparent' : '',
                    borderLeft: this.fillDirection === 'right' ? '0px solid transparent' : '',
                    borderRight: this.fillDirection === 'left' ? '0px solid transparent' : ''
                } });
    };
    return FillHandleBehavior;
}(Behavior));
export { FillHandleBehavior };
