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
import { getCellProperty } from '../Functions/getCellProperty';
var HeaderCellTemplate = (function () {
    function HeaderCellTemplate() {
        this.isFocusable = function () { return false; };
        this.getStyle = function (cell) { return ({ background: '#f3f3f3' }); };
    }
    HeaderCellTemplate.prototype.getCompatibleCell = function (uncertainCell) {
        var text = getCellProperty(uncertainCell, 'text', 'string');
        var value = parseFloat(text);
        return __assign(__assign({}, uncertainCell), { text: text, value: value });
    };
    HeaderCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        return cell.text;
    };
    return HeaderCellTemplate;
}());
export { HeaderCellTemplate };
