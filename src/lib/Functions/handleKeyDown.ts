import { State, KeyboardEvent, Location, Range } from '../Model';
import { focusLocation, keyCodes, getActiveSelectedRange, tryAppendChange, emptyCell, scrollIntoView } from '.';
import { newLocation } from './newLocation';
import { areLocationsEqual } from './areLocationsEqual';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';

export function handleKeyDown(state: State, event: KeyboardEvent): State {
    const newState = handleKeyDownInternal(state, event);
    if (newState !== state) { event.stopPropagation(); event.preventDefault(); }
    return newState;
}

function handleKeyDownInternal(state: State, event: KeyboardEvent): State {
    const location = state.focusedLocation;
    if (!location)
        return state

    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    if (cellTemplate.handleKeyDown && !state.currentlyEditedCell) { // TODO need add !(event.shiftKey && event.keyCode === keyCodes.SPACE) to working keycodes (shift + space) in a lower condition
        const { cell: newCell, enableEditMode } = cellTemplate.handleKeyDown(cell, event.keyCode, event.ctrlKey, event.shiftKey, event.altKey);
        if (JSON.stringify(newCell) !== JSON.stringify(cell) || enableEditMode) {
            if (enableEditMode) {
                return { ...state, currentlyEditedCell: newCell }
            } else {
                return tryAppendChange(state, location, newCell);
            }
        }
    }

    if (event.altKey)
        return state;

    const asr = getActiveSelectedRange(state);
    const isSingleCellSelected = state.selectedRanges.length === 1 && areLocationsEqual(asr.first, asr.last);

    if (event.ctrlKey && event.shiftKey) {

        switch (event.keyCode) {
            case keyCodes.HOME:
                return resizeSelection(state, asr.first.column.idx, asr.last.column.idx, 0, asr.last.row.idx);
            case keyCodes.END:
                return resizeSelection(state, asr.first.column.idx, asr.last.column.idx, asr.first.row.idx, state.cellMatrix.last.row.idx)
        }

    } else if (event.ctrlKey) {

        switch (event.keyCode) {

            case keyCodes.KEY_A:
                const cm = state.cellMatrix;
                return { ...state, selectedRanges: [cm.getRange(cm.first, cm.last)], selectionMode: 'range', activeSelectedRangeIdx: 0 }
            case keyCodes.HOME:
                return focusCell(0, 0, state);
            case keyCodes.END:
                return focusLocation(state, state.cellMatrix.last);
            case keyCodes.SPACE:
                return resizeSelection(state, asr.first.column.idx, asr.last.column.idx, 0, state.cellMatrix.last.row.idx);
        }


    } else if (event.shiftKey) {

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
                event.preventDefault(); // prevent from leaving HFE
                return isSingleCellSelected ? moveFocusLeft(state) : moveFocusInsideSelectedRange(state, 'left', asr, location);
            case keyCodes.ENTER:
                state.hiddenFocusElement.focus();
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
                // TODO resizeSelection
                return state;

        }

    } else {
        // === NO SHIFT OR CONTROL ===
        state.hiddenFocusElement.focus();
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
                event.preventDefault(); // prevent from leaving HFE
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
                return isSingleCellSelected ?
                    { ...moveFocusDown(state), currentlyEditedCell: undefined } :
                    moveFocusInsideSelectedRange(state, 'down', asr, location);
            case keyCodes.ESCAPE:
                return (state.currentlyEditedCell) ? { ...state, currentlyEditedCell: undefined } : state
        }
    }
    return state;

}

function focusCell(colIdx: number, rowIdx: number, state: State): State {
    const location = state.cellMatrix.getLocation(rowIdx, colIdx);
    return focusLocation(state, location);
}

function moveFocusLeft(state: State): State {
    return (state.focusedLocation && state.focusedLocation.column.idx > 0) ?
        focusCell(state.focusedLocation.column.idx - 1, state.focusedLocation.row.idx, state) : state;
}

function moveFocusRight(state: State): State {
    return (state.focusedLocation && state.focusedLocation.column.idx < state.cellMatrix.last.column.idx) ?
        focusCell(state.focusedLocation.column.idx + 1, state.focusedLocation.row.idx, state) : state;
}

