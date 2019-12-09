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
import { isAlphaNumericKey, isNavigationKey } from './keyCodeCheckings';
import { getCellProperty } from '../Functions/getCellProperty';
var EmailCellTemplate = (function () {
    function EmailCellTemplate() {
    }
    EmailCellTemplate.prototype.getCompatibleCell = function (uncertainCell) {
        var text = getCellProperty(uncertainCell, 'text', 'string');
        var value = parseFloat(text);
        return __assign({}, uncertainCell, { text: text, value: value });
    };
    EmailCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        var char = String.fromCharCode(keyCode);
        if (!ctrl && !alt && isAlphaNumericKey(keyCode))
            return { cell: __assign({}, cell, { text: !shift ? char.toLowerCase() : char }), enableEditMode: true };
        return { cell: cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    EmailCellTemplate.prototype.update = function (cell, cellToMerge) {
        return this.getCompatibleCell(__assign({}, cell, { text: cellToMerge.text }));
    };
    EmailCellTemplate.prototype.getClassName = function (cell, isInEditMode) {
        var isValid = cell.validator ? cell.validator(cell.text) : true;
        return isValid ? 'valid' : 'invalid';
    };
    EmailCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        var _this = this;
        if (!isInEditMode)
            return cell.renderer ? cell.renderer(cell.text) : cell.text;
        return React.createElement("input", { ref: function (input) {
                if (input)
                    input.focus();
            }, onChange: function (e) { return onCellChanged(_this.getCompatibleCell(__assign({}, cell, { text: e.currentTarget.value })), false); }, onBlur: function (e) { return onCellChanged(_this.getCompatibleCell(__assign({}, cell, { text: e.currentTarget.value })), true); }, onKeyDown: function (e) {
                if (isAlphaNumericKey(e.keyCode) || (isNavigationKey(e.keyCode)))
                    e.stopPropagation();
            }, defaultValue: cell.text, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); } });
    };
    return EmailCellTemplate;
}());
export { EmailCellTemplate };