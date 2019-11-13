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
import { focusLocation, keyCodes, getActiveSelectedRange, tryAppendChange, emptyCell } from '.';
import { newLocation } from './newLocation';
import { areLocationsEqual } from './areLocationsEqual';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
export function handleKeyDown(state, event) {
    var newState = handleKeyDownInternal(state, event);
    if (newState !== state) {
        event.stopPropagation();
        event.preventDefault();
    }
    return newState;
}
function handleKeyDownInternal(state, event) {
    var location = state.focusedLocation;
    if (!location)
        return state;
    var _a = getCompatibleCellAndTemplate(state, location), cell = _a.cell, cellTemplate = _a.cellTemplate;
    if (cellTemplate.handleKeyDown && !state.currentlyEditedCell) {
        var _b = cellTemplate.handleKeyDown(cell, event.keyCode, event.ctrlKey, event.shiftKey, event.altKey), newCell = _b.cell, enableEditMode = _b.enableEditMode;
        if (JSON.stringify(newCell) !== JSON.stringify(cell) || enableEditMode) {
            if (enableEditMode) {
                return __assign(__assign({}, state), { currentlyEditedCell: newCell });
            }
            else {
                return tryAppendChange(state, location, newCell);
            }
        }
    }
    if (event.altKey)
        return state;
    var asr = getActiveSelectedRange(state);
    var isSingleCellSelected = state.selectedRanges.length === 1 && areLocationsEqual(asr.first, asr.last);
    if (event.ctrlKey && event.shiftKey) {
        switch (event.keyCode) {
            case keyCodes.HOME:
                return resizeSelection(state, asr.first.column.idx, asr.last.column.idx, 0, asr.last.row.idx);
            case keyCodes.END:
                return resizeSelection(state, asr.first.column.idx, asr.last.column.idx, asr.first.row.idx, state.cellMatrix.last.row.idx);
        }
    }
    else if (event.ctrlKey) {
        switch (event.keyCode) {
            case keyCodes.A:
                var cm = state.cellMatrix;
                return __assign(__assign({}, state), { selectedRanges: [cm.getRange(cm.first, cm.last)], selectionMode: 'range', activeSelectedRangeIdx: 0 });
            case keyCodes.HOME:
                return focusCell(0, 0, state);
            case keyCodes.END:
                return focusLocation(state, state.cellMatrix.last);
            case keyCodes.SPACE:
                return resizeSelection(state, asr.first.column.idx, asr.last.column.idx, 0, state.cellMatrix.last.row.idx);
        }
    }
    else if (event.shiftKey) {
        switch (event.keyCode) {
            case keyCodes.UP_ARROW:
                return resizeSelectionUp(state, asr, location);
            case keyCodes.DOWN_ARROW:
                return resizeSelectionDown(state, asr, location);
            case keyCodes.LEFT_ARROW:
                return resizeSelectionLeft(state, asr, location);
            case keyCodes.RIGHT_ARROW:
                return resizeSelectionRight(state, asr, location);
            case keyCodes.TAB:
                event.preventDefault();
                return isSingleCellSelected ? moveFocusLeft(state) : moveFocusInsideSelectedRange(state, 'left', asr, location);
            case keyCodes.ENTER:
                return isSingleCellSelected ?
                    moveFocusUp(state) :
                    moveFocusInsideSelectedRange(state, 'up', asr, location);
            case keyCodes.SPACE:
                return resizeSelection(state, 0, state.cellMatrix.last.column.idx, asr.first.row.idx, asr.last.row.idx);
            case keyCodes.HOME:
                return resizeSelection(state, 0, asr.last.column.idx, asr.first.row.idx, asr.last.row.idx);
            case keyCodes.END:
                return resizeSelection(state, asr.first.column.idx, state.cellMatrix.last.column.idx, asr.first.row.idx, asr.last.row.idx);
            case keyCodes.PAGE_UP:
            case keyCodes.PAGE_DOWN:
                return state;
        }
    }
    else {
        switch (event.keyCode) {
            case keyCodes.DELETE:
            case keyCodes.BACKSPACE:
                return wipeSelectedRanges(state);
            case keyCodes.UP_ARROW:
                return moveFocusUp(state);
            case keyCodes.DOWN_ARROW:
                return moveFocusDown(state);
            case keyCodes.LEFT_ARROW:
                return moveFocusLeft(state);
            case keyCodes.RIGHT_ARROW:
                return moveFocusRight(state);
            case keyCodes.TAB:
                event.preventDefault();
                return isSingleCellSelected ? moveFocusRight(state) : moveFocusInsideSelectedRange(state, 'right', asr, location);
            case keyCodes.HOME:
                return (state.focusedLocation) ? focusCell(0, state.focusedLocation.row.idx, state) : state;
            case keyCodes.END:
                return (state.focusedLocation) ? focusCell(state.cellMatrix.columns.length - 1, state.focusedLocation.row.idx, state) : state;
            case keyCodes.PAGE_UP:
                return moveFocusPageUp(state);
            case keyCodes.PAGE_DOWN:
                return moveFocusPageDown(state);
            case keyCodes.ENTER:
                return isSingleCellSelected ? __assign(__assign({}, moveFocusDown(state)), { currentlyEditedCell: undefined }) :
                    moveFocusInsideSelectedRange(state, 'down', asr, location);
            case keyCodes.ESC:
                return (state.currentlyEditedCell) ? __assign(__assign({}, state), { currentlyEditedCell: undefined }) : state;
        }
    }
    return state;
}
function focusCell(colIdx, rowIdx, state) {
    var location = state.cellMatrix.getLocation(rowIdx, colIdx);
    return focusLocation(state, location);
}
function moveFocusLeft(state) {
    return (state.focusedLocation && state.focusedLocation.column.idx > 0) ?
        focusCell(state.focusedLocation.column.idx - 1, state.focusedLocation.row.idx, state) : state;
}
function moveFocusRight(state) {
    return (state.focusedLocation && state.focusedLocation.column.idx < state.cellMatrix.last.column.idx) ?
        focusCell(state.focusedLocation.column.idx + 1, state.focusedLocation.row.idx, state) : state;
}
function moveFocusUp(state) {
    return (state.focusedLocation && state.focusedLocation.row.idx > 0) ?
        focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx - 1, state) : state;
}
function moveFocusDown(state) {
    if (state.focusedLocation) {
        if (state.focusedLocation.row.idx == state.cellMatrix.last.row.idx)
            return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx, state);
        return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx + 1, state);
    }
    return state;
}
function moveFocusPageUp(state) {
    if (!state.focusedLocation)
        return state;
    var rowsOnScreen = state.cellMatrix.rows.filter(function (row) { return row.top < state.viewportElement.clientHeight; });
    return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx - rowsOnScreen.length > 0
        ? state.focusedLocation.row.idx - rowsOnScreen.length
        : 0, state);
}
function moveFocusPageDown(state) {
    if (!state.focusedLocation)
        return state;
    var rowsOnScreen = state.cellMatrix.rows
        .slice(state.cellMatrix.frozenTopRange.rows.length, state.cellMatrix.rows.length -
        state.cellMatrix.frozenBottomRange.rows.length -
        1)
        .filter(function (row) { return row.top + row.height < state.viewportElement.clientHeight; });
    return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx + rowsOnScreen.length < state.cellMatrix.rows.length
        ? state.focusedLocation.row.idx +
            rowsOnScreen.length -
            state.cellMatrix.frozenBottomRange.rows.length
        : state.cellMatrix.rows.length - 1, state);
}
function wipeSelectedRanges(state) {
    state.selectedRanges.forEach(function (range) {
        return range.rows.forEach(function (row) {
            return range.columns.forEach(function (column) {
                return state = tryAppendChange(state, { row: row, column: column }, emptyCell);
            });
        });
    });
    return state;
}
function moveFocusInsideSelectedRange(state, direction, asr, location) {
    var selectedRangeIdx = state.activeSelectedRangeIdx;
    var colCount = asr ? asr.columns.length : 0;
    var rowCount = asr ? asr.rows.length : 0;
    var delta = direction === 'up' || direction === 'left' ? -1 : 1;
    var currentPosInRange = direction === 'up' || direction === 'down'
        ? (location.row.idx - asr.first.row.idx) +
            (location.column.idx - asr.first.column.idx) * rowCount
        : (location.row.idx - asr.first.row.idx) * colCount +
            (location.column.idx - asr.first.column.idx);
    var newPosInRange = (currentPosInRange + delta) % (asr.rows.length * asr.columns.length);
    if ((newPosInRange < 0 && currentPosInRange === 0)) {
        var nextSelectionRangeIdx = selectedRangeIdx === 0 ? state.selectedRanges.length - 1 : (selectedRangeIdx - 1) % state.selectedRanges.length;
        var nextSelection = state.selectedRanges[nextSelectionRangeIdx];
        state = focusLocation(state, newLocation(nextSelection.last.row, nextSelection.last.column), false);
        return __assign(__assign({}, state), { activeSelectedRangeIdx: nextSelectionRangeIdx });
    }
    else if (newPosInRange === 0 && currentPosInRange === (asr.rows.length * asr.columns.length) - 1) {
        var nextSelectionRangeIdx = (selectedRangeIdx + 1) % state.selectedRanges.length;
        var nextSelection = state.selectedRanges[nextSelectionRangeIdx];
        state = focusLocation(state, newLocation(nextSelection.first.row, nextSelection.first.column), false);
        return __assign(__assign({}, state), { activeSelectedRangeIdx: nextSelectionRangeIdx });
    }
    else {
        var focusedCellColIdxInRange = direction === 'up' || direction === 'down' ? Math.floor(newPosInRange / rowCount) : newPosInRange % colCount;
        var focusedCellRowIdxInRange = direction === 'up' || direction === 'down' ? newPosInRange % rowCount : Math.floor(newPosInRange / colCount);
        var focusedCellColIdx = asr.first.column.idx + focusedCellColIdxInRange;
        var focusedCellRowIdx = asr.first.row.idx + focusedCellRowIdxInRange;
        state = focusLocation(state, state.cellMatrix.getLocation(focusedCellRowIdx, focusedCellColIdx), asr ? (asr.columns.length > 1 || asr.rows.length > 1 ? false : true) : true);
        return state;
    }
}
function resizeSelectionUp(state, asr, location) {
    return (asr.first.row.idx > 0) ?
        (asr.last.row.idx > location.row.idx) ?
            resizeSelection(state, asr.first.column.idx, asr.last.column.idx, asr.first.row.idx, asr.last.row.idx - 1) :
            resizeSelection(state, asr.last.column.idx, asr.first.column.idx, asr.last.row.idx, asr.first.row.idx - 1) :
        state;
}
function resizeSelectionDown(state, asr, location) {
    return (asr.last.row.idx < state.cellMatrix.last.row.idx) ?
        (asr.first.row.idx < location.row.idx) ?
            resizeSelection(state, asr.last.column.idx, asr.first.column.idx, asr.last.row.idx, asr.first.row.idx + 1) :
            resizeSelection(state, asr.first.column.idx, asr.last.column.idx, asr.first.row.idx, asr.last.row.idx + 1) :
        state;
}
function resizeSelectionLeft(state, asr, location) {
    return (asr.first.column.idx > 0) ?
        (asr.last.column.idx > location.column.idx) ?
            resizeSelection(state, asr.first.column.idx, asr.last.column.idx - 1, asr.first.row.idx, asr.last.row.idx) :
            resizeSelection(state, asr.last.column.idx, asr.first.column.idx - 1, asr.last.row.idx, asr.first.row.idx) :
        state;
}
function resizeSelectionRight(state, asr, location) {
    return (asr.last.column.idx < state.cellMatrix.last.column.idx) ?
        (asr.first.column.idx < location.column.idx) ?
            resizeSelection(state, asr.last.column.idx, asr.first.column.idx + 1, asr.last.row.idx, asr.first.row.idx) :
            resizeSelection(state, asr.first.column.idx, asr.last.column.idx + 1, asr.first.row.idx, asr.last.row.idx) :
        state;
}
function resizeSelection(state, firstColIdx, lastColIdx, firstRowIdx, lastRowIdx) {
    if (state.disableRangeSelection)
        return state;
    var start = state.cellMatrix.getLocation(firstRowIdx, firstColIdx);
    var end = state.cellMatrix.getLocation(lastRowIdx, lastColIdx);
    var selectedRanges = state.selectedRanges.slice();
    selectedRanges[state.activeSelectedRangeIdx] = state.cellMatrix.getRange(start, end);
    return __assign(__assign({}, state), { selectedRanges: selectedRanges });
}
