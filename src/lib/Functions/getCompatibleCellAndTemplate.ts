import { State, Location, Compatible, Cell, CellTemplate } from '../Model';


export function getCompatibleCellAndTemplate(state: State, location: Location): { cell: Compatible<Cell>, cellTemplate: CellTemplate } {
    try {
        const rawCell = state.cellMatrix.getCell(location);
        if (!rawCell.type) throw 'Cell is missing type property'
        const cellTemplate = state.cellTemplates[rawCell.type];
        if (!cellTemplate) throw `CellTemplate missing for type '${rawCell.type}'`
        const cell = cellTemplate.getCompatibleCell({ ...rawCell, type: rawCell.type });
        if (!cell) throw 'Cell validation failed'
        return { cell, cellTemplate };
    } catch (e) {
        throw `${e} (rowId: '${location.row.rowId}', columnId: '${location.column.columnId}')`
    }
}