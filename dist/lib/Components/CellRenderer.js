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
import { ResizeHandle } from "./ResizeHandle";
export var CellRenderer = function (props) {
    var state = __assign({}, props.state);
    var location = props.location;
    var cell = location.cell;
    var isFocused = (state.focusedLocation !== undefined) && (state.focusedLocation.col.idx === props.location.col.idx && state.focusedLocation.row.idx === props.location.row.idx);
    var cellTemplate = state.cellTemplates[cell.type];
    var style = __assign({ left: location.col.left, top: location.row.top, width: location.col.width, height: location.row.height }, (cellTemplate.getCustomStyle && cellTemplate.getCustomStyle(cell.data, false, props) || {}), { touchAction: isFocused || props.state.cellMatrix.getCell(props.location.row.id, props.location.col.id).type === 'header' ? 'none' : 'auto' });
    return (React.createElement("div", { className: "cell", style: style },
        cellTemplate.renderContent({
            cellData: props.state.cellTemplates[cell.type].isValid(cell.data) ? cell.data : '',
            isInEditMode: false,
            props: cell.props,
            onCellDataChanged: function (cellData, commit) {
                if (!commit)
                    throw 'commit should be set to true.';
                props.state.updateState(function (state) { return trySetDataAndAppendChange(state, location, { data: cellData, type: cell.type }); });
            }
        }),
        location.row.idx === 0 && location.col.resizable && React.createElement(ResizeHandle, null)));
};
