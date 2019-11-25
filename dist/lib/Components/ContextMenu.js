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
import * as React from 'react';
import { copySelectedRangeToClipboard } from '../Behaviors/DefaultBehavior';
import { isBrowserIE } from '../Functions';
var ContextMenu = (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContextMenu.prototype.render = function () {
        var _a = this.props, contextMenuPosition = _a.contextMenuPosition, onRowContextMenu = _a.onRowContextMenu, onColumnContextMenu = _a.onColumnContextMenu, onRangeContextMenu = _a.onRangeContextMenu, state = _a.state;
        var focusedLocation = state.focusedLocation;
        var contextMenuOptions = customContextMenuOptions(state);
        var rowOptions = onRowContextMenu && onRowContextMenu(customContextMenuOptions(state));
        var colOptions = onColumnContextMenu && onColumnContextMenu(customContextMenuOptions(state));
        var rangeOptions = onRangeContextMenu && onRangeContextMenu(customContextMenuOptions(state));
        if (focusedLocation) {
            if (state.selectionMode == 'row' && state.selectedIds.includes(focusedLocation.row.rowId) && rowOptions) {
                contextMenuOptions = rowOptions;
            }
            else if (state.selectionMode == 'column' && state.selectedIds.includes(focusedLocation.column.columnId) && colOptions) {
                contextMenuOptions = colOptions;
            }
            else if (state.selectionMode == 'range' && rangeOptions) {
                contextMenuOptions = rangeOptions;
            }
        }
        return (contextMenuPosition[0] !== -1 &&
            contextMenuPosition[1] !== -1 &&
            contextMenuOptions.length > 0 && (React.createElement("div", { className: "rg-context-menu", style: {
                top: contextMenuPosition[0] + 'px',
                left: contextMenuPosition[1] + 'px',
            } }, contextMenuOptions.map(function (el, idx) {
            React.createElement("div", { key: idx, className: "rg-context-menu-option", onPointerDown: function (e) { return e.stopPropagation(); }, onClick: function () {
                    el.handler();
                    state.update(function (state) { return (__assign({}, state, { contextMenuPosition: [-1, -1] })); });
                } }, el.label);
        }))));
    };
    return ContextMenu;
}(React.Component));
export { ContextMenu };
function customContextMenuOptions(state) {
    return [
        {
            id: 'copy',
            label: 'Copy',
            handler: function () { return copySelectedRangeToClipboard(state, false); }
        },
        {
            id: 'cut',
            label: 'Cut',
            handler: function () { return copySelectedRangeToClipboard(state, true); }
        },
        {
            id: 'paste',
            label: 'Paste',
            handler: function () {
                if (isBrowserIE()) {
                }
                else {
                }
            }
        }
    ];
}
