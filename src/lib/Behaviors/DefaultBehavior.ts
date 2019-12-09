import { State, Behavior, KeyboardEvent, ClipboardEvent, PointerEvent, Location, PointerLocation, Compatible, Cell } from "../Model";
import { handleKeyDown } from "../Functions/handleKeyDown";
import { CellSelectionBehavior } from "./CellSelectionBehavior";
import { ColumnSelectionBehavior } from "./ColumnSelectionBehavior";
import { ColumnReorderBehavior } from "./ColumnReorderBehavior";
import { RowSelectionBehavior } from "./RowSelectionBehavior";
import { RowReorderBehavior } from "./RowReorderBehavior";
import { getActiveSelectedRange } from "../Functions/getActiveSelectedRange";
import { keyCodes, tryAppendChange, emptyCell, FocusEvent } from "../Functions";
import { FillHandleBehavior } from "./FillHandleBehavior";
import { getLocationFromClient, focusLocation } from "../Functions";
import { ResizeColumnBehavior } from "./ResizeColumnBehavior";
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { areLocationsEqual } from '../Functions/areLocationsEqual';

export class DefaultBehavior extends Behavior {

    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State {
        state = { ...state, currentBehavior: this.getNewBehavior(event, location, state), contextMenuPosition: { top: -1, left: -1 } }
        return state.currentBehavior.handlePointerDown(event, location, state);
    }

    // TODO why any?
    private getNewBehavior(event: any, location: PointerLocation, state: State): Behavior {
        // changing behavior will disable all keyboard event handlers
        if (event.pointerType === 'mouse' && location.row.idx == 0 && location.cellX > location.column.width - 7 && location.column.resizable) {
            return new ResizeColumnBehavior();
        } else if (state.enableColumnSelection && location.row.idx == 0 && state.selectedIds.includes(location.column.columnId) && !event.ctrlKey && state.selectionMode == 'column' && location.column.reorderable) {
            return new ColumnReorderBehavior();
        } else if (state.enableColumnSelection && location.row.idx == 0 && (event.target.className !== 'rg-fill-handle' && event.target.className !== 'rg-touch-fill-handle')) {
            return new ColumnSelectionBehavior();
        } else if (state.enableRowSelection && location.column.idx == 0 && state.selectedIds.includes(location.row.rowId) && !event.ctrlKey && state.selectionMode == 'row' && location.row.reorderable) {
            return new RowReorderBehavior();
        } else if (state.enableRowSelection && location.column.idx == 0 && (event.target.className !== 'rg-fill-handle' && event.target.className !== 'rg-touch-fill-handle')) {
            return new RowSelectionBehavior();
        } else if ((event.pointerType === 'mouse' || event.pointerType === undefined) && event.target.className === 'rg-fill-handle' && !state.disableFillHandle) { // event.pointerType === undefined -> for cypress tests (is always undefined)
            return new FillHandleBehavior();
        } else {
            return new CellSelectionBehavior();
        }
    }

    handleContextMenu(event: PointerEvent, state: State): State {
        event.preventDefault();
        const clickX = event.clientX
        const clickY = event.clientY
        const top = window.innerHeight - clickY > 25;
        const right = window.innerWidth - clickX > 120;
        const bottom = !top;
        const left = !right;
        let contextMenuPosition = state.contextMenuPosition;
        if (top) { contextMenuPosition.top = clickY; }
        if (right) { contextMenuPosition.left = clickX + 5; }
        if (bottom) { contextMenuPosition.top = clickY - 25 - 5; }
        if (left) { contextMenuPosition.left = clickX - 120 - 5; }
        const focusedLocation = getLocationFromClient(state, clickX, clickY);
        if (!state.selectedRanges.find(range => range.contains(focusedLocation))) {
            state = focusLocation(state, focusedLocation)
        }
        return {
            ...state,
            contextMenuPosition
        }
    }

