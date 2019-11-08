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
import { isTextInput, isNavigationKey } from './keyCodeCheckings';
var TextCellTemplate = (function () {
    function TextCellTemplate() {
    }
    TextCellTemplate.prototype.validate = function (cell) {
        if (cell.text === undefined || cell.text === null)
            throw 'TextCell is missing text property';
        return cell;
    };
    TextCellTemplate.prototype.update = function (cell, newCell) {
        return newCell;
    };
    TextCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cell: __assign({}, cell, { text: '' }), enableEditMode: true };
        return { cell: cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    TextCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        if (!isInEditMode)
            return cell.text;
        return React.createElement("input", { className: "rg-text-cell-template", ref: function (input) {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }, defaultValue: cell.text, onChange: function (e) { return onCellChanged(__assign({}, cell, { text: e.currentTarget.value }), false); }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) {
                if (isTextInput(e.keyCode) || (isNavigationKey(e)))
                    e.stopPropagation();
                if (e.keyCode == keyCodes.ESC)
                    e.currentTarget.value = cell.text;
            } });
    };
    return TextCellTemplate;
}());
export { TextCellTemplate };
