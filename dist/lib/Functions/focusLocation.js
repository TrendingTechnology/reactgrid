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
import { scrollIntoView } from "./scrollIntoView";
import { trySetDataAndAppendChange } from "./trySetDataAndAppendChange";
export function focusLocation(state, location, resetSelection) {
    if (resetSelection === void 0) { resetSelection = true; }
    scrollIntoView(state, location);
    if (state.focusedLocation && state.currentlyEditedCell) {
        state = trySetDataAndAppendChange(state, state.focusedLocation, state.currentlyEditedCell);
    }
    var cellTemplate = state.cellTemplates[location.cell.type];
    var isFocusable = !cellTemplate.isFocusable || cellTemplate.isFocusable(location.cell.data);
    if (resetSelection)
        state = __assign({}, state, { activeSelectedRangeIdx: 0, selectedRanges: [state.cellMatrix.getRange(location, location)], selectedIndexes: [], selectedIds: [], selectionMode: 'range' });
    return __assign({}, state, { contextMenuPosition: [-1, -1], focusedLocation: location, currentlyEditedCell: undefined });
}
