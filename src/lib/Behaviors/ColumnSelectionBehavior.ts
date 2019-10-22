import { focusLocation } from '../Functions';
import { State, Location, Behavior, Direction } from '../Model';
import { PointerEvent } from "../Functions/domEvents";
import { selectOneColumn, selectMultipleColumns, unSelectOneColumn } from '../Functions/selectRange';

export class ColumnSelectionBehavior extends Behavior {
    autoScrollDirection: Direction = 'horizontal';

    handlePointerDown(event: PointerEvent, location: Location, state: State): State {
        if (event.ctrlKey && state.selectionMode === 'column' && state.selectedIds.some(id => id === location.column.columnId)) {
            state = unSelectOneColumn(state, location.column);
        } else if (event.shiftKey && state.focusedLocation) {
            state = selectMultipleColumns(state, state.focusedLocation!.column, location.column, event.ctrlKey);
        } else {
            state = focusLocation(state, location, state.disableColumnSelection);
            if (!state.disableColumnSelection)
                state = selectOneColumn(state, location.column, event.ctrlKey);
        }
        return state;
    }

    handlePointerEnter(event: PointerEvent, location: Location, state: State): State {
        if (state.disableColumnSelection)
            return focusLocation(state, location);
        else
            return selectMultipleColumns(state, state.focusedLocation!.column, location.column, event.ctrlKey);
    }
}