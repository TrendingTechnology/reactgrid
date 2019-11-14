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
var CheckboxCellTemplate = (function () {
    function CheckboxCellTemplate() {
    }
    CheckboxCellTemplate.prototype.validate = function (cell) {
        return __assign({}, cell, { text: cell.value !== undefined || cell.value !== null ? cell.value.toString() : '' });
    };
    CheckboxCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        if (keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER)
            return { cell: __assign({}, cell, { value: !cell.value }), enableEditMode: false };
        return { cell: cell, enableEditMode: false };
    };
    CheckboxCellTemplate.prototype.update = function (cell, newCell) {
        if (newCell.value !== undefined && newCell.value !== NaN)
            return __assign({}, cell, { value: newCell.value });
        var text = newCell.text;
        return __assign({}, cell, { value: text.length > 0 ? true : false });
    };
    CheckboxCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        return (React.createElement("label", { className: "rg-checkbox-container" },
            React.createElement("input", { type: "checkbox", className: "rg-checkbox-cell-input", checked: cell.value, onChange: function (e) { return onCellChanged(__assign({}, cell, { value: !cell.value }), true); } }),
            React.createElement("span", { className: "rg-checkbox-checkmark" })));
    };
    return CheckboxCellTemplate;
}());
export { CheckboxCellTemplate };
