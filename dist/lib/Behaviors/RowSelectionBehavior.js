var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { focusLocation } from '../Functions';
import { Behavior } from '../Common';
import { selectOneRow, selectMultipleRows, unSelectOneRow } from '../Functions/selectRange';
var RowSelectionBehavior = (function (_super) {
    __extends(RowSelectionBehavior, _super);
    function RowSelectionBehavior() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.autoScrollDirection = 'vertical';
        return _this;
    }
    RowSelectionBehavior.prototype.handlePointerDown = function (event, location, state) {
        if (event.ctrlKey && state.selectionMode === 'row' && state.selectedIds.some(function (id) { return id === location.row.id; })) {
            state = unSelectOneRow(state, location.row);
        }
        else if (event.shiftKey && state.focusedLocation) {
            state = selectMultipleRows(state, state.focusedLocation.row, location.row, event.ctrlKey);
        }
        else {
            state = focusLocation(state, location, state.disableRowSelection);
            if (!state.disableRowSelection)
                state = selectOneRow(state, location.row, event.ctrlKey);
        }
        return state;
    };
    RowSelectionBehavior.prototype.handlePointerEnter = function (event, location, state) {
        if (state.disableRowSelection)
            return focusLocation(state, location);
        else
            return selectMultipleRows(state, state.focusedLocation.row, location.row, event.ctrlKey);
    };
    return RowSelectionBehavior;
}(Behavior));
export { RowSelectionBehavior };
