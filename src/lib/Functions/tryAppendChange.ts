import { Location, State, Cell } from '../Model';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';

export function tryAppendChange(state: State, location: Location, cell: Cell): State {

    const { cell: initialCell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    if (initialCell === cell || JSON.stringify(initialCell) === JSON.stringify(cell) || cellTemplate.update === undefined)
        return state;

    const newCell = cellTemplate.update(initialCell, cell);
    if (newCell === cell || JSON.stringify(newCell) === JSON.stringify(cell))

        state.queuedCellChanges.push({
            initialCell,
            newCell,
            rowId: location.row.rowId,
            columnId: location.column.columnId
        });
    return { ...state };
}