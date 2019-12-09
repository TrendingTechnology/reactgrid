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
import { CellFocus } from './CellFocus';
import { FillHandle } from './FillHandle';
import { RowRenderer } from './RowRenderer';
import { PartialArea } from './PartialArea';
var GridContent = (function (_super) {
    __extends(GridContent, _super);
    function GridContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridContent.prototype.shouldComponentUpdate = function (nextProps) {
        if (this.props.state.focusedLocation && nextProps.state.focusedLocation) {
            if (this.props.state.focusedLocation.column.columnId !== nextProps.state.focusedLocation.column.columnId || this.props.state.focusedLocation.row.rowId !== nextProps.state.focusedLocation.row.rowId)
                return true;
        }
        else {
            return true;
        }
        return this.props.state.visibleRange !== nextProps.state.visibleRange || this.props.state.cellMatrix.props !== nextProps.state.cellMatrix.props;
    };
    GridContent.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            this.props.range.rows.map(function (row) { return React.createElement(RowRenderer, { key: row.rowId, state: _this.props.state, row: row, columns: _this.props.range.columns, forceUpdate: true, borders: __assign({}, _this.props.borders, { top: _this.props.borders.top && row.top === 0, bottom: _this.props.borders.bottom && row.idx === _this.props.range.last.row.idx }) }); }),
            this.props.range.rows.map(function (row) { return React.createElement("div", { key: row.rowId, className: "rg-separator-line rg-separator-line-row", style: { top: row.top, height: row.height, } }); }),
            this.props.range.columns.map(function (col) { return React.createElement("div", { key: col.columnId, className: "rg-separator-line rg-separator-line-col", style: { left: col.left, width: col.width } }); })));
    };
    return GridContent;
}(React.Component));
function renderHighlights(props) {
    return props.state.highlightLocations.map(function (highlight, id) {
        var location = props.state.cellMatrix.getLocationById(highlight.rowId, highlight.columnId);
        return location && props.range.contains(location) && React.createElement(CellFocus, { key: id, location: location, color: highlight.borderColor });
    });
}
export var Pane = function (props) {
    return (React.createElement("div", { key: props.id, className: "rg-pane " + props.class, style: __assign({ width: props.range.width }, props.style) },
        React.createElement(GridContent, { state: props.state, range: props.range, borders: props.borders }),
        renderSelectedRanges(props.state, props.range),
        props.state.currentBehavior.renderPanePart(props.state, props.range),
        props.state.highlightLocations && renderHighlights(props),
        props.state.focusedLocation && props.range.contains(props.state.focusedLocation) && React.createElement(CellFocus, { location: props.state.focusedLocation }),
        props.state.selectedRanges[props.state.activeSelectedRangeIdx] && props.range.contains(props.state.selectedRanges[props.state.activeSelectedRangeIdx].last) && !props.state.disableFillHandle && !props.state.currentlyEditedCell && React.createElement(FillHandle, { state: props.state, location: props.state.selectedRanges[props.state.activeSelectedRangeIdx].last })));
};
function renderSelectedRanges(state, pane) {
    return state.selectedRanges.map(function (range, i) { return !(state.focusedLocation && range.contains(state.focusedLocation) && range.columns.length === 1 && range.rows.length === 1) && pane.intersectsWith(range) && React.createElement(PartialArea, { key: i, pane: pane, range: range, class: "rg-partial-area-selected-range", style: {} }); });
}