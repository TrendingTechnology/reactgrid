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
import { keyCodes } from '../Common/Constants';
import { isTextInput, isNavigationKey } from './keyCodeCheckings';
var GroupHeaderCellTemplate = (function () {
    function GroupHeaderCellTemplate() {
        this.renderContent = function (props) {
            var cellData = __assign({}, props.cellData);
            var isHeaderTreeRoot = cellData.depth !== 1;
            var canBeExpanded = cellData.isExpanded !== undefined;
            var elementMarginMultiplier = canBeExpanded && isHeaderTreeRoot ? cellData.depth - 2 : cellData.depth - 1;
            return (!props.isInEditMode ?
                React.createElement("div", { className: "rg-group-header-cell-template-wrapper", style: { marginLeft: "calc( 1.4em * " + (cellData.depth ? elementMarginMultiplier : 1) + " )" } },
                    cellData.isExpanded !== undefined && React.createElement(Chevron, { cellData: cellData, cellProps: props }),
                    React.createElement("div", { className: "rg-group-header-cell-template-wrapper-content" }, cellData.name))
                :
                    React.createElement("input", { className: "rg-group-header-cell-template-input", ref: function (input) {
                            if (input) {
                                input.focus();
                                input.setSelectionRange(input.value.length, input.value.length);
                            }
                        }, defaultValue: cellData.name, onChange: function (e) {
                            return props.onCellDataChanged({ name: e.currentTarget.value, isExpanded: cellData.isExpanded, depth: cellData.depth }, false);
                        }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) {
                            if (isTextInput(e.keyCode) || (isNavigationKey(e)))
                                e.stopPropagation();
                            if (e.keyCode == keyCodes.ESC)
                                e.currentTarget.value = props.cellData.name;
                        } }));
        };
    }
    GroupHeaderCellTemplate.prototype.isValid = function (cellData) {
        return typeof (cellData.name) === 'string' && (cellData.isExpanded === undefined || typeof (cellData.isExpanded) === 'boolean') && typeof (cellData.depth) === 'number';
    };
    GroupHeaderCellTemplate.prototype.textToCellData = function (text) {
        return { name: text, isExpanded: false, depth: 1 };
    };
    GroupHeaderCellTemplate.prototype.cellDataToText = function (cellData) {
        return cellData.name;
    };
    GroupHeaderCellTemplate.prototype.handleKeyDown = function (cellData, keyCode, ctrl, shift, alt, props) {
        var enableEditMode = keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER;
        var cellDataCopy = __assign({}, cellData);
        if (keyCode === keyCodes.SPACE && cellDataCopy.isExpanded !== undefined) {
            cellDataCopy.isExpanded = !cellDataCopy.isExpanded;
        }
        else if (!ctrl && !alt && isTextInput(keyCode)) {
            cellDataCopy.name = '';
            enableEditMode = true;
        }
        return { cellData: cellDataCopy, enableEditMode: enableEditMode };
    };
    return GroupHeaderCellTemplate;
}());
export { GroupHeaderCellTemplate };
var Chevron = (function (_super) {
    __extends(Chevron, _super);
    function Chevron() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Chevron.prototype.render = function () {
        var _a = this.props, cellData = _a.cellData, cellProps = _a.cellProps;
        return (React.createElement("div", { onPointerDown: function (e) {
                e.stopPropagation();
                cellData.isExpanded = !cellData.isExpanded;
                cellProps.onCellDataChanged(cellData, true);
            }, className: "rg-group-header-cell-template-chevron-wrapper" },
            React.createElement("div", { style: { transform: "" + (cellData.isExpanded ? 'rotate(90deg)' : 'rotate(0)'), transition: '200ms all', } }, "\u276F")));
    };
    return Chevron;
}(React.Component));
