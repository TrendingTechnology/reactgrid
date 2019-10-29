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
import * as React from "react";
import { CellMatrix, State } from "../Common";
import { recalcVisibleRange, isBrowserIE, isBrowserEdge, getActiveSelectedRange } from "../Functions";
import { PointerEventsController } from "../Common/PointerEventsController";
import { updateSelectedRows, updateSelectedColumns } from "../Functions/updateState";
import { DefaultGridRenderer } from "./DefaultGridRenderer";
import { LegacyBrowserGridRenderer } from "./LegacyBrowserGridRenderer";
import { defaultCellTemplates } from "../Common/DefaultCellTemplates";
import { checkLicense } from "../Functions/licencing";
var ReactGrid = (function (_super) {
    __extends(ReactGrid, _super);
    function ReactGrid(props) {
        var _this = _super.call(this, props) || this;
        _this.updateState = function (modifier) { return _this.updateOnNewState(modifier(_this.state)); };
        _this.pointerEventsController = new PointerEventsController(_this.updateState);
        _this.state = new State(_this.updateState);
        _this.hiddenElementRefHandler = function (hiddenFocusElement) {
            _this.state.hiddenFocusElement = hiddenFocusElement;
        };
        _this.pasteCaptureHandler = function (event) {
            var htmlData = event.clipboardData.getData('text/html');
            var parsedData = new DOMParser().parseFromString(htmlData, 'text/html');
            if (htmlData && parsedData.body.firstElementChild.getAttribute('data-key') === 'dynagrid') {
                event.bubbles = false;
            }
        };
        _this.scrollHandler = function () {
            var _a = _this.state.viewportElement, scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
            if (scrollTop < _this.state.minScrollTop || scrollTop > _this.state.maxScrollTop ||
                scrollLeft < _this.state.minScrollLeft || scrollLeft > _this.state.maxScrollLeft) {
                _this.updateOnNewState(recalcVisibleRange(_this.state));
            }
        };
        _this.viewportElementRefHandler = function (viewportElement) { return viewportElement && _this.updateOnNewState(recalcVisibleRange(__assign({}, _this.state, { viewportElement: viewportElement }))); };
        _this.pointerDownHandler = function (event) { return _this.updateOnNewState(_this.pointerEventsController.handlePointerDown(event, _this.state)); };
        _this.windowResizeHandler = function () { return _this.updateOnNewState(recalcVisibleRange(_this.state)); };
        _this.keyDownHandler = function (event) { return _this.updateOnNewState(_this.state.currentBehavior.handleKeyDown(event, _this.state)); };
        _this.keyUpHandler = function (event) { return _this.updateOnNewState(_this.state.currentBehavior.handleKeyUp(event, _this.state)); };
        _this.copyHandler = function (event) { return _this.updateOnNewState(_this.state.currentBehavior.handleCopy(event, _this.state)); };
        _this.pasteHandler = function (event) { return _this.updateOnNewState(_this.state.currentBehavior.handlePaste(event, _this.state)); };
        _this.cutHandler = function (event) { return _this.updateOnNewState(_this.state.currentBehavior.handleCut(event, _this.state)); };
        _this.handleContextMenu = function (event) { return _this.updateOnNewState(_this.state.currentBehavior.handleContextMenu(event, _this.state)); };
        checkLicense(props.license);
        return _this;
    }
    ReactGrid.getDerivedStateFromProps = function (props, state) {
        var dataHasChanged = !state.cellMatrix || props.cellMatrixProps !== state.cellMatrix.props;
        if (dataHasChanged) {
            state = __assign({}, state, { cellMatrix: new CellMatrix(props.cellMatrixProps) });
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
        if (state.cellMatrix.cols.length > 0 && state.focusedLocation && !state.currentlyEditedCell) {
            state = __assign({}, state, { focusedLocation: state.cellMatrix.validateLocation(state.focusedLocation) });
            setTimeout(function () { if (document.activeElement !== state.hiddenFocusElement)
                state.hiddenFocusElement.focus(); });
        }
        if (state.visibleRange && dataHasChanged) {
            state = recalcVisibleRange(state);
        }
        return __assign({}, state, { cellTemplates: __assign({}, defaultCellTemplates, props.cellTemplates), customFocuses: props.customFocuses, disableFillHandle: props.disableFillHandle || false, disableRangeSelection: props.disableRangeSelection || false, disableColumnSelection: props.disableColumnSelection || false, disableRowSelection: props.disableRowSelection || false });
    };
    ReactGrid.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.windowResizeHandler);
    };
    ReactGrid.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.windowResizeHandler);
    };
    ReactGrid.prototype.render = function () {
        var _this = this;
        var grid = (typeof window !== 'undefined' && (isBrowserIE() || isBrowserEdge())) ? LegacyBrowserGridRenderer : DefaultGridRenderer;
        var range = getActiveSelectedRange(this.state);
        var rowIds = range ? range.rows.map(function (r) { return r.id; }) : [];
        var colIds = range ? range.cols.map(function (c) { return c.id; }) : [];
        return React.createElement(grid, {
            state: this.state,
            onKeyDown: this.keyDownHandler,
            onKeyUp: this.keyUpHandler,
            onCopy: this.copyHandler,
            onCut: this.cutHandler,
            onPaste: this.pasteHandler,
            onPasteCapture: this.pasteCaptureHandler,
            onPointerDown: this.pointerDownHandler,
            onContextMenu: this.handleContextMenu,
            onScroll: this.scrollHandler,
            onRowContextMenu: function (menuOptions) { return _this.props.onRowContextMenu ? _this.props.onRowContextMenu(rowIds, menuOptions) : []; },
            onColumnContextMenu: function (menuOptions) { return _this.props.onColumnContextMenu ? _this.props.onColumnContextMenu(colIds, menuOptions) : []; },
            onRangeContextMenu: function (menuOptions) { return _this.props.onRangeContextMenu ? _this.props.onRangeContextMenu(rowIds, colIds, menuOptions) : []; },
            viewportElementRefHandler: this.viewportElementRefHandler,
            hiddenElementRefHandler: this.hiddenElementRefHandler
        });
    };
    ReactGrid.prototype.updateOnNewState = function (state) {
        var dataChanges = state.queuedDataChanges;
        if (state === this.state && dataChanges.length === 0)
            return;
        this.setState(__assign({}, state, { queuedDataChanges: [] }));
        if (this.props.onDataChanged && dataChanges.length > 0) {
            this.props.onDataChanged(dataChanges);
        }
    };
    return ReactGrid;
}(React.Component));
export { ReactGrid };
