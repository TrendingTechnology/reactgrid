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
import { Pane } from "./Pane";
export var PaneRow = function (props) {
    var matrix = props.state.cellMatrix;
    var state = props.state;
    return (React.createElement("div", { className: "rg-pane-row " + (props.class ? props.class : ''), style: __assign({ height: props.range.height, zIndex: props.zIndex }, props.style) },
        matrix.frozenLeftRange.width > 0 &&
            React.createElement(Pane, { id: props.id + 'L', class: "rg-pane-l", state: props.state, style: { left: 0, position: 'sticky', zIndex: props.zIndex + 1 }, range: matrix.frozenLeftRange.slice(props.range, 'rows'), borders: __assign({}, props.borders, { right: true }) }),
        state.visibleRange && state.visibleRange.width > 0 &&
            React.createElement(Pane, { id: props.id + 'C', class: "rg-pane-c", state: props.state, style: { width: matrix.scrollableRange.width }, range: props.range.slice(state.visibleRange, 'columns'), borders: __assign({}, props.borders, { right: false, bottom: false }) }),
        matrix.frozenRightRange.width > 0 &&
            React.createElement(Pane, { id: props.id + 'R', class: "rg-pane-r", state: props.state, style: { right: 0, position: 'sticky', zIndex: props.zIndex + 1 }, range: matrix.frozenRightRange.slice(props.range, 'rows'), borders: __assign({}, props.borders, { left: true }) })));
};