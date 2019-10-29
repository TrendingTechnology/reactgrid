import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { isTextInput, isNavigationKey } from './keyCodeCheckings';
var EmailCellTemplate = (function () {
    function EmailCellTemplate() {
        this.renderContent = function (props) {
            if (!props.isInEditMode)
                return props.cellData;
            return React.createElement("input", { type: 'email', className: "rg-email-cell-template", ref: function (input) {
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
    EmailCellTemplate.prototype.isValid = function (cellData) {
        var email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email_regex.test(cellData.replace(/\s+/g, ''));
    };
    EmailCellTemplate.prototype.textToCellData = function (text) {
        return text;
    };
    EmailCellTemplate.prototype.cellDataToText = function (cellData) {
        return cellData;
    };
    EmailCellTemplate.prototype.handleKeyDown = function (cellData, keyCode, ctrl, shift, alt, props) {
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cellData: '', enableEditMode: true };
        return { cellData: cellData, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    return EmailCellTemplate;
}());
export { EmailCellTemplate };
