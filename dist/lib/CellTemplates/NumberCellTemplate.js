import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { isNumberInput, isNavigationKey } from './keyCodeCheckings';
var NumberCellTemplate = (function () {
    function NumberCellTemplate() {
        var _this = this;
        this.renderContent = function (props) {
            if (!props.isInEditMode) {
                return _this.cellDataToText(props.cellData);
            }
            return React.createElement("input", { className: "rg-number-cell-template", ref: function (input) {
                    if (input) {
                        input.focus();
                        input.setSelectionRange(input.value.length, input.value.length);
                    }
                }, value: _this.cellDataToText(props.cellData), onChange: function (e) { return props.onCellDataChanged(_this.textToCellData(e.currentTarget.value), false); }, onKeyDown: function (e) {
                    if (isNumberInput(e.keyCode) || isNavigationKey(e))
                        e.stopPropagation();
                    if (e.keyCode == keyCodes.ESC)
                        e.currentTarget.value = props.cellData.toString();
                }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); } });
        };
    }
    NumberCellTemplate.prototype.isValid = function (cellData) {
        return typeof (cellData) === 'number';
    };
    NumberCellTemplate.prototype.textToCellData = function (text) {
        return parseFloat(text);
    };
    NumberCellTemplate.prototype.cellDataToText = function (cellData) {
        return isNaN(cellData) ? '' : cellData.toString();
    };
    NumberCellTemplate.prototype.handleKeyDown = function (cellData, keyCode, ctrl, shift, alt, props) {
        if (!ctrl && !alt && !shift && isNumberInput(keyCode))
            return { cellData: NaN, enableEditMode: true };
        return { cellData: cellData, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    return NumberCellTemplate;
}());
export { NumberCellTemplate };
