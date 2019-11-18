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
import { keyCodes } from '../Functions/keyCodes';
import { isNavigationKey, isTextInput } from './keyCodeCheckings';
var EmailCellTemplate = (function () {
    function EmailCellTemplate() {
    }
    EmailCellTemplate.prototype.validate = function (cell) {
        if (cell.text === undefined || cell.text === null)
            throw 'EmailCell is missing text property';
        if (!this.isEmailValid(cell.text))
            cell.isValid = false;
        return cell;
    };
    EmailCellTemplate.prototype.isEmailValid = function (email) {
        var email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email_regex.test(email.replace(/\s+/g, '')))
            return true;
        return false;
    };
    EmailCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        var char = String.fromCharCode(keyCode);
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cell: __assign({}, cell, { text: !shift ? char.toLowerCase() : char }), enableEditMode: true };
        return { cell: cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    EmailCellTemplate.prototype.update = function (cell, newCell) {
        if (newCell.text !== undefined && newCell.text.length !== 0) {
            var isValid = this.isEmailValid(newCell.text);
            return __assign({}, cell, { text: newCell.text, isValid: isValid });
        }
        return newCell;
    };
    EmailCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        if (!isInEditMode) {
            return React.createElement("span", { className: cell.isValid === false ? "rg-email-cell-template-invalid" : "rg-email-cell-template-valid" }, cell.text);
        }
        return React.createElement("input", { className: "rg-email-cell-template", ref: function (input) {
                if (input) {
                    input.focus();
                }
            }, onChange: function (e) { return onCellChanged(__assign({}, cell, { text: e.currentTarget.value }), false); }, onKeyDown: function (e) {
                if (isTextInput(e.keyCode) || (isNavigationKey(e)))
                    e.stopPropagation();
            }, defaultValue: cell.text, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); } });
    };
    return EmailCellTemplate;
}());
export { EmailCellTemplate };
