import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { isNumberInput, isNavigationKey, isTextInput } from './keyCodeCheckings';
var DateCellTemplate = (function () {
    function DateCellTemplate() {
        this.renderContent = function (props) {
            if (!props.isInEditMode)
                return props.cellData;
            return React.createElement("input", { type: 'date', className: "rg-date-cell-template", ref: function (input) {
                    if (input) {
                        input.focus();
                    }
                }, defaultValue: props.cellData, onChange: function (e) { return props.onCellDataChanged(e.currentTarget.value, false); }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) {
                    if (isTextInput(e.keyCode) || isNavigationKey(e))
                        e.stopPropagation();
                    if (e.keyCode == keyCodes.ESC)
                        e.currentTarget.value = props.cellData.toString();
                } });
        };
    }
    DateCellTemplate.prototype.isValid = function (cellData) {
        var date_regex = /^\d{4}\-\d{2}\-\d{2}$/;
        return date_regex.test(cellData.toString().replace(/\s+/g, ''));
    };
    DateCellTemplate.prototype.textToCellData = function (text) {
        return text;
    };
    DateCellTemplate.prototype.cellDataToText = function (cellData) {
        return cellData;
    };
    DateCellTemplate.prototype.handleKeyDown = function (cellData, keyCode, ctrl, shift, alt, props) {
        if (!ctrl && !alt && !shift && isNumberInput(keyCode))
            return { cellData: '', enableEditMode: true };
        return { cellData: cellData, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    return DateCellTemplate;
}());
export { DateCellTemplate };
