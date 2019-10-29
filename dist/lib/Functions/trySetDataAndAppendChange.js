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
export function trySetDataAndAppendChange(state, location, cell) {
    var initialCellData = location.cell.data;
    if (cell.data && cell.data === initialCellData)
        return state;
    var targetCellTemplate = state.cellTemplates[location.cell.type];
    if (targetCellTemplate.isReadonly && targetCellTemplate.isReadonly(initialCellData))
        return state;
    var newData = null;
    if (cell.type && cell.type === location.cell.type)
        newData = cell.data;
    else if (cell.type && state.cellTemplates[cell.type] && targetCellTemplate.textToCellData)
        newData = targetCellTemplate.textToCellData(state.cellTemplates[cell.type].cellDataToText(cell.data));
    if (newData === null && cell.text && targetCellTemplate.textToCellData)
        newData = targetCellTemplate.textToCellData(cell.text);
    if (newData === null)
        return state;
    state.queuedDataChanges.push({
        initialData: initialCellData,
        newData: newData,
        type: location.cell.type,
        rowId: location.row.id,
        columnId: location.col.id
    });
    return __assign({}, state);
}
