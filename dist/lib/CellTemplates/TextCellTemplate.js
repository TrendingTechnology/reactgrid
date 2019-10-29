import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { isTextInput, isNavigationKey } from './keyCodeCheckings';
var TextCellTemplate = (function () {
    function TextCellTemplate() {
        this.renderContent = function (props) {
            if (!props.isInEditMode)
                return props.cellData;
            return React.createElement("input", { className: "rg-text-cell-template", ref: function (input) {
                    if (input) {
                        input.focus();
                        input.setSelectionRange(input.value.length, input.value.length);
                    }
                }, defaultValue: props.cellData, onChange: function (e) { return props.onCellDataChanged(e.currentTarget.value, false); }, onBlur: function (e) { return props.onCellDataChanged(e.currentTarget.value, true); }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) {
                    if (isTextInput(e.keyCode) || (isNavigationKey(e)))
                        e.stopPropagation();
                    if (e.keyCode == keyCodes.ESC)
                        e.currentTarget.value = props.cellData;
                } });
        };
    }
    TextCellTemplate.prototype.isValid = function (cellData) {
        return typeof (cellData) === 'string';
    };
    TextCellTemplate.prototype.textToCellData = function (text) {
        return text;
    };
    TextCellTemplate.prototype.cellDataToText = function (cellData) {
        return cellData;
    };
    TextCellTemplate.prototype.handleKeyDown = function (cellData, keyCode, ctrl, shift, alt, props) {
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cellData: '', enableEditMode: true };
        return { cellData: cellData, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    return TextCellTemplate;
}());
export { TextCellTemplate };
