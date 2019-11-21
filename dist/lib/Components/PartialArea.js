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
export var PartialArea = function (props) {
    var range = props.range, pane = props.pane, style = props.style;
    var top = range.first.row.idx <= pane.first.row.idx ? pane.first.row.top : range.first.row.top;
    var left = range.first.column.idx <= pane.first.column.idx ? pane.first.column.left : range.first.column.left;
    var width = (range.last.column.idx > pane.last.column.idx ? pane.last.column.right : range.last.column.right) - left;
    var height = (range.last.row.idx > pane.last.row.idx ? pane.last.row.bottom : range.last.row.bottom) - top;
    var hasTopBorder = range.first.row.idx >= pane.first.row.idx;
    var hasBottomBorder = range.last.row.idx <= pane.last.row.idx;
    var hasRightBorder = range.last.column.idx <= pane.last.column.idx;
    var hasLeftBorder = range.first.column.idx >= pane.first.column.idx;
    return (React.createElement("div", { className: "rg-partial-area " + props.class, key: range.first.column.idx + pane.last.column.idx, style: __assign(__assign({}, style), { top: top - (top === 0 ? 0 : 1), left: left - (left === 0 ? 0 : 1), width: width + (left === 0 ? 0 : 1), height: height + (top === 0 ? 0 : 1), borderTop: hasTopBorder ? (style.borderTop ? style.borderTop : style.border) : '', borderBottom: hasBottomBorder ? (style.borderBottom ? style.borderBottom : style.border) : '', borderRight: hasRightBorder ? (style.borderRight ? style.borderRight : style.border) : '', borderLeft: hasLeftBorder ? (style.borderLeft ? style.borderLeft : style.border) : '' }) }));
};