function moveFocusUp(state: State): State {
    return (state.focusedLocation && state.focusedLocation.row.idx > 0) ?
        focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx - 1, state) : state;
}

function moveFocusDown(state: State): State {
    if (state.focusedLocation) {
        if (state.focusedLocation.row.idx == state.cellMatrix.last.row.idx)
            return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx, state)
        return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx + 1, state)
    }
    return state;
}

// TODO this should be rewritten
function moveFocusPageUp(state: State): State {
    if (!state.focusedLocation)
        return state;
    const rowsOnScreen = state.cellMatrix.rows.filter(
        row => row.top < state.viewportElement.clientHeight
    );
    return focusCell(
        state.focusedLocation.column.idx,
        state.focusedLocation.row.idx - rowsOnScreen.length > 0
            ? state.focusedLocation.row.idx - rowsOnScreen.length
            : 0, state
    );
}


// TODO this should be rewritten
function moveFocusPageDown(state: State): State {
    if (!state.focusedLocation)
        return state;

    const rowsOnScreen = state.cellMatrix.rows
        .slice(
            state.cellMatrix.frozenTopRange.rows.length,
            state.cellMatrix.rows.length -
            state.cellMatrix.frozenBottomRange.rows.length -
            1
        )
        .filter(row => row.top + row.height < state.viewportElement.clientHeight);
    return focusCell(
        state.focusedLocation.column.idx,
        state.focusedLocation.row.idx + rowsOnScreen.length < state.cellMatrix.rows.length
            ? state.focusedLocation.row.idx +
            rowsOnScreen.length -
            state.cellMatrix.frozenBottomRange.rows.length
            : state.cellMatrix.rows.length - 1, state
    );
}

function wipeSelectedRanges(state: State): State {
    state.selectedRanges.forEach(range =>
        range.rows.forEach(row =>
            range.columns.forEach(column =>
                state = tryAppendChange(state, { row, column }, emptyCell)
            )
        )
    )
    return state;
}

function moveFocusInsideSelectedRange(state: State, direction: 'left' | 'right' | 'up' | 'down', asr: Range, location: Location): State {
    const selectedRangeIdx = state.activeSelectedRangeIdx
    const colCount = asr ? asr.columns.length : 0;
    const rowCount = asr ? asr.rows.length : 0;
    const delta = direction === 'up' || direction === 'left' ? -1 : 1;

    const currentPosInRange =
        direction === 'up' || direction === 'down'
            ? (location.row.idx - asr.first.row.idx) +
            (location.column.idx - asr.first.column.idx) * rowCount
            : (location.row.idx - asr.first.row.idx) * colCount +
            (location.column.idx - asr.first.column.idx);

    const newPosInRange = (currentPosInRange + delta) % (asr.rows.length * asr.columns.length);

    if ((newPosInRange < 0 && currentPosInRange === 0)) { // shift + tab/enter and first cell focused in active range
        const nextSelectionRangeIdx = selectedRangeIdx === 0 ? state.selectedRanges.length - 1 : (selectedRangeIdx - 1) % state.selectedRanges.length;
        const nextSelection = state.selectedRanges[nextSelectionRangeIdx];
        state = focusLocation(state, newLocation(nextSelection.last.row, nextSelection.last.column), false);
        return { ...state, activeSelectedRangeIdx: nextSelectionRangeIdx }
    } else if (newPosInRange === 0 && currentPosInRange === (asr.rows.length * asr.columns.length) - 1) { // tab/enter and last cell focused in active range
        const nextSelectionRangeIdx = (selectedRangeIdx + 1) % state.selectedRanges.length;
        const nextSelection = state.selectedRanges[nextSelectionRangeIdx];
        state = focusLocation(state, newLocation(nextSelection.first.row, nextSelection.first.column), false);
        return { ...state, activeSelectedRangeIdx: nextSelectionRangeIdx }
    } else { // tab/enter and all cells inside active range except last cell && shift + tab/enter and all cells inside active range except first cell
        const focusedCellColIdxInRange = direction === 'up' || direction === 'down' ? Math.floor(newPosInRange / rowCount) : newPosInRange % colCount;
        const focusedCellRowIdxInRange = direction === 'up' || direction === 'down' ? newPosInRange % rowCount : Math.floor(newPosInRange / colCount)
        const focusedCellColIdx = asr.first.column.idx + focusedCellColIdxInRange;
        const focusedCellRowIdx = asr.first.row.idx + focusedCellRowIdxInRange;
        state = focusLocation(
            state,
            state.cellMatrix.getLocation(focusedCellRowIdx, focusedCellColIdx),
            asr ? (asr.columns.length > 1 || asr.rows.length > 1 ? false : true) : true
        );
        return state;
    }
}

