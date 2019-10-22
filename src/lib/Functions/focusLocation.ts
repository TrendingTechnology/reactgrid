import { State, Location } from '../Model';
import { scrollIntoView } from './scrollIntoView';
import { tryAppendChange } from './tryAppendChange';

export function focusLocation(state: State, location: Location, resetSelection = true): State {
    // TODO scroll into view after changing state !?
    scrollIntoView(state, location);
    // cell.onFocusChanged(location);
    // TODO external event needed?
    // TODO move resetSelection out to an other function
    if (state.focusedLocation && state.currentlyEditedCell) {
        state = tryAppendChange(state, state.focusedLocation, state.currentlyEditedCell);
    }

    const cellTemplate = state.cellTemplates[location.cell.type];
    const isFocusable = !cellTemplate.isFocusable || cellTemplate.isFocusable(location.cell);

    if (resetSelection)
        state = {
            ...state,
            activeSelectedRangeIdx: 0,
            selectedRanges: [state.cellMatrix.getRange(location, location)],
            selectedIndexes: [],
            selectedIds: [],
            selectionMode: 'range'
        };

    return {
        ...state,
        contextMenuPosition: [-1, -1],
        focusedLocation: location, // TODO enable: isFocusable ? location : undefined,
        currentlyEditedCell: undefined
    };
}
