import * as React from 'react';
import { tryAppendChange } from '../Functions';
export var CellEditor = function (props) {
    var location = props.state.focusedLocation;
    var _a = React.useState(calculatedEditorPosition(location, props.state)), position = _a[0], setPosition = _a[1];
    React.useEffect(function () { return setPosition(calculatedEditorPosition(location, props.state)); }, []);
    var cellTemplate = props.state.cellTemplates[props.state.currentlyEditedCell.type];
    return (React.createElement("div", { className: "rg-celleditor rg-" + props.state.currentlyEditedCell.type + "-celleditor", style: {
            top: position.top - 1,
            left: position.left - 1,
            height: location.row.height + 1,
            width: location.column.width + 1,
        } }, cellTemplate.render(props.state.currentlyEditedCell, true, function (cell, commit) {
        props.state.currentlyEditedCell = commit ? undefined : cell;
        if (commit)
            props.state.update(function (state) { return tryAppendChange(state, location, cell); });
    })));
};
var calculatedXAxisOffset = function (location, state) {
    if (state.cellMatrix.frozenRightRange.first.column && location.column.idx >= state.cellMatrix.frozenRightRange.first.column.idx) {
        return Math.min(state.cellMatrix.width, state.viewportElement.clientWidth) - state.cellMatrix.frozenRightRange.width;
    }
    else if (location.column.idx > (state.cellMatrix.frozenLeftRange.last.column ? state.cellMatrix.frozenLeftRange.last.column.idx : state.cellMatrix.first.column.idx) || location.column.idx == state.cellMatrix.last.column.idx) {
        return state.cellMatrix.frozenLeftRange.width - state.viewportElement.scrollLeft;
    }
    return 0;
};
var calculatedYAxisOffset = function (location, state) {
    if (state.cellMatrix.frozenBottomRange.first.row && location.row.idx >= state.cellMatrix.frozenBottomRange.first.row.idx) {
        return Math.min(state.cellMatrix.height, state.viewportElement.clientHeight) - state.cellMatrix.frozenBottomRange.height;
    }
    else if (location.row.idx > (state.cellMatrix.frozenTopRange.last.row ? state.cellMatrix.frozenTopRange.last.row.idx : state.cellMatrix.first.row.idx) || location.row.idx == state.cellMatrix.last.row.idx) {
        return state.cellMatrix.frozenTopRange.height - state.viewportElement.scrollTop;
    }
    return 0;
};
var calculatedEditorPosition = function (location, state) {
    return {
        left: location.column.left + calculatedXAxisOffset(location, state),
        top: location.row.top + calculatedYAxisOffset(location, state)
    };
};
