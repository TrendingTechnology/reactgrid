import * as React from 'react';
import { keyCodes } from '../Common/Constants';
var CheckboxCellTemplate = (function () {
    function CheckboxCellTemplate() {
        this.renderContent = function (props) {
            return (React.createElement("label", { className: "rg-checkbox-container" },
                React.createElement("input", { type: "checkbox", className: "rg-checkbox-cell-input", checked: props.cellData, onChange: function () { return props.onCellDataChanged(!props.cellData, true); } }),
                React.createElement("span", { className: "rg-checkbox-checkmark" })));
        };
    }
    CheckboxCellTemplate.prototype.isValid = function (cellData) {
        return typeof (cellData) === 'boolean';
    };
    CheckboxCellTemplate.prototype.textToCellData = function (text) {
        return text === 'true';
    };
    CheckboxCellTemplate.prototype.cellDataToText = function (cellData) {
        return cellData ? 'true' : '';
    };
    CheckboxCellTemplate.prototype.handleKeyDown = function (cellData, keyCode, ctrl, shift, alt, props) {
        if (keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER)
            cellData = !cellData;
        return { cellData: cellData, enableEditMode: false };
    };
    return CheckboxCellTemplate;
}());
export { CheckboxCellTemplate };
