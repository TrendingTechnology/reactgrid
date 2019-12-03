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
import React, { useState } from 'react';
import { ReactGrid } from './lib';
import './lib/assets/core.scss';
var data = [
    {
        id: 'a',
        label: 'a',
        text: 'a',
    },
    {
        id: 'b',
        label: 'b',
        text: 'b',
        parent: 'a'
    },
    {
        id: 'c',
        label: 'c',
        text: 'c',
        parent: 'b'
    },
    {
        id: 'd',
        label: 'd',
        text: 'd',
        parent: 'a'
    },
    {
        id: 'e',
        label: 'e',
        text: 'e',
        parent: 'd'
    },
    {
        id: 'f',
        label: 'f',
        text: 'f',
        parent: 'd'
    },
    {
        id: 'g',
        label: 'g',
        text: 'g',
        parent: 'f'
    },
    {
        id: 'h',
        label: 'h',
        text: 'h',
        parent: 'a'
    },
    {
        id: 'i',
        label: 'i',
        text: 'i',
    },
];
export var GroupTestGrid = function () {
    var getGroupCell = function (row) { return row.cells.find(function (cell) { return cell.type === 'group'; }); };
    var hasChildren = function (rows, row) { return rows.some(function (r) { return getGroupCell(r).parentId === row.rowId; }); };
    var isRowFullyExpanded = function (rows, row) {
        var parentRow = getParentRow(rows, row);
        if (parentRow) {
            if (!getGroupCell(parentRow).isExpanded)
                return false;
            return isRowFullyExpanded(rows, parentRow);
        }
        return true;
    };
    var getExpandedRows = function (rows) {
        return rows.filter(function (row) {
            var areAllParentsExpanded = isRowFullyExpanded(rows, row);
            return areAllParentsExpanded !== undefined ? areAllParentsExpanded : true;
        });
    };
    var getDirectChildrenRows = function (rows, parentRow) { return rows.filter(function (row) { return !!row.cells.find(function (cell) { return cell.type === 'group' && cell.parentId === parentRow.rowId; }); }); };
    var getParentRow = function (rows, row) { return rows.find(function (r) { return r.rowId === getGroupCell(row).parentId; }); };
    var assignIndentAndHasChildrens = function (allRows, parentRow, indent) {
        ++indent;
        getDirectChildrenRows(allRows, parentRow).forEach(function (row) {
            var groupCell = getGroupCell(row);
            groupCell.indent = indent;
            var hasRowChildrens = hasChildren(allRows, row);
            groupCell.hasChildrens = hasRowChildrens;
            if (hasRowChildrens)
                assignIndentAndHasChildrens(allRows, row, indent);
        });
        console.log('a');
    };
    var createIndents = function (rows) {
        return rows.map(function (row) {
            var groupCell = getGroupCell(row);
            if (groupCell.parentId === undefined) {
                var hasRowChildrens = hasChildren(rows, row);
                groupCell.hasChildrens = hasRowChildrens;
                if (hasRowChildrens)
                    assignIndentAndHasChildrens(rows, row, 0);
            }
            return row;
        });
    };
    var getRowsFromData = function () {
        return data.slice().map(function (dataRow) {
            return {
                rowId: dataRow.id,
                cells: [
                    {
                        type: 'group',
                        text: "id: " + dataRow.id + ", pId: " + dataRow.parent,
                        parentId: dataRow.parent,
                        isExpanded: true,
                    },
                    { type: 'text', text: "" + dataRow.text },
                ]
            };
        });
    };
    var _a = useState(function () {
        var columns = [
            { columnId: 0, width: 200, resizable: true },
            { columnId: 1 },
        ];
        var rows = getRowsFromData();
        rows = createIndents(rows);
        rows = getExpandedRows(rows);
        return { columns: columns, rows: rows };
    }), state = _a[0], setState = _a[1];
    var _b = useState(state.rows.slice()), rowsToRender = _b[0], setRowsToRender = _b[1];
    var handleColumnResize = function (ci, width) {
        var newState = __assign({}, state);
        var columnIndex = newState.columns.findIndex(function (el) { return el.columnId === ci; });
        var resizedColumn = newState.columns[columnIndex];
        newState.columns[columnIndex] = __assign({}, resizedColumn, { width: width });
        setState(newState);
    };
    var handleChanges = function (changes) {
        var newState = __assign({}, state);
        changes.forEach(function (change) {
            var changeRowIdx = newState.rows.findIndex(function (el) { return el.rowId === change.rowId; });
            var changeColumnIdx = newState.columns.findIndex(function (el) { return el.columnId === change.columnId; });
            newState.rows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
        });
        setState(__assign({}, state, { rows: createIndents(newState.rows) }));
        setRowsToRender(getExpandedRows(newState.rows));
        return true;
    };
    return React.createElement(ReactGrid, { rows: rowsToRender, columns: state.columns, license: 'non-commercial', onCellsChanged: handleChanges, onColumnResized: handleColumnResize, frozenLeftColumns: 1, enableRowSelection: true, enableColumnSelection: true });
};
