import * as React from 'react';
import { isTextInput, isNavigationKey } from './keyCodeCheckings';
import { keyCodes } from '../Common';
var TimeCellTemplate = (function () {
    function TimeCellTemplate() {
        this.renderContent = function (props) {
            if (!props.isInEditMode)
                return props.cellData;
            return React.createElement("input", { type: 'time', className: "rg-time-cell-template", ref: function (input) {
                    if (input) {
                        input.focus();
                    }
                }, defaultValue: props.cellData, onChange: function (e) { return props.onCellDataChanged(e.currentTarget.value, false); }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) {
                    if (isTextInput(e.keyCode) || isNavigationKey(e))
                        e.stopPropagation();
                    if (e.keyCode == keyCodes.ESC)
                        e.currentTarget.value = props.cellData;
                } });
        };
    }
    TimeCellTemplate.prototype.isValid = function (cellData) {
        var time_regex = /^\d{2}\:\d{2}$/;
        return time_regex.test(cellData.replace(/\s+/g, ''));
    };
    TimeCellTemplate.prototype.textToCellData = function (text) {
        return text;
    };
    TimeCellTemplate.prototype.cellDataToText = function (cellData) {
        return cellData;
    };
    TimeCellTemplate.prototype.handleKeyDown = function (cellData, keyCode, ctrl, shift, alt, props) {
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cellData: '', enableEditMode: true };
        return { cellData: cellData, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    return TimeCellTemplate;
}());
export { TimeCellTemplate };
