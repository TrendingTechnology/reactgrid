import { Location, State, Cell } from '../Model';

export function tryAppendChange(state: State, location: Location, cell: CommonCell): State {
    if (location.cell === cell || JSON.stringify(location.cell) === JSON.stringify(cell)) return state;

    const cellTemplate = state.cellTemplates[location.cell.type];
    if (cellTemplate.isReadonly && cellTemplate.isReadonly(location.cell)) return state;

    const compatibleCell = getCompatibleCell(state, location.cell.type, cell);
    const newCell = cellTemplate.update ? cellTemplate.update(location.cell, compatibleCell) : compatibleCell;

    state.queuedChanges.push({
        initialCell: location.cell,
        newCell,
        rowId: location.row.rowId,
        columnId: location.column.columnId
    });
    return { ...state };
}

function getCompatibleCell(state: State, type: string, cell: Cell | string): Cell {
    if (typeof cell !== 'string' && cell.type === type)
        return cell;

    const cellTemplate = state.cellTemplates[type];
    if (!cellTemplate)
        throw `Missing CellTemplate for type '${type}'`;

    if (!cellTemplate.parseHtml)
        throw `CellTemplate for type '${type}' is missing implementation of parseHtml()`;

    if (typeof cell === 'string') {
        return cellTemplate.parseHtml(cell);
    }

    const sourceCellTemplate = state.cellTemplates[cell.type];
    if (!sourceCellTemplate)
        throw `Missing CellTemplate for type '${cell.type}'`;

    return cellTemplate.parseHtml(sourceCellTemplate.toHtml(cell));
}
