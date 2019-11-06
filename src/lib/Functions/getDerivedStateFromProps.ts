
import { State, CellMatrix, ReactGridProps } from '../Model';
import { updateSelectedRows, updateSelectedColumns } from './updateState';
import { recalcVisibleRange } from '.';
import { defaultCellTemplates } from './defaultCellTemplates';

export function getDerivedStateFromProps(props: ReactGridProps, state: State): State {
    const dataHasChanged = !state.cellMatrix ||
        props !== state.cellMatrix.props;
    if (dataHasChanged) {
        state = { ...state, cellMatrix: new CellMatrix(props) };
    }
    if (state.selectionMode === 'row' && state.selectedIds.length > 0) {
        state = updateSelectedRows(state);
    } else if (state.selectionMode === 'column' && state.selectedIds.length > 0) {
        state = updateSelectedColumns(state);
    } else {
        state = { ...state, selectedRanges: [...state.selectedRanges].map(range => state.cellMatrix.validateRange(range)) };
    }

    if (state.cellMatrix.columns.length > 0 && state.focusedLocation && !state.currentlyEditedCell) {
        state = { ...state, focusedLocation: state.cellMatrix.validateLocation(state.focusedLocation) };
        // TODO check it
        setTimeout(() => {
            if (document.activeElement !== state.hiddenFocusElement) state.hiddenFocusElement.focus();
        });
    }

    if (state.visibleRange && dataHasChanged) {
        state = recalcVisibleRange(state);
    }


    return {
        ...state,
        cellTemplates: { ...defaultCellTemplates, ...props.customCellTemplates },
        //customFocuses: props.additionalFocuses,
        disableFillHandle: props.enableFillHandle,
        disableRangeSelection: props.enableRangeSelection,
        disableColumnSelection: props.enableColumnSelection,
        disableRowSelection: props.enableRowSelection
    };
}
