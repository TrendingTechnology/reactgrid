import { State, Location, GridRow, GridColumn } from '../Model';
import { newLocation } from './newLocation';

// TODO cleanup
// export function updateFocusedLocation(state: State): State {
//     if (state.focusedLocation) {
//         // TODO REMOVE FIND
//         const newFocusedCol = state.cellMatrix.cols.find(c => c.id === state.focusedLocation!.col.id)
//         const newFocusedRow = state.cellMatrix.rows.find(r => r.id === state.focusedLocation!.row.id)
//         const selectedRanges = state.selectedRanges
//         if (newFocusedCol && newFocusedRow) {
//             let focusedLocation = state.cellMatrix.getLocation(newFocusedRow.idx, newFocusedCol.idx);
//             if (selectedRanges.length > 0 && !selectedRanges.some(range => range.contains(focusedLocation))) { // change focus position after unselection Row or Column which contains focus
//                 focusedLocation = state.cellMatrix.getLocation(selectedRanges[selectedRanges.length - 1].first.row.idx, selectedRanges[selectedRanges.length - 1].first.col.idx);
//             }
//             if (focusedLocation)
//                 return {
//                     ...state,
//                     focusedLocation
//                 }
//         } else {
//             const isOneRangeAndHasOneCell = selectedRanges.length === 1 && selectedRanges[0].rows.length === 1 && selectedRanges[0].cols.length === 1;
//             return {
//                 ...state,
//                 selectedRanges: isOneRangeAndHasOneCell ? [] : selectedRanges,
//                 focusedLocation: undefined
//             }
//         }
//     }
//     return state
// }

export function updateSelectedRows(state: State): State {
    const firstCol = state.cellMatrix.first.column;
    const lastCol = state.cellMatrix.last.column;
    // TODO this filter is very inefficient for big tables
    const updatedRows = state.cellMatrix.rows.filter(r => state.selectedIds.includes(r.rowId)).sort((a, b) => a.idx - b.idx);
    const rows = groupedRows(updatedRows);
    const ranges = rows.map(row => state.cellMatrix.getRange(newLocation(row[0], firstCol), newLocation(row[row.length - 1], lastCol)));
    let activeSelectedRangeIdx = state.selectedRanges.length - 1;

    if (state.focusedLocation) {
        ranges.forEach((range, idx) => {
            range.rows.forEach(row => {
                if (state.focusedLocation!.row.rowId === row.rowId) {
                    activeSelectedRangeIdx = idx;
                }
            });
        });
    }

    return {
        ...state,
        selectionMode: 'row',
        activeSelectedRangeIdx,
        selectedRanges: [...ranges],
        selectedIndexes: updatedRows.map(row => row.idx),
        selectedIds: updatedRows.map(row => row.rowId)
    };
}

export function updateSelectedColumns(state: State): State {
    const firstRow = state.cellMatrix.first.row;
    const lastRow = state.cellMatrix.last.row;
    // TODO this filter is very inefficient for big tables
    const updatedColumns = state.cellMatrix.columns.filter(r => state.selectedIds.includes(r.columnId)).sort((a, b) => a.idx - b.idx);
    const columns = groupedColumns(updatedColumns);
    const ranges = columns.map(arr => state.cellMatrix.getRange(newLocation(firstRow, arr[0]), newLocation(lastRow, arr[arr.length - 1])));
    let activeSelectedRangeIdx = state.selectedRanges.length - 1;

    if (state.focusedLocation) {
        ranges.forEach((range, idx) => {
            range.columns.forEach(col => {
                if (state.focusedLocation!.column.columnId === col.columnId) {
                    activeSelectedRangeIdx = idx;
                }
            });
        });
    }

    return {
        ...state,
        selectionMode: 'column',
        activeSelectedRangeIdx,
        selectedRanges: [...ranges],
        selectedIndexes: updatedColumns.map(col => col.idx),
        selectedIds: updatedColumns.map(col => col.columnId)
    };
}

// TODO cleanup
// export function updateSelectedRanges(state: State): State {
//     const newSelectedRanges: Range[] = [];
//     state.selectedRanges.forEach(range => {
//         const rowIds = range.rows.map(row => row.id)
//         const colIds = range.cols.map(col => col.id)
//         const updatedRows = state.cellMatrix.rows.filter(r => rowIds.includes(r.id)).sort((a, b) => a.idx - b.idx);
//         const updatedColumns = state.cellMatrix.cols.filter(c => colIds.includes(c.id)).sort((a, b) => a.idx - b.idx);
//         const rows = groupedRows(updatedRows)
//         const columns = groupedColumns(updatedColumns)

//         columns.forEach(c => {
//             rows.forEach(r => {
//                 newSelectedRanges.push(state.cellMatrix.getRange(newLocation(r[0], c[0]), newLocation(r[r.length - 1], c[c.length - 1])))
//             })
//         })
//     })

//     let activeSelectedRangeIdx = 0;

//     if (state.focusedLocation && newSelectedRanges.length == 0) {
//         const location = newLocation(state.focusedLocation.row, state.focusedLocation.col)
//         newSelectedRanges.push(state.cellMatrix.getRange(location, location))
//     } else if (state.focusedLocation) {
//         const location = newLocation(state.focusedLocation.row, state.focusedLocation.col)
//         const index = newSelectedRanges.findIndex(r => r.contains(location))
//         if (index !== -1) {
//             activeSelectedRangeIdx = index
//         }
//     }

//     return {
//         ...state,
//         activeSelectedRangeIdx,
//         selectedRanges: newSelectedRanges,
//     }
// }

const groupedRows = (array: GridRow[]) => {
    const grouped: GridRow[][] = [];
    let sortIndex = 0;
    array.forEach((current: GridRow, index) => {
        if (!array[index - 1]) {
            grouped.push([current]);
            return;
        }
        const prev: GridRow = array[index - 1];
        if (current.idx - prev.idx == 1) {
            if (!grouped[sortIndex]) {
                grouped.push([prev, current]);
            } else {
                grouped[sortIndex].push(current);
            }
        } else {
            grouped.push([current]);
            sortIndex += 1;
        }
    });
    return grouped;
};

const groupedColumns = (array: GridColumn[]) => {
    const grouped: GridColumn[][] = [];
    let sortIndex = 0;
    array.forEach((current: GridColumn, index) => {
        if (!array[index - 1]) {
            grouped.push([current]);
            return;
        }
        const prev: GridColumn = array[index - 1];
        if (current.idx - prev.idx == 1) {
            if (!grouped[sortIndex]) {
                grouped.push([prev, current]);
            } else {
                grouped[sortIndex].push(current);
            }
        } else {
            grouped.push([current]);
            sortIndex += 1;
        }
    });
    return grouped;
};
