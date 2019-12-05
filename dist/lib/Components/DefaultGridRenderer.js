import * as React from 'react';
import { PaneRow } from './PaneRow';
import { Line } from './Line';
import { Shadow } from './Shadow';
import { CellEditor } from './CellEditor';
import { ContextMenu } from './ContextMenu';
export var DefaultGridRenderer = function (props) {
    return React.createElement("div", { className: "reactgrid", onKeyDown: props.eventHandlers.keyDownHandler, onKeyUp: props.eventHandlers.keyUpHandler, onPointerDown: props.eventHandlers.pointerDownHandler, onPasteCapture: props.eventHandlers.pasteCaptureHandler, onPaste: props.eventHandlers.pasteHandler, onCopy: props.eventHandlers.copyHandler, onCut: props.eventHandlers.cutHandler, onBlur: props.eventHandlers.blurHandler, style: { width: '100%', height: '100%', minWidth: 510, minHeight: 150 } },
        React.createElement("div", { className: "rg-viewport", ref: props.eventHandlers.viewportElementRefHandler, onScroll: props.eventHandlers.scrollHandler },
            React.createElement("div", { "data-cy": "reactgrid", className: "rg-content", style: {
                    width: props.state.cellMatrix.width, height: props.state.cellMatrix.height
                } },
                props.state.cellMatrix.frozenTopRange.height > 0 &&
                    React.createElement(PaneRow, { id: 'T', class: "rg-pane-row-t", state: props.state, style: {}, range: props.state.cellMatrix.frozenTopRange, borders: { bottom: true }, zIndex: 3 }),
                props.state.cellMatrix.scrollableRange.height > 0 && props.state.cellMatrix.scrollableRange.first.column && props.state.cellMatrix.scrollableRange.first.row && props.state.cellMatrix.scrollableRange.last.row && props.state.visibleRange &&
                    React.createElement(PaneRow, { id: 'M', state: props.state, style: { height: props.state.cellMatrix.scrollableRange.height }, range: props.state.cellMatrix.scrollableRange.slice(props.state.visibleRange, 'rows'), borders: {}, zIndex: 0 }),
                props.state.cellMatrix.frozenBottomRange.height > 0 && props.state.cellMatrix.rows.length > 1 &&
                    React.createElement(PaneRow, { id: 'B', class: "rg-pane-row-b", state: props.state, style: {}, range: props.state.cellMatrix.frozenBottomRange, borders: { top: true }, zIndex: 3 }),
                React.createElement("input", { className: "rg-hidden-element", readOnly: true, ref: props.eventHandlers.hiddenElementRefHandler }),
                React.createElement(Line, { linePosition: props.state.linePosition, orientation: props.state.lineOrientation, cellMatrix: props.state.cellMatrix }),
                React.createElement(Shadow, { shadowPosition: props.state.shadowPosition, orientation: props.state.lineOrientation, cellMatrix: props.state.cellMatrix, shadowSize: props.state.shadowSize, cursor: props.state.shadowCursor }),
                props.state.contextMenuPosition.top !== -1 && props.state.contextMenuPosition.left !== -1 &&
                    React.createElement(ContextMenu, { state: props.state, onContextMenu: function (menuOptions) { return props.state.props.onContextMenu
                            ? props.state.props.onContextMenu((props.state.selectionMode === 'row') ? props.state.selectedIds : [], (props.state.selectionMode === 'column') ? props.state.selectedIds : [], props.state.selectionMode, menuOptions)
                            : []; }, contextMenuPosition: props.state.contextMenuPosition }))),
        props.state.currentlyEditedCell && React.createElement(CellEditor, { state: props.state }));
};