function resizeSelectionUp(state: State, asr: Range, location: Location): State {
    return (asr.first.row.idx > 0) ?
        (asr.last.row.idx > location.row.idx) ?
            resizeSelection(state, asr.first.column.idx, asr.last.column.idx, asr.first.row.idx, asr.last.row.idx - 1, 'up') :
            resizeSelection(state, asr.last.column.idx, asr.first.column.idx, asr.last.row.idx, asr.first.row.idx - 1, 'up') :
        state;
}

function resizeSelectionDown(state: State, asr: Range, location: Location): State {
    return (asr.last.row.idx < state.cellMatrix.last.row.idx) ?
        (asr.first.row.idx < location.row.idx) ?
            resizeSelection(state, asr.last.column.idx, asr.first.column.idx, asr.last.row.idx, asr.first.row.idx + 1, 'down') :
            resizeSelection(state, asr.first.column.idx, asr.last.column.idx, asr.first.row.idx, asr.last.row.idx + 1, 'down') :
        state;
}

function resizeSelectionLeft(state: State, asr: Range, location: Location): State {
    return (asr.first.column.idx > 0) ?
        (asr.last.column.idx > location.column.idx) ?
            resizeSelection(state, asr.first.column.idx, asr.last.column.idx - 1, asr.first.row.idx, asr.last.row.idx, 'left') :
            resizeSelection(state, asr.last.column.idx, asr.first.column.idx - 1, asr.last.row.idx, asr.first.row.idx, 'left') :
        state;
}

function resizeSelectionRight(state: State, asr: Range, location: Location): State {
    return (asr.last.column.idx < state.cellMatrix.last.column.idx) ?
        (asr.first.column.idx < location.column.idx) ?
            resizeSelection(state, asr.last.column.idx, asr.first.column.idx + 1, asr.last.row.idx, asr.first.row.idx, 'right') :
            resizeSelection(state, asr.first.column.idx, asr.last.column.idx + 1, asr.first.row.idx, asr.last.row.idx, 'right') :
        state;
}

function resizeSelection(state: State, firstColIdx: number, lastColIdx: number, firstRowIdx: number, lastRowIdx: number, scrollDirection?: 'left' | 'right' | 'up' | 'down'): State {
    if (state.disableRangeSelection)
        return state;

    const start = state.cellMatrix.getLocation(firstRowIdx, firstColIdx);
    const end = state.cellMatrix.getLocation(lastRowIdx, lastColIdx);
    let selectedRanges = state.selectedRanges.slice();
    selectedRanges[state.activeSelectedRangeIdx] = state.cellMatrix.getRange(start, end);
    if (scrollDirection) {
        const location = state.focusedLocation;
        switch (scrollDirection) {
            case 'left':
            case 'right':
                const colIdx = location!.column.idx !== firstColIdx ? firstColIdx : lastColIdx;
                scrollIntoView(state, state.cellMatrix.getLocation(location!.row.idx, colIdx), 'horizontal');
                break;
            case 'up':
            case 'down':
                const rowIdx = location!.row.idx !== firstRowIdx ? firstRowIdx : lastRowIdx;
                scrollIntoView(state, state.cellMatrix.getLocation(rowIdx, location!.column.idx), 'vertical');
                break;
            default:
                break;
        }
    }

    return { ...state, selectedRanges };
}

