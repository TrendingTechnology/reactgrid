import { State, Location, CompatibleCell, CellTemplate } from '../Model';


export function getCompatibleCellAndTemplate(state: State, location: Location): { cell: CompatibleCell, cellTemplate: CellTemplate } {
    try {
        //const rowIdx = this.rowIndexLookup[rowId];
        //if (rowIdx === undefined) throw 'Row not found'
        //const row = this.rows[rowIdx];
        //const columnIdx = this.columnIndexLookup[columnId];
        //if (columnIdx === undefined) throw 'Column not found'
        //const cell = row.cells[columnIdx];
        //if (columnIdx === undefined) throw 'Cell not found'
        const rawCell = state.cellMatrix.getCell(location);
        const cellTemplate = state.cellTemplates[rawCell.type];
        if (!cellTemplate) throw `CellTemplate missing for type '${rawCell.type}'`
        const cell = cellTemplate.validate(rawCell);
        if (!cell) throw 'Cell validation failed'
        return { cell, cellTemplate };
    } catch (e) {
        throw `${e} (rowId: '${location.row.rowId}', columnId: '${location.column.columnId}')`
    }
}