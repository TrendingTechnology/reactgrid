import { DefaultBehavior } from "../Behaviors/DefaultBehavior";
var State = (function () {
    function State(updateState) {
        this.updateState = updateState;
        this.currentBehavior = new DefaultBehavior();
        this.floatingCellEditor = false;
        this.queuedDataChanges = [];
        this.customFocuses = [];
        this.contextMenuPosition = [-1, -1];
        this.lineOrientation = 'horizontal';
        this.linePosition = -1;
        this.shadowSize = 0;
        this.shadowPosition = -1;
        this.shadowCursor = 'default';
        this.selectionMode = 'range';
        this.selectedRanges = [];
        this.selectedIndexes = [];
        this.selectedIds = [];
        this.activeSelectedRangeIdx = 0;
        this.minScrollTop = -1;
        this.maxScrollTop = -1;
        this.minScrollLeft = -1;
        this.maxScrollLeft = -1;
        this.log = function (text) { };
    }
    return State;
}());
export { State };
