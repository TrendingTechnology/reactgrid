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
        var number_regex = /^[0-9,.]+$/;
        if (!number_regex.test(cell.value) || cell.value === undefined || cell.value === NaN) {
            return __assign({}, cell, { value: 0, text: '', isValid: false });
        }
        else {
            return __assign({}, cell, { isValid: true, text: cell.value });
        }
    };
    NumberCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        var char = String.fromCharCode(keyCode);
        if (!ctrl && !alt && !shift && (isNumberInput(keyCode)))
            return { cell: __assign({}, cell, { value: Number(char) }), enableEditMode: true };
        return { cell: cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    NumberCellTemplate.prototype.parseNumber = function (strg) {
        var decimal = '.';
        if (strg.indexOf(',') > strg.indexOf('.'))
            decimal = ',';
        strg = strg.replace(new RegExp("[^0-9$" + decimal + "]", "g"), "");
        strg = this.replaceCommasToDots(strg);
        return parseFloat(strg);
    };
    NumberCellTemplate.prototype.update = function (cell, newCell) {
        var cellValidated = this.validate(newCell);
        var isCurrnetValueFormat = isNaN(this.replaceCommasToDots(cellValidated.text));
        if (isCurrnetValueFormat) {
            return __assign({}, cell, { value: 0 });
        }
        if (newCell.value !== undefined && newCell.value !== NaN && newCell.isValid) {
            return __assign({}, cell, { value: this.parseNumber(newCell.value.toString()) });
        }
        var parsed = this.parseNumber(newCell.text);
        return __assign({}, cell, { value: (parsed > 0 || parsed < 0) || (!cellValidated.isValid) ? parsed : 0 });
    };
    NumberCellTemplate.prototype.replaceCommasToDots = function (value) {
        return value.toString().replace(",", ".");
    };
    NumberCellTemplate.prototype.isValidPrecisonFormat = function (format) {
        if (format && format.substring(0, 2) == '#.' && new RegExp("^[#\#]+$").test(format.substring(2, format.length)))
            return true;
        return false;
    };
    NumberCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        if (!isInEditMode) {
            return React.createElement("span", { className: 'number-is-valid' }, cell.format ? cell.format.format(cell.value) : cell.value.toString());
        }
        return React.createElement("input", { className: "rg-number-cell-template", style: { textAlign: "right" }, ref: function (input) {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }, defaultValue: cell.format ? new Intl.NumberFormat(cell.format.resolvedOptions().locale, { useGrouping: false, maximumFractionDigits: 20 }).format(cell.value) : cell.value.toString(), onChange: function (e) {
                onCellChanged(__assign({}, cell, { value: parseFloat(e.currentTarget.value.replace(',', '.')) }), false);
            }, onKeyDown: function (e) {
                if (isNumberInput(e.keyCode) || isNavigationKey(e) || (e.keyCode == 188 || e.keyCode == 190))
                    e.stopPropagation();
                if (!isNumberInput(e.keyCode) && !isNavigationKey(e) && (e.keyCode != 188 && e.keyCode != 190))
                    e.preventDefault();
            }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); } });
    };
    return NumberCellTemplate;
}());
export { NumberCellTemplate };
