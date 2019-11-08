var HeaderCellTemplate = (function () {
    function HeaderCellTemplate() {
        this.isFocusable = function () { return false; };
        this.getStyle = function (cell) { return ({ background: '#f3f3f3' }); };
    }
    HeaderCellTemplate.prototype.validate = function (cell) {
        return cell;
    };
    HeaderCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        return cell.text;
    };
    return HeaderCellTemplate;
}());
export { HeaderCellTemplate };