    handleDoubleClick(event: PointerEvent, location: Location, state: State): State {
        if (areLocationsEqual(location, state.focusedLocation)) {
            const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
            //const cellTemplate = state.cellTemplates[location.cell.type];
            if (cellTemplate.handleKeyDown) {
                const { cell: newCell, enableEditMode } = cellTemplate.handleKeyDown(cell, 1, event.ctrlKey, event.shiftKey, event.altKey);
                if (enableEditMode) {
                    return { ...state, currentlyEditedCell: newCell };
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
        const activeSelectedRange = getActiveSelectedRange(state)
        if (!activeSelectedRange) {
            return state;
        }
        let pastedRows: Compatible<Cell>[][] = [];
        const htmlData = event.clipboardData.getData('text/html');
        const document = new DOMParser().parseFromString(htmlData, 'text/html')
        // TODO Do we need selection mode here ?
        //const selectionMode = parsedData.body.firstElementChild && parsedData.body.firstElementChild.getAttribute('data-selection') as SelectionMode;
        // TODO quite insecure! maybe do some checks ?
        if (htmlData && document.body.firstElementChild!.getAttribute('data-reactgrid') === 'reactgrid') {
            const tableRows = document.body.firstElementChild!.firstElementChild!.children
            for (let ri = 0; ri < tableRows.length; ri++) {
                const row: Compatible<Cell>[] = [];
                for (let ci = 0; ci < tableRows[ri].children.length; ci++) {
                    const rawData = tableRows[ri].children[ci].getAttribute('data-reactgrid');
                    const data = rawData && JSON.parse(rawData);
                    row.push(data ? data : { type: 'text', text: tableRows[ri].children[ci].innerHTML })
                }
                pastedRows.push(row)
            }
        } else {
            pastedRows = event.clipboardData.getData('text/plain').split('\n').map(line => line.split('\t').map(t => ({ type: 'text', text: t, value: parseFloat(t) })))
        }
        event.preventDefault()
        return { ...pasteData(state, pastedRows) } //`, selectionMode: selectionMode || 'range' };
    }

    handleCut(event: ClipboardEvent, state: State): State {
        copySelectedRangeToClipboard(state, true)
        event.preventDefault()
        return { ...state };
    }

    handleBlur(event: FocusEvent, state: State): State {
        return {
            ...state,
            ...((event.target !== state.hiddenFocusElement) && { currentlyEditedCell: undefined })
        }
    }

}

export function pasteData(state: State, rows: Compatible<Cell>[][]): State {
    const activeSelectedRange = getActiveSelectedRange(state)
    if (rows.length === 1 && rows[0].length === 1) {
        activeSelectedRange.rows.forEach(row =>
            activeSelectedRange.columns.forEach(column => {
                state = tryAppendChange(state, { row, column }, rows[0][0])
            })
        )
    } else {
        let lastLocation: Location
        const cellMatrix = state.cellMatrix
        rows.forEach((row, ri) =>
            row.forEach((cell, ci) => {
                const rowIdx = activeSelectedRange.first.row.idx + ri
                const columnIdx = activeSelectedRange.first.column.idx + ci
                if (rowIdx <= cellMatrix.last.row.idx && columnIdx <= cellMatrix.last.column.idx) {
                    lastLocation = cellMatrix.getLocation(rowIdx, columnIdx)
                    state = tryAppendChange(state, lastLocation, cell)
                }
            })
        )
        return {
            ...state,
            selectedRanges: [cellMatrix.getRange(activeSelectedRange.first, lastLocation!)],
            activeSelectedRangeIdx: 0,
        }
    }
    return state
}

export function copySelectedRangeToClipboard(state: State, removeValues = false) {
    const activeSelectedRange = getActiveSelectedRange(state)
    if (!activeSelectedRange)
        return

    const div = document.createElement('div')
    const table = document.createElement('table')
    table.setAttribute('empty-cells', 'show')
    table.setAttribute('data-reactgrid', 'reactgrid')
    //table.setAttribute('data-selection', state.selectionMode)
    activeSelectedRange.rows.forEach(row => {
        const tableRow = table.insertRow()
        activeSelectedRange.columns.forEach(column => {
            const tableCell = tableRow.insertCell()
            const { cell } = getCompatibleCellAndTemplate(state, { row, column });
            tableCell.textContent = cell.text;  // for undefined values
            // TODO this was for empty cells. Still need it ?
            // if (!cell.data) {
            //     tableCell.innerHTML = '<img>';
            // }
            tableCell.setAttribute('data-reactgrid', JSON.stringify(cell))
            tableCell.style.border = '1px solid #D3D3D3'
            if (removeValues) {
                state = tryAppendChange(state, { row, column }, emptyCell);
            }
        })
    })
    div.setAttribute('contenteditable', 'true')
    div.appendChild(table)
    document.body.appendChild(div)
    div.focus()
    document.execCommand('selectAll', false, undefined)
    document.execCommand('copy')
    document.body.removeChild(div);
    state.hiddenFocusElement.focus();
}

// TODO here?
export function copySelectedRangeToClipboardInIE(state: State, removeValues = false) {
    // const div = document.createElement('div')
    // const activeSelectedRange = getActiveSelectedRange(state)
    // if (!activeSelectedRange)
    //     return

    // let text = '';
    // activeSelectedRange.rows.forEach((row, rowIdx) => {
    //     activeSelectedRange.cols.forEach((column, colIdx) => {
    //         const prevCol = (colIdx - 1 >= 0) ? activeSelectedRange.cols[colIdx - 1] : undefined;
    //         const nextCol = (colIdx + 1 < activeSelectedRange.cols.length) ? activeSelectedRange.cols[colIdx + 1] : undefined;
    //         const cell = state.cellMatrix.getCell(row.rowId, column.columnId);
    //         const prevCell = prevCol ? state.cellMatrix.getCell(row.rowId, prevCol.columnId) : undefined;
    //         const nextCell = nextCol ? state.cellMatrix.getCell(row.rowId, nextCol.columnId : undefined;
    //         const cellData = cell.data ? cell.data.toString() : '';
    //         const prevCellData = (prevCell && prevCell.data) ? prevCell.data.toString() : '';
    //         const nextCellData = (nextCell && nextCell.data) ? nextCell.data.toString() : '';
    //         text = text + cellData;
    //         if (!cellData) {
    //             text = text + '\t';
    //             if (prevCellData.length > 0 && nextCellData.length > 0) {
    //                 text = text + '\t'
    //             }
    //         } else {
    //             if (nextCellData.length > 0) {
    //                 text = text + '\t'
    //             }
    //         }
    //         if (removeValues) {
    //             state = tryAppendChange(state, { row, column }, emptyCell);
    //         }
    //     })
    //     const areAllEmptyCells = activeSelectedRange.cols.every(el => {
    //         const cellData = state.cellMatrix.getCell(row.id, el.id).data;
    //         if (!cellData) {
    //             return true
    //         } else {
    //             return false;
    //         }
    //     });
    //     if (areAllEmptyCells) {
    //         text = text.substring(0, text.length - 1);
    //     }
    //     text = (activeSelectedRange.rows.length > 1 && rowIdx < activeSelectedRange.rows.length - 1) ? text + '\n' : text;
    // });
    // div.setAttribute('contenteditable', 'true');
    // document.body.appendChild(div);
    // div.focus();
    // (window as any).clipboardData.setData('text', text);
    // document.body.removeChild(div)
}