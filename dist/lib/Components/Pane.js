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
import * as React from "react";
import { CellFocus } from "./CellFocus";
import { FillHandle } from "./FillHandle";
import { RowRenderer } from "./RowRenderer";
import { PartialArea } from "./PartialArea";
var GridContent = (function (_super) {
    __extends(GridContent, _super);
    function GridContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridContent.prototype.shouldComponentUpdate = function (nextProps) {
        if (this.props.state.focusedLocation && nextProps.state.focusedLocation) {
            if ((this.props.state.focusedLocation.col.id !== nextProps.state.focusedLocation.col.id || this.props.state.focusedLocation.row.id !== nextProps.state.focusedLocation.row.id))
                return true;
        }
        else {
            return true;
        }
        return this.props.state.visibleRange != nextProps.state.visibleRange || this.props.state.cellMatrix.props != nextProps.state.cellMatrix.props;
    };
    GridContent.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            this.props.range.rows.map(function (row) { return React.createElement(RowRenderer, { key: row.idx, state: _this.props.state, row: row, columns: _this.props.range.cols, forceUpdate: true, borders: __assign({}, _this.props.borders, { top: _this.props.borders.top && row.top === 0, bottom: _this.props.borders.bottom && row.idx === _this.props.range.last.row.idx }) }); }),
            this.props.range.rows.map(function (row) { return React.createElement("div", { key: row.idx, className: "rg-separator-line rg-separator-line-row", style: { top: row.top, height: row.height, } }); }),
            this.props.range.cols.map(function (col) { return React.createElement("div", { key: col.idx, className: "rg-separator-line rg-separator-line-col", style: { left: col.left, width: col.width } }); })));
    };
    return GridContent;
}(React.Component));
function renderCustomFocuses(props) {
    var customFocuses = props.state.customFocuses.filter(function (value) { return Object.keys(value).length !== 0; });
    return (customFocuses.map(function (focus, id) {
        var location = props.state.cellMatrix.getLocationById(focus.rowId, focus.colId);
        return location && props.range.contains(location) && React.createElement(CellFocus, { key: id, location: location, color: focus.color });
    }));
}
export var Pane = function (props) {
    return (React.createElement("div", { key: props.id, className: "rg-pane " + props.class, style: __assign({ width: props.range.width }, props.style) },
        React.createElement(GridContent, { state: props.state, range: props.range, borders: props.borders }),
        renderSelectedRanges(props.state, props.range),
        props.state.currentBehavior.renderPanePart(props.state, props.range),
        props.state.customFocuses && renderCustomFocuses(props),
        props.state.focusedLocation && props.range.contains(props.state.focusedLocation) &&
            React.createElement(CellFocus, { location: props.state.focusedLocation }),
        props.state.selectedRanges[props.state.activeSelectedRangeIdx] && props.range.contains(props.state.selectedRanges[props.state.activeSelectedRangeIdx].last) &&
            !props.state.disableFillHandle && !props.state.currentlyEditedCell && React.createElement(FillHandle, { state: props.state, location: props.state.selectedRanges[props.state.activeSelectedRangeIdx].last })));
};
function renderSelectedRanges(state, pane) {
    return state.selectedRanges.map(function (range, i) { return !(state.focusedLocation && range.contains(state.focusedLocation) && range.cols.length === 1 && range.rows.length === 1) && pane.intersectsWith(range) && React.createElement(PartialArea, { key: i, pane: pane, range: range, class: "rg-partial-area-selected-range", style: {} }); });
}
