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
import { trySetDataAndAppendChange } from "../Functions";
export var CellEditor = function (props) {
    var _a = React.useState(props.state.currentlyEditedCell), cell = _a[0], setCell = _a[1];
    var location = props.state.focusedLocation;
    var _b = React.useState(calculatedEditorPosition(location, props.state)), position = _b[0], setPosition = _b[1];
    React.useEffect(function () { return setPosition(calculatedEditorPosition(location, props.state)); }, []);
    var cellTemplate = props.state.cellTemplates[cell.type];
    var customStyle = cellTemplate.getCustomStyle ? cellTemplate.getCustomStyle(cell.data, true) : {};
    return (React.createElement("div", { className: "rg-celleditor", style: __assign({ top: position.top - 1, left: position.left - 1, height: location.row.height + 1, width: location.col.width + 1 }, customStyle) }, cellTemplate.renderContent({
        cellData: cell.data,
        isInEditMode: true,
        onCellDataChanged: function (cellData, commit) {
            var newCell = { data: cellData, type: cell.type };
            props.state.currentlyEditedCell = commit ? undefined : newCell;
            if (commit)
                props.state.updateState(function (state) { return trySetDataAndAppendChange(state, location, newCell); });
            else
                setCell(newCell);
        }
    })));
};
var calculatedXAxisOffset = function (location, state) {
    if (state.cellMatrix.frozenRightRange.first.col && location.col.idx >= state.cellMatrix.frozenRightRange.first.col.idx) {
        return Math.min(state.cellMatrix.width, state.viewportElement.clientWidth) - state.cellMatrix.frozenRightRange.width;
    }
    else if (location.col.idx > (state.cellMatrix.frozenLeftRange.last.col ? state.cellMatrix.frozenLeftRange.last.col.idx : state.cellMatrix.first.col.idx) ||
        location.col.idx == state.cellMatrix.last.col.idx) {
        return state.cellMatrix.frozenLeftRange.width - state.viewportElement.scrollLeft;
    }
    return 0;
};
var calculatedYAxisOffset = function (location, state) {
    if (state.cellMatrix.frozenBottomRange.first.row && location.row.idx >= state.cellMatrix.frozenBottomRange.first.row.idx) {
        return Math.min(state.cellMatrix.height, state.viewportElement.clientHeight) - state.cellMatrix.frozenBottomRange.height;
    }
    else if (location.row.idx > (state.cellMatrix.frozenTopRange.last.row ? state.cellMatrix.frozenTopRange.last.row.idx : state.cellMatrix.first.row.idx) ||
        location.row.idx == state.cellMatrix.last.row.idx) {
        return state.cellMatrix.frozenTopRange.height - state.viewportElement.scrollTop;
    }
    return 0;
};
var calculatedEditorPosition = function (location, state) {
    return {
        left: location.col.left + calculatedXAxisOffset(location, state),
        top: location.row.top + calculatedYAxisOffset(location, state)
    };
};
