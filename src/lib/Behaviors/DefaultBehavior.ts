import { State, Behavior, KeyboardEvent, ClipboardEvent, PointerEvent, Location, PointerLocation, SelectionMode, Cell, CompatibleCell } from '../Model';
import { handleKeyDown } from '../Functions/handleKeyDown';
import { CellSelectionBehavior } from './CellSelectionBehavior';
import { ColumnSelectionBehavior } from './ColumnSelectionBehavior';
import { ColumnReorderBehavior } from './ColumnReorderBehavior';
import { RowSelectionBehavior } from './RowSelectionBehavior';
import { RowReorderBehavior } from './RowReorderBehavior';
import { getActiveSelectedRange } from '../Functions/getActiveSelectedRange';
import { tryAppendChange, keyCodes, emptyCell } from '../Functions';
import { FillHandleBehavior } from './FillHandleBehavior';
import { getLocationFromClient, focusLocation } from '../Functions';
import { ResizeColumnBehavior } from './ResizeColumnBehavior';

export class DefaultBehavior extends Behavior {
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State {
        state = { ...state, currentBehavior: this.getNewBehavior(event, location, state) };
        return state.currentBehavior.handlePointerDown(event, location, state);
    }

    private getNewBehavior(event: any, location: PointerLocation, state: State): Behavior {
        // changing behavior will disable all keyboard event handlers
        if (event.pointerType === 'mouse' && location.row.idx == 0 && location.cellX > location.column.width - 7 && location.column.onResize) {
            return new ResizeColumnBehavior();
        } else if (location.row.idx == 0 && state.selectedIds.includes(location.column.columnId) && !event.ctrlKey && state.selectionMode == 'column' && location.column.reorderable) {
            return new ColumnReorderBehavior();
        } else if (location.row.idx == 0 && (event.target.className !== 'dg-fill-handle' && event.target.className !== 'dg-touch-fill-handle')) {
            return new ColumnSelectionBehavior();
        } else if (location.column.idx == 0 && state.selectedIds.includes(location.row.rowId) && !event.ctrlKey && state.selectionMode == 'row' && location.row.reorderable) {
            return new RowReorderBehavior();
        } else if (location.column.idx == 0 && (event.target.className !== 'dg-fill-handle' && event.target.className !== 'dg-touch-fill-handle')) {
            return new RowSelectionBehavior();
        } else if ((event.pointerType === 'mouse' || event.pointerType === undefined) && event.target.className === 'dg-fill-handle' && !state.disableFillHandle) {
            // event.pointerType === undefined -> for cypress tests (is always undefined)
            return new FillHandleBehavior();
        } else {
            return new CellSelectionBehavior();
        }
    }

    handleContextMenu(event: PointerEvent, state: State): State {
        event.preventDefault();
        const clickX = event.clientX;
        const clickY = event.clientY;
        const top = window.innerHeight - clickY > 25;
        const right = window.innerWidth - clickX > 120;
        const bottom = !top;
        const left = !right;
        let contextMenuPosition = state.contextMenuPosition;
        if (top) {
            contextMenuPosition[0] = clickY;
        }
        if (right) {
            contextMenuPosition[1] = clickX + 5;
        }
        if (bottom) {
            contextMenuPosition[0] = clickY - 25 - 5;
        }
        if (left) {
            contextMenuPosition[1] = clickX - 120 - 5;
        }
        const focusedLocation = getLocationFromClient(state, clickX, clickY);
        if (!state.selectedRanges.find(range => range.contains(focusedLocation))) {
            state = focusLocation(state, focusedLocation);
        }
        return {
            ...state,
            contextMenuPosition
        };
    }

    handleDoubleClick(event: PointerEvent, location: Location, state: State): State {
        // TODO remove if it works without
        // if (state.currentlyEditedCell) {
        //     event.preventDefault();
        //     event.stopPropagation();
        // } else
        if (state.focusedLocation && location.equals(state.focusedLocation)) {
            const cellTemplate = state.cellTemplates[location.cell.type];
            const validatedCell = cellTemplate.validate(location.cell);
            if (cellTemplate.handleKeyDown) {
                const { cell, enableEditMode } = cellTemplate.handleKeyDown(validatedCell, 1, event.ctrlKey, event.shiftKey, event.altKey);
                if (enableEditMode) {
                    return { ...state, currentlyEditedCell: cell };
                }
            }
        }
        return state;
    }

    handleKeyDown(event: KeyboardEvent, state: State): State {
        return handleKeyDown(state, event);
    }

    handleKeyUp(event: KeyboardEvent, state: State): State {
        if (event.keyCode === keyCodes.TAB || event.keyCode === keyCodes.ENTER) {
            event.preventDefault();
            event.stopPropagation();
        }
        return state;
    }

