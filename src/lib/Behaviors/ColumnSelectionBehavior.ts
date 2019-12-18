import { focusLocation } from '../Functions';
import { State, Location, Behavior, Direction, GridColumn } from '../Model';
import { PointerEvent } from '../Functions/domEvents';
import { selectOneColumn, selectMultipleColumns, unSelectOneColumn } from '../Functions/selectRange';

export class ColumnSelectionBehavior extends Behavior {
    autoScrollDirection: Direction = 'horizontal';
    initialColumn!: GridColumn;

    handlePointerDown(event: PointerEvent, location: Location, state: State): State {
        this.initialColumn = location.column;
        if (event.ctrlKey && state.selectionMode === 'column' && state.selectedIds.some(id => id === location.column.columnId)) {
            state = unSelectOneColumn(state, location.column);
        } else if (event.shiftKey && state.focusedLocation) {
            state = selectMultipleColumns(state, state.focusedLocation!.column, location.column, event.ctrlKey);
        } else {
            state = focusLocation(state, location, false);
            state = selectOneColumn(state, location.column, event.ctrlKey);
        }
        return state;
    }

    handlePointerEnter(event: PointerEvent, location: Location, state: State): State {
        return selectMultipleColumns(state, this.initialColumn, location.column, event.ctrlKey);
    }
}