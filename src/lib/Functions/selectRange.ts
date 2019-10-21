import { State, Range, GridColumn, GridRow, Location } from '../Model';

export function selectRange(state: State, range: Range, incremental: boolean): State {
    return {
        ...state,
        selectionMode: 'range',
        selectedRanges: (incremental && state.selectionMode === 'range' ? state.selectedRanges : []).concat([range]),
        selectedIndexes: [],
        selectedIds: [],
        activeSelectedRangeIdx: incremental && state.selectionMode === 'range' ? state.selectedRanges.length : 0
    };
}

export function updateActiveSelectedRange(state: State, range: Range): State {
    return {
        ...state,
        selectionMode: 'range',
        // replace active selected range in selectedRanges
        selectedRanges: Object.assign([], state.selectedRanges, { [state.activeSelectedRangeIdx]: range }),
        selectedIndexes: [],
        selectedIds: []
    };
}

export function selectOneColumn(state: State, col: GridColumn, incremental: boolean): State {
    return {
        ...state,
        selectionMode: 'column',
        selectedIndexes: (incremental && state.selectionMode === 'column' ? state.selectedIndexes : []).concat(col.idx),
        selectedIds: (incremental && state.selectionMode === 'column' ? state.selectedIds : []).concat(col.columnId)
    };
}

export function unSelectOneColumn(state: State, col: GridColumn): State {
    const updatedIndexes = state.selectedIndexes.filter(idx => idx !== col.idx);
    const updatedIds = state.selectedIds.filter(id => id !== col.columnId);

    return {
        ...state,
        selectionMode: 'column',
        selectedIndexes: updatedIndexes,
        selectedIds: updatedIds
    };
}

export function selectMultipleColumns(state: State, firstCol: GridColumn, lastCol: GridColumn, incremental?: boolean): State {
    const firstRow = state.cellMatrix.first.row;
    const lastRow = state.cellMatrix.last.row;
    const range = state.cellMatrix.getRange(new Location(firstRow, firstCol), new Location(lastRow, lastCol));

    return {
        ...state,
        selectionMode: 'column',
        selectedIndexes: incremental ? state.selectedIndexes.concat(range.cols.map(col => col.idx)) : range.cols.map(col => col.idx),
        selectedIds: incremental ? state.selectedIds.concat(range.cols.map(col => col.columnId)) : range.cols.map(col => col.columnId)
    };
}

export function selectOneRow(state: State, row: GridRow, incremental: boolean): State {
    return {
        ...state,
        selectionMode: 'row',
        selectedIndexes: (incremental && state.selectionMode === 'row' ? state.selectedIndexes : []).concat(row.idx),
        selectedIds: (incremental && state.selectionMode === 'row' ? state.selectedIds : []).concat(row.rowId)
    };
}

export function unSelectOneRow(state: State, row: GridRow): State {
    const updatedIndexes = state.selectedIndexes.filter(idx => idx !== row.idx);
    const updatedIds = state.selectedIds.filter(id => id !== row.rowId);

    return {
        ...state,
        selectionMode: 'row',
        selectedIndexes: updatedIndexes,
        selectedIds: updatedIds
    };
}

export function selectMultipleRows(state: State, firstRow: GridRow, lastRow: GridRow, incremental?: boolean): State {
    const firstCol = state.cellMatrix.first.column;
    const lastCol = state.cellMatrix.last.column;
    const range = state.cellMatrix.getRange(new Location(firstRow, firstCol), new Location(lastRow, lastCol));

    return {
        ...state,
        selectionMode: 'row',
        selectedIndexes: incremental ? state.selectedIndexes.concat(range.rows.map(row => row.idx)) : range.rows.map(row => row.idx),
        selectedIds: incremental ? state.selectedIds.concat(range.rows.map(row => row.rowId)) : range.rows.map(row => row.rowId)
    };
}
