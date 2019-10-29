import * as React from 'react';
var HeaderCellTemplate = (function () {
    function HeaderCellTemplate() {
        this.isReadonly = function () { return true; };
        this.isValid = function (cellData) { return (typeof (cellData) === 'string'); };
        this.isFocusable = function () { return false; };
        this.cellDataToText = function (cellData) { return cellData; };
        this.getCustomStyle = function (cellData) { return ({ background: 'rgba(0, 0, 0, 0.07)' }); };
        this.renderContent = function (props) { return React.createElement("div", { className: "rg-header-cell" }, props.cellData); };
    }
    return HeaderCellTemplate;
}());
export { HeaderCellTemplate };
