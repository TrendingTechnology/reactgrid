var HeaderCellTemplate = (function () {
    function HeaderCellTemplate() {
        this.isReadonly = function () { return true; };
        this.isValid = function (cellData) { return (typeof (cellData) === 'string'); };
        this.isFocusable = function () { return false; };
        this.cellDataToText = function (cellData) { return cellData; };
        this.getCustomStyle = function (cellData) { return ({ background: '#f3f3f3' }); };
        this.renderContent = function (props) { return props.cellData; };
    }
    return HeaderCellTemplate;
}());
export { HeaderCellTemplate };
