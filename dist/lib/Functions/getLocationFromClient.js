import { PointerLocation } from "../Common";
export function getLocationFromClient(state, clientX, clientY, favorScrollableContent) {
    var viewportX = clientX - state.viewportElement.getBoundingClientRect().left;
    var viewportY = clientY - state.viewportElement.getBoundingClientRect().top;
    var _a = getRow(state, viewportY, (favorScrollableContent === 'vertical' || favorScrollableContent === 'both')), cellY = _a[0], row = _a[1];
    var _b = getColumn(state, viewportX, (favorScrollableContent === 'horizontal' || favorScrollableContent === 'both')), cellX = _b[0], col = _b[1];
    return new PointerLocation(row, col, viewportX, viewportY, cellX, cellY);
}
function getRow(state, viewportY, favorScrollableContent) {
    var cellMatrix = state.cellMatrix;
    var visibleContentHeight = Math.min(state.viewportElement.clientHeight, cellMatrix.height);
    var bottomPaneTop = visibleContentHeight - cellMatrix.frozenBottomRange.height;
    var scrollTop = state.viewportElement.scrollTop;
    var maxScrollTop = cellMatrix.scrollableRange.height - visibleContentHeight + cellMatrix.frozenTopRange.height + cellMatrix.frozenBottomRange.height - 1;
    if (cellMatrix.frozenTopRange.rows.find(function (row) { return row.bottom > viewportY; }) && viewportY < cellMatrix.frozenTopRange.height && !(favorScrollableContent && scrollTop > 0)) {
        var row = cellMatrix.frozenTopRange.rows.find(function (row) { return row.bottom > viewportY; });
        return [viewportY - row.top, row];
    }
    else if (cellMatrix.frozenBottomRange.rows && viewportY >= bottomPaneTop && !(favorScrollableContent && scrollTop < maxScrollTop)) {
        var row = cellMatrix.frozenBottomRange.rows.find(function (row) { return row.bottom > viewportY - bottomPaneTop; }) || cellMatrix.last.row;
        return [viewportY - bottomPaneTop - row.top, row];
    }
    else {
        var scrollableContentY_1 = viewportY - cellMatrix.frozenTopRange.height + state.viewportElement.scrollTop;
        var row = cellMatrix.scrollableRange.rows.find(function (row) { return row.bottom >= scrollableContentY_1; }) || cellMatrix.scrollableRange.last.row;
        return [scrollableContentY_1 - row.top, row];
    }
}
function getColumn(state, viewportX, favorScrollableContent) {
    var cellMatrix = state.cellMatrix;
    var visibleContentWidth = Math.min(state.viewportElement.clientWidth, cellMatrix.width);
    var rightPaneLeft = visibleContentWidth - cellMatrix.frozenRightRange.width;
    var scrollLeft = state.viewportElement.scrollLeft;
    var maxScrollLeft = cellMatrix.scrollableRange.width - visibleContentWidth + cellMatrix.frozenLeftRange.width + cellMatrix.frozenRightRange.width - 1;
    if (cellMatrix.frozenLeftRange.cols.find(function (col) { return col.right > viewportX; }) && viewportX < cellMatrix.frozenLeftRange.width && !(favorScrollableContent && scrollLeft > 0)) {
        var column = cellMatrix.frozenLeftRange.cols.find(function (col) { return col.right > viewportX; });
        return [viewportX - column.left, column];
    }
    else if (cellMatrix.frozenRightRange.cols && viewportX >= rightPaneLeft && !(favorScrollableContent && scrollLeft < maxScrollLeft)) {
        var column = cellMatrix.frozenRightRange.cols.find(function (col) { return col.right > viewportX - rightPaneLeft; }) || cellMatrix.last.col;
        return [viewportX - rightPaneLeft - column.left, column];
    }
    else {
        var scrollableContentX_1 = viewportX - cellMatrix.frozenLeftRange.width + scrollLeft;
        var column = cellMatrix.scrollableRange.cols.find(function (col) { return col.right >= scrollableContentX_1; }) || cellMatrix.scrollableRange.last.col;
        return [scrollableContentX_1 - column.left, column];
    }
}
