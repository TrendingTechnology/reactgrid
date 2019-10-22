import { Location, State, Cell } from '../Model';

export function tryAppendChange(state: State, location: Location, cell: Cell): State {

    const cellTemplate = state.cellTemplates[location.cell.type];
    if (location.cell === cell || JSON.stringify(location.cell) === JSON.stringify(cell) || cellTemplate.reduce === undefined)
        return state;

    const newCell = cellTemplate.reduce(location.cell, cell);

    state.queuedChanges.push({
        initialCell: location.cell,
        newCell,
        rowId: location.row.rowId,
        columnId: location.column.columnId
    });
    return { ...state };
}