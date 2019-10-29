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
var Location = (function () {
    function Location(row, col) {
        this.row = row;
        this.col = col;
    }
    Object.defineProperty(Location.prototype, "cell", {
        get: function () { return this.row.cells[this.col.idx]; },
        enumerable: true,
        configurable: true
    });
    ;
    Location.prototype.equals = function (location) {
        return location && this.col.idx === location.col.idx && this.row.idx === location.row.idx;
    };
    return Location;
}());
export { Location };
var PointerLocation = (function (_super) {
    __extends(PointerLocation, _super);
    function PointerLocation(row, col, viewportX, viewportY, cellX, cellY) {
        var _this = _super.call(this, row, col) || this;
        _this.row = row;
        _this.col = col;
        _this.viewportX = viewportX;
        _this.viewportY = viewportY;
        _this.cellX = cellX;
        _this.cellY = cellY;
        return _this;
    }
    return PointerLocation;
}(Location));
export { PointerLocation };
