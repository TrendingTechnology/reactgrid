export function getCompatibleCellAndTemplate(state, location) {
    try {
        var rawCell = state.cellMatrix.getCell(location);
        var cellTemplate = state.cellTemplates[rawCell.type];
        if (!cellTemplate)
            throw "CellTemplate missing for type '" + rawCell.type + "'";
        var cell = cellTemplate.validate(rawCell);
        if (!cell)
            throw 'Cell validation failed';
        return { cell: cell, cellTemplate: cellTemplate };
    }
    catch (e) {
        throw e + " (rowId: '" + location.row.rowId + "', columnId: '" + location.column.columnId + "')";
    }
}
