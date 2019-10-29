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
import { Behavior, Location, keyCodes } from "../Common";
import { handleKeyDown } from "./DefaultBehavior/handleKeyDown";
import { CellSelectionBehavior } from "./CellSelectionBehavior";
import { ColumnSelectionBehavior } from "./ColumnSelectionBehavior";
import { ColumnReorderBehavior } from "./ColumnReorderBehavior";
import { RowSelectionBehavior } from "./RowSelectionBehavior";
import { RowReorderBehavior } from "./RowReorderBehavior";
import { getActiveSelectedRange } from "../Functions/getActiveSelectedRange";
import { trySetDataAndAppendChange } from "../Functions";
import { FillHandleBehavior } from "./FillHandleBehavior";
import { getLocationFromClient, focusLocation } from "../Functions";
import { ResizeColumnBehavior } from "./ResizeColumnBehavior";
var DefaultBehavior = (function (_super) {
    __extends(DefaultBehavior, _super);
    function DefaultBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultBehavior.prototype.handlePointerDown = function (event, location, state) {
        state = __assign({}, state, { currentBehavior: this.getNewBehavior(event, location, state) });
        return state.currentBehavior.handlePointerDown(event, location, state);
    };
    DefaultBehavior.prototype.getNewBehavior = function (event, location, state) {
        if (event.pointerType === 'mouse' && location.row.idx == 0 && location.cellX > location.col.width - 7 && location.col.resizable) {
            return new ResizeColumnBehavior();
        }
        else if (location.row.idx == 0 && state.selectedIds.includes(location.col.id) && !event.ctrlKey && state.selectionMode == 'column' && location.col.reorderable) {
            return new ColumnReorderBehavior();
        }
        else if (location.row.idx == 0 && (event.target.className !== 'rg-fill-handle' && event.target.className !== 'rg-touch-fill-handle')) {
            return new ColumnSelectionBehavior();
        }
        else if (location.col.idx == 0 && state.selectedIds.includes(location.row.id) && !event.ctrlKey && state.selectionMode == 'row' && location.row.reorderable) {
            return new RowReorderBehavior();
        }
        else if (location.col.idx == 0 && (event.target.className !== 'rg-fill-handle' && event.target.className !== 'rg-touch-fill-handle')) {
            return new RowSelectionBehavior();
        }
        else if ((event.pointerType === 'mouse' || event.pointerType === undefined) && event.target.className === 'rg-fill-handle' && !state.disableFillHandle) {
            return new FillHandleBehavior();
        }
        else {
            return new CellSelectionBehavior();
        }
    };
    DefaultBehavior.prototype.handleContextMenu = function (event, state) {
        event.preventDefault();
        var clickX = event.clientX;
        var clickY = event.clientY;
        var top = window.innerHeight - clickY > 25;
        var right = window.innerWidth - clickX > 120;
        var bottom = !top;
        var left = !right;
        var contextMenuPosition = state.contextMenuPosition;
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
        var focusedLocation = getLocationFromClient(state, clickX, clickY);
        if (!state.selectedRanges.find(function (range) { return range.contains(focusedLocation); })) {
            state = focusLocation(state, focusedLocation);
        }
        return __assign({}, state, { contextMenuPosition: contextMenuPosition });
    };
    DefaultBehavior.prototype.handleDoubleClick = function (event, location, state) {
        if (state.focusedLocation && location.equals(state.focusedLocation)) {
            var cellTemplate = state.cellTemplates[location.cell.type];
            if (cellTemplate.handleKeyDown) {
                var _a = cellTemplate.handleKeyDown(state.focusedLocation.cell.data, 1, event.ctrlKey, event.shiftKey, event.altKey), cellData = _a.cellData, enableEditMode = _a.enableEditMode;
                if (enableEditMode) {
                    return __assign({}, state, { currentlyEditedCell: { data: cellData, type: location.cell.type } });
                }
            }
        }
        return state;
    };
    DefaultBehavior.prototype.handleKeyDown = function (event, state) {
        return handleKeyDown(state, event);
    };
    DefaultBehavior.prototype.handleKeyUp = function (event, state) {
        if (event.keyCode === keyCodes.TAB || event.keyCode === keyCodes.ENTER) {
            event.preventDefault();
            event.stopPropagation();
        }
        return state;
    };
    DefaultBehavior.prototype.handleCopy = function (event, state) {
        copySelectedRangeToClipboard(state);
        event.preventDefault();
        return state;
    };
    DefaultBehavior.prototype.handlePaste = function (event, state) {
        var activeSelectedRange = getActiveSelectedRange(state);
        if (!activeSelectedRange) {
            return state;
        }
        var pasteContent = [];
        var htmlData = event.clipboardData.getData('text/html');
        var parsedData = new DOMParser().parseFromString(htmlData, 'text/html');
        var selectionMode = parsedData.body.firstElementChild && parsedData.body.firstElementChild.getAttribute('data-selection');
        if (htmlData && parsedData.body.firstElementChild.getAttribute('data-key') === 'dynagrid') {
            var cells = parsedData.body.firstElementChild.firstElementChild.children;
            for (var i = 0; i < cells.length; i++) {
                var row = [];
                for (var j = 0; j < cells[i].children.length; j++) {
                    var rawData = cells[i].children[j].getAttribute('data-data');
                    var data = rawData && JSON.parse(rawData);
                    var type = cells[i].children[j].getAttribute('data-type');
                    var textValue = data ? cells[i].children[j].innerHTML : '';
                    row.push({ text: textValue, data: data, type: type });
                }
                pasteContent.push(row);
            }
        }
        else {
            pasteContent = event.clipboardData.getData('text/plain').split('\n').map(function (line) { return line.split('\t').map(function (t) { return ({ text: t, data: t, type: 'text' }); }); });
        }
        event.preventDefault();
        return __assign({}, pasteData(state, pasteContent), { selectionMode: selectionMode || 'range' });
    };
    DefaultBehavior.prototype.handleCut = function (event, state) {
        copySelectedRangeToClipboard(state, true);
        event.preventDefault();
        return __assign({}, state);
    };
    return DefaultBehavior;
}(Behavior));
export { DefaultBehavior };
export function validateOuterData(state, clipboardData) {
    var type = clipboardData.type;
    if (type && state.cellTemplates[type] && state.cellTemplates[type].isValid(clipboardData.data))
        return { data: clipboardData.data, type: type };
    return { data: clipboardData.text, type: 'text' };
}
export function pasteData(state, pasteContent) {
    var activeSelectedRange = getActiveSelectedRange(state);
    if (pasteContent.length === 1 && pasteContent[0].length === 1) {
        activeSelectedRange.rows.forEach(function (row) {
            return activeSelectedRange.cols.forEach(function (col) {
                state = trySetDataAndAppendChange(state, new Location(row, col), validateOuterData(state, pasteContent[0][0]));
            });
        });
    }
    else {
        var lastLocation_1;
        var cellMatrix_1 = state.cellMatrix;
        pasteContent.forEach(function (row, pasteRowIdx) {
            return row.forEach(function (pasteValue, pasteColIdx) {
                var rowIdx = activeSelectedRange.rows[0].idx + pasteRowIdx;
                var colIdx = activeSelectedRange.cols[0].idx + pasteColIdx;
                if (rowIdx <= cellMatrix_1.last.row.idx && colIdx <= cellMatrix_1.last.col.idx) {
                    lastLocation_1 = cellMatrix_1.getLocation(rowIdx, colIdx);
                    state = trySetDataAndAppendChange(state, lastLocation_1, validateOuterData(state, pasteValue));
                }
            });
        });
        return __assign({}, state, { selectedRanges: [cellMatrix_1.getRange(activeSelectedRange.first, lastLocation_1)], activeSelectedRangeIdx: 0 });
    }
    return state;
}
export function copySelectedRangeToClipboard(state, removeValues) {
    if (removeValues === void 0) { removeValues = false; }
    var div = document.createElement('div');
    var table = document.createElement('table');
    table.setAttribute('empty-cells', 'show');
    table.setAttribute('data-key', 'dynagrid');
    table.setAttribute('data-selection', state.selectionMode);
    var activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange)
        return;
    activeSelectedRange.rows.forEach(function (row) {
        var tableRow = table.insertRow();
        activeSelectedRange.cols.forEach(function (col) {
            var tableCell = tableRow.insertCell();
            var cell = state.cellMatrix.getCell(row.id, col.id);
            var data = cell.data;
            data = cell.type === 'group' ? data.name : data;
            tableCell.textContent = data;
            if (!cell.data) {
                tableCell.innerHTML = '<img>';
            }
            tableCell.setAttribute('data-data', JSON.stringify(data));
            tableCell.setAttribute('data-type', cell.type);
            tableCell.style.border = '1px solid #D3D3D3';
            if (removeValues) {
                state = trySetDataAndAppendChange(state, new Location(row, col), { data: '', type: 'text' });
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
export function copySelectedRangeToClipboardInIE(state, removeValues) {
    if (removeValues === void 0) { removeValues = false; }
    var div = document.createElement('div');
    var activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange)
        return;
    var text = '';
    activeSelectedRange.rows.forEach(function (row, rowIdx) {
        activeSelectedRange.cols.forEach(function (col, colIdx) {
            var prevCol = (colIdx - 1 >= 0) ? activeSelectedRange.cols[colIdx - 1] : undefined;
            var nextCol = (colIdx + 1 < activeSelectedRange.cols.length) ? activeSelectedRange.cols[colIdx + 1] : undefined;
            var cell = state.cellMatrix.getCell(row.id, col.id);
            var prevCell = prevCol ? state.cellMatrix.getCell(row.id, prevCol.id) : undefined;
            var nextCell = nextCol ? state.cellMatrix.getCell(row.id, nextCol.id) : undefined;
            var cellData = cell.data ? cell.data.toString() : '';
            var prevCellData = (prevCell && prevCell.data) ? prevCell.data.toString() : '';
            var nextCellData = (nextCell && nextCell.data) ? nextCell.data.toString() : '';
            text = text + cellData;
            if (!cellData) {
                text = text + '\t';
                if (prevCellData.length > 0 && nextCellData.length > 0) {
                    text = text + '\t';
                }
            }
            else {
                if (nextCellData.length > 0) {
                    text = text + '\t';
                }
            }
            if (removeValues) {
                state = trySetDataAndAppendChange(state, new Location(row, col), { data: '', type: 'text' });
            }
        });
        var areAllEmptyCells = activeSelectedRange.cols.every(function (el) {
            var cellData = state.cellMatrix.getCell(row.id, el.id).data;
            if (!cellData) {
                return true;
            }
            else {
                return false;
            }
        });
        if (areAllEmptyCells) {
            text = text.substring(0, text.length - 1);
        }
        text = (activeSelectedRange.rows.length > 1 && rowIdx < activeSelectedRange.rows.length - 1) ? text + '\n' : text;
    });
    div.setAttribute('contenteditable', 'true');
    document.body.appendChild(div);
    div.focus();
    window.clipboardData.setData('text', text);
    document.body.removeChild(div);
}
