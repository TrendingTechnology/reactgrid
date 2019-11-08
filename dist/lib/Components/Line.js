var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
var Line = (function (_super) {
    __extends(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Line.prototype.render = function () {
        var _a = this.props, cellMatrix = _a.cellMatrix, linePosition = _a.linePosition;
        var isVertical = this.props.orientation == 'vertical' ? true : false;
        return (linePosition !== -1 &&
            React.createElement("div", { className: "rg-line", style: {
                    top: isVertical ? 0 : this.props.linePosition,
                    left: isVertical ? this.props.linePosition : 0,
                    width: isVertical ? 2 : cellMatrix.width,
                    height: isVertical ? cellMatrix.height : 2,
                } }));
    };
    return Line;
}(React.Component));
export { Line };
