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
import { isNumberInput, isNavigationKey } from './keyCodeCheckings';
var NumberCellTemplate = (function () {
    function NumberCellTemplate() {
    }
    NumberCellTemplate.prototype.validate = function (cell) {
        return __assign({}, cell, { text: cell.value.toString() });
    };
    NumberCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        if (!ctrl && !alt && !shift && isNumberInput(keyCode))
            return { cell: __assign({}, cell, { data: NaN }), enableEditMode: true };
        return { cell: cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    NumberCellTemplate.prototype.update = function (cell, newCell) {
        if (newCell.value !== undefined && newCell.value !== NaN)
            return __assign({}, cell, { value: newCell.value });
        var parsed = parseFloat(newCell.text);
        return __assign({}, cell, { value: parsed > 0 || parsed < 0 ? parsed : 0 });
    };
    NumberCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        if (!isInEditMode) {
            return cell.value === 0 && cell.hideZero ? '' : cell.value;
        }
        return React.createElement("input", { className: "rg-number-cell-template", ref: function (input) {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }, value: cell.value, onChange: function (e) {
                onCellChanged(__assign({}, cell, { value: Number(e.currentTarget.value) }), false);
            }, onKeyDown: function (e) {
                if ((e.keyCode >= 48 && e.keyCode >= 57) || (e.keyCode <= 96 && e.keyCode >= 105)) {
                    e.preventDefault();
                    return;
                }
                if (isNumberInput(e.keyCode) || isNavigationKey(e))
                    e.stopPropagation();
                if (e.keyCode == keyCodes.ESC)
                    e.currentTarget.value = cell.value.toString();
            }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); } });
    };
    return NumberCellTemplate;
}());
export { NumberCellTemplate };
