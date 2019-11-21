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
import { isNavigationKey, isAlphaNumericKey } from './keyCodeCheckings';
import { getCellProperty } from '../Functions/getCellProperty';
var GroupCellTemplate = (function () {
    function GroupCellTemplate() {
    }
    GroupCellTemplate.prototype.getCompatibleCell = function (uncertainCell) {
        var text = getCellProperty(uncertainCell, 'text', 'string');
        var value = parseFloat(text);
        return __assign(__assign({}, uncertainCell), { text: text, value: value });
    };
    GroupCellTemplate.prototype.update = function (cell, cellToMerge) {
        return this.getCompatibleCell(__assign(__assign({}, cell), { text: cellToMerge.text }));
    };
    GroupCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        var enableEditMode = keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER;
        var cellCopy = __assign({}, cell);
        var char = String.fromCharCode(keyCode);
        if (keyCode === keyCodes.SPACE && cellCopy.isExpanded !== undefined) {
            cellCopy.isExpanded = !cellCopy.isExpanded;
        }
        else if (!ctrl && !alt && isAlphaNumericKey(keyCode)) {
            cellCopy.text = !shift ? char.toLowerCase() : char;
            enableEditMode = true;
        }
        return { cell: cellCopy, enableEditMode: enableEditMode };
    };
    GroupCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        var _this = this;
        var canBeExpanded = cell.isExpanded !== undefined;
        var elementMarginMultiplier = cell.depth ? cell.depth : 0;
        return (!isInEditMode ?
            React.createElement("div", { className: "wrapper", style: { marginLeft: "calc( 1.2em * " + elementMarginMultiplier + ")" } },
                canBeExpanded &&
                    React.createElement(Chevron, { cell: cell, onCellChanged: onCellChanged }),
                React.createElement("div", { className: "wrapper-content" }, cell.text))
            :
                React.createElement("input", { ref: function (input) {
                        if (input) {
                            input.focus();
                            input.setSelectionRange(input.value.length, input.value.length);
                        }
                    }, defaultValue: cell.text, onChange: function (e) { return onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { text: e.currentTarget.value })), false); }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) {
                        if (isAlphaNumericKey(e.keyCode) || (isNavigationKey(e.keyCode)))
                            e.stopPropagation();
                    } }));
    };
    return GroupCellTemplate;
}());
export { GroupCellTemplate };
var Chevron = function (_a) {
    var cell = _a.cell, onCellChanged = _a.onCellChanged;
    return (React.createElement("div", { onPointerDown: function (e) {
            e.stopPropagation();
            onCellChanged(__assign(__assign({}, cell), { isExpanded: !cell.isExpanded }), true);
        }, className: "chevron" },
        React.createElement("div", { style: { transform: "" + (cell.isExpanded ? 'rotate(90deg)' : 'rotate(0)'), transition: '200ms all' } }, "\u276F")));
};
