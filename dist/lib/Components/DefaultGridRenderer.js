import * as React from "react";
import { PaneRow } from "./PaneRow";
import { Line } from "./Line";
import { Shadow } from "./Shadow";
import { ContextMenu } from "./ContextMenu";
import { CellEditor } from "./CellEditor";
export var DefaultGridRenderer = function (props) {
    return React.createElement("div", { className: "react-grid", onKeyDown: props.onKeyDown, onKeyUp: props.onKeyUp, style: { width: '100%', height: '100%', minWidth: 510, minHeight: 150 } },
        React.createElement("div", { className: "rg-viewport", ref: props.viewportElementRefHandler, onScroll: props.onScroll },
            React.createElement("div", { "data-cy": "react-grid", className: "rg-content", style: {
                    width: props.state.cellMatrix.width, height: props.state.cellMatrix.height
                }, onPointerDown: props.onPointerDown, onCopy: props.onCopy, onCut: props.onCut, onPaste: props.onPaste, onPasteCapture: props.onPasteCapture, onContextMenu: props.onContextMenu },
                props.state.cellMatrix.frozenTopRange.height > 0 &&
                    React.createElement(PaneRow, { id: 'T', class: "rg-pane-row-t", state: props.state, style: {}, range: props.state.cellMatrix.frozenTopRange, borders: { bottom: true }, zIndex: 3 }),
                props.state.cellMatrix.scrollableRange.height > 0 && props.state.cellMatrix.scrollableRange.first.col && props.state.cellMatrix.scrollableRange.first.row && props.state.cellMatrix.scrollableRange.last.row && props.state.visibleRange &&
                    React.createElement(PaneRow, { id: 'M', state: props.state, style: { height: props.state.cellMatrix.scrollableRange.height }, range: props.state.cellMatrix.scrollableRange.slice(props.state.visibleRange, 'rows'), borders: {}, zIndex: 0 }),
                props.state.cellMatrix.frozenBottomRange.height > 0 && props.state.cellMatrix.rows.length > 1 &&
                    React.createElement(PaneRow, { id: 'B', class: "rg-pane-row-b", state: props.state, style: {}, range: props.state.cellMatrix.frozenBottomRange, borders: { top: true }, zIndex: 3 }),
                React.createElement("input", { className: "rg-hidden-element", readOnly: true, ref: props.hiddenElementRefHandler }),
                React.createElement(Line, { linePosition: props.state.linePosition, orientation: props.state.lineOrientation, cellMatrix: props.state.cellMatrix }),
                React.createElement(Shadow, { shadowPosition: props.state.shadowPosition, orientation: props.state.lineOrientation, cellMatrix: props.state.cellMatrix, shadowSize: props.state.shadowSize, cursor: props.state.shadowCursor }),
                React.createElement(ContextMenu, { state: props.state, onRowContextMenu: function (menuOptions) { return props.onRowContextMenu ? props.onRowContextMenu(menuOptions) : []; }, onColumnContextMenu: function (menuOptions) { return props.onColumnContextMenu ? props.onColumnContextMenu(menuOptions) : []; }, onRangeContextMenu: function (menuOptions) { return props.onRangeContextMenu ? props.onRangeContextMenu(menuOptions) : []; }, contextMenuPosition: props.state.contextMenuPosition }))),
        props.state.currentlyEditedCell && React.createElement(CellEditor, { state: props.state }));
};