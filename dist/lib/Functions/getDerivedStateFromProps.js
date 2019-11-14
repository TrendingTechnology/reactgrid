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
import { CellMatrix } from '../Model';
import { updateSelectedRows, updateSelectedColumns } from './updateState';
import { recalcVisibleRange } from '.';
import { defaultCellTemplates } from './defaultCellTemplates';
export function getDerivedStateFromProps(props, state) {
    if (state.props !== props) {
        state = __assign({}, state, { props: props });
    }
    var dataHasChanged = !state.cellMatrix ||
        props !== state.cellMatrix.props;
    if (dataHasChanged) {
        state = __assign({}, state, { cellMatrix: new CellMatrix(props) });
    }
    if (state.selectionMode === 'row' && state.selectedIds.length > 0) {
        state = updateSelectedRows(state);
    }
    else if (state.selectionMode === 'column' && state.selectedIds.length > 0) {
        state = updateSelectedColumns(state);
    }
    else {
        state = __assign({}, state, { selectedRanges: state.selectedRanges.slice().map(function (range) { return state.cellMatrix.validateRange(range); }) });
    }
    if (state.cellMatrix.columns.length > 0 && state.focusedLocation && !state.currentlyEditedCell) {
        state = __assign({}, state, { focusedLocation: state.cellMatrix.validateLocation(state.focusedLocation) });
        setTimeout(function () {
            if (document.activeElement !== state.hiddenFocusElement)
                state.hiddenFocusElement.focus();
        });
    }
    if (state.visibleRange && dataHasChanged) {
        state = recalcVisibleRange(state);
    }
    return __assign({}, state, { cellTemplates: __assign({}, defaultCellTemplates, props.customCellTemplates), highlightLocations: props.highlightLocations || [], disableFillHandle: props.disableFillHandle || false, disableRangeSelection: props.disableRangeSelection || false, enableColumnSelection: props.enableColumnSelection || false, enableRowSelection: props.enableRowSelection || false });
}
