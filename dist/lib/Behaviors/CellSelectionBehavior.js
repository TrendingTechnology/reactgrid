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
import { focusLocation } from '../Functions';
import { Behavior } from '../Model';
import { selectRange, updateActiveSelectedRange } from '../Functions/selectRange';
var CellSelectionBehavior = (function (_super) {
    __extends(CellSelectionBehavior, _super);
    function CellSelectionBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CellSelectionBehavior.prototype.handlePointerDown = function (event, location, state) {
        if ((event.target.className === 'rg-viewport'))
            return state;
        if (!state.disableRangeSelection && event.shiftKey && state.focusedLocation) {
            var range = state.cellMatrix.getRange(state.focusedLocation, location);
            if (event.ctrlKey && state.selectionMode === 'range') {
                return updateActiveSelectedRange(state, range);
            }
            else {
                return selectRange(state, range, false);
            }
        }
        else if (!state.disableRangeSelection && event.ctrlKey) {
            var pointedRangeIdx = state.selectedRanges.findIndex(function (range) { return range.contains(location); });
            var pointedRange = state.selectedRanges[pointedRangeIdx];
            if (pointedRange) {
                state = focusLocation(state, location, false);
                state = __assign({}, state, { activeSelectedRangeIdx: pointedRangeIdx });
            }
            else {
                var range = state.cellMatrix.getRange(location, location);
                state = selectRange(state, range, true);
                state = focusLocation(state, location, false);
            }
        }
        else {
            state = focusLocation(state, location);
        }
        return state;
    };
    CellSelectionBehavior.prototype.handlePointerEnter = function (event, location, state) {
        var range = state.cellMatrix.getRange(state.focusedLocation, location);
        if (state.disableRangeSelection) {
            return state;
        }
        else if (state.selectionMode === 'range') {
            return updateActiveSelectedRange(state, range);
        }
        else {
            return selectRange(state, range, false);
        }
    };
    return CellSelectionBehavior;
}(Behavior));
export { CellSelectionBehavior };