    handleCopy(event: ClipboardEvent, state: State): State {
        copySelectedRangeToClipboard(state);
        event.preventDefault();
        return state;
    }

    handlePaste(event: ClipboardEvent, state: State): State {
        const activeSelectedRange = getActiveSelectedRange(state);
        if (!activeSelectedRange) {
            return state;
        }
        let pasteContent: CompatibleCell[][] = [];
        const htmlData = event.clipboardData.getData('text/html');
        const parsedData = new DOMParser().parseFromString(htmlData, 'text/html');
        const selectionMode = parsedData.body.firstElementChild && (parsedData.body.firstElementChild.getAttribute('data-selection') as SelectionMode);
        if (htmlData && parsedData.body.firstElementChild!.getAttribute('data-key') === 'dynagrid') {
            const cells = parsedData.body.firstElementChild!.firstElementChild!.children;
            for (let i = 0; i < cells.length; i++) {
                const row: CompatibleCell[] = [];
                for (let j = 0; j < cells[i].children.length; j++) {
                    // TODO Use REACT-GRID in attribute
                    const rawData = cells[i].children[j].getAttribute('data-data');
                    const data = rawData && JSON.parse(rawData);
                    const type = cells[i].children[j].getAttribute('data-type');
                    const textValue = data ? cells[i].children[j].innerHTML : '';
                    row.push({ ...data, text: textValue, type: type || 'text' } as CompatibleCell);
                }
                pasteContent.push(row);
            }
        } else {
            pasteContent = event.clipboardData
                .getData('text/plain')
                .split('\n')
                .map(line => line.split('\t').map(t => ({ type: 'text', text: t })));
        }
        event.preventDefault();
        return { ...pasteData(state, pasteContent), selectionMode: selectionMode || 'range' };
    }

    handleCut(event: ClipboardEvent, state: State): State {
        copySelectedRangeToClipboard(state, true);
        event.preventDefault();
        return { ...state };
    }
}

export function pasteData(state: State, pasteContent: CompatibleCell[][]): State {
    const activeSelectedRange = getActiveSelectedRange(state);
    if (pasteContent.length === 1 && pasteContent[0].length === 1) {
        activeSelectedRange.rows.forEach(row =>
            activeSelectedRange.cols.forEach(col => {
                state = tryAppendChange(state, new Location(row, col), pasteContent[0][0]);
            })
        );
    } else {
        let lastLocation: Location;
        const cellMatrix = state.cellMatrix;
        pasteContent.forEach((row, pasteRowIdx) =>
            row.forEach((pasteValue, pasteColIdx) => {
                const rowIdx = activeSelectedRange.rows[0].idx + pasteRowIdx;
                const colIdx = activeSelectedRange.cols[0].idx + pasteColIdx;
                if (rowIdx <= cellMatrix.last.row.idx && colIdx <= cellMatrix.last.column.idx) {
                    lastLocation = cellMatrix.getLocation(rowIdx, colIdx);
                    state = tryAppendChange(state, lastLocation, pasteValue);
                }
            })
        );
        return {
            ...state,
            selectedRanges: [cellMatrix.getRange(activeSelectedRange.first, lastLocation!)],
            activeSelectedRangeIdx: 0
        };
    }
    return state;
}

export function copySelectedRangeToClipboard(state: State, removeValues = false) {
    const div = document.createElement('div');
    const table = document.createElement('table');
    table.setAttribute('empty-cells', 'show');
    table.setAttribute('data-key', 'dynagrid');
    table.setAttribute('data-selection', state.selectionMode);
    const activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) return;
    activeSelectedRange.rows.forEach(row => {
        const tableRow = table.insertRow();
        activeSelectedRange.cols.forEach(col => {
            const tableCell = tableRow.insertCell();
            const cell = state.cellMatrix.getCell(row.rowId, col.columnId)!;
            const validatedCell = state.cellTemplates[cell.type].validate(cell);
            tableCell.textContent = validatedCell.text; // for undefined values
            if (!validatedCell.text) {
                tableCell.innerHTML = '<img>';
            }
            tableCell.setAttribute('data-data', JSON.stringify(cell));
            tableCell.setAttribute('data-type', cell.type);
            tableCell.style.border = '1px solid #D3D3D3';
            if (removeValues) {
                state = tryAppendChange(state, new Location(row, col), emptyCell);
            }
        });
    });
    div.setAttribute('contenteditable', 'true');
    div.appendChild(table);
    document.body.appendChild(div);
    div.focus();
    document.execCommand('selectAll', false, undefined);
    document.execCommand('copy');
    document.body.removeChild(div);
    state.hiddenFocusElement.focus();
}

