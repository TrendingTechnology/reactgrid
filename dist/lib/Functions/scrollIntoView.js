export function scrollIntoView(state, location, direction) {
    if (direction === void 0) { direction = 'both'; }
    var top = getScrollTop(state, location, direction === 'horizontal');
    var left = getScrollLeft(state, location, direction === 'vertical');
    state.viewportElement.scrollTop = top;
    state.viewportElement.scrollLeft = left;
}
function getScrollTop(state, location, dontChange) {
    var row = location.row;
    var _a = state.viewportElement, scrollTop = _a.scrollTop, clientHeight = _a.clientHeight;
    var _b = state.cellMatrix, frozenTopRange = _b.frozenTopRange, frozenBottomRange = _b.frozenBottomRange, rows = _b.rows;
    if (dontChange || !row)
        return scrollTop;
    var visibleContentHeight = Math.min(clientHeight, state.cellMatrix.height);
    var visibleScrollAreaHeight = visibleContentHeight - frozenTopRange.height - frozenBottomRange.height;
    var isBottomRowFrozen = frozenBottomRange.rows.some(function (r) { return row.idx === r.idx; });
    var shouldScrollToBottom = function () { return ((location.cellY ? row.top + location.cellY : row.bottom) > visibleScrollAreaHeight + scrollTop - 4) || state.cellMatrix.last.row.idx === row.idx; };
    var shouldScrollToTop = function () { return row.top + (location.cellY ? location.cellY : 0) < scrollTop + 1 && !isBottomRowFrozen; };
    var isColumnBelowBottomPane = function () { return row.bottom > visibleScrollAreaHeight + scrollTop; };
    var isColumnBelowTopPane = function () { return row.top < scrollTop && !isBottomRowFrozen; };
    if (frozenBottomRange.rows.length === 0 && shouldScrollToBottom() || isColumnBelowBottomPane()) {
        if (location.cellY) {
            return rows[row.idx + 1] ? rows[row.idx + 1].top - visibleScrollAreaHeight + 1 : rows[row.idx].bottom - visibleScrollAreaHeight + 1;
        }
        else {
            return row.bottom - visibleScrollAreaHeight + 1;
        }
    }
    else if (isColumnBelowBottomPane() && (state.focusedLocation && frozenBottomRange.rows.length > 0) && state.focusedLocation.row.idx < frozenBottomRange.rows[0].idx) {
        return row.bottom - visibleScrollAreaHeight;
    }
    else if (frozenTopRange.rows.length === 0 && shouldScrollToTop()) {
        if (location.cellY) {
            return rows[row.idx - 1] ? rows[row.idx + -1].top - 1 : rows[row.idx].top - 1;
        }
        else {
            return row.top - 1;
        }
    }
    else if (isColumnBelowTopPane() && state.focusedLocation && state.focusedLocation.row.idx > frozenTopRange.rows.length) {
        return row.top - 1;
    }
    else {
        return scrollTop;
    }
}
function getScrollLeft(state, location, dontChange) {
    var column = location.column;
    var _a = state.viewportElement, scrollLeft = _a.scrollLeft, clientWidth = _a.clientWidth;
    var _b = state.cellMatrix, frozenLeftRange = _b.frozenLeftRange, frozenRightRange = _b.frozenRightRange, cols = _b.columns;
    if (dontChange || !column)
        return scrollLeft;
    var visibleContentWidth = Math.min(clientWidth, state.cellMatrix.width);
    var visibleScrollAreaWidth = visibleContentWidth - frozenLeftRange.width - frozenRightRange.width;
    var isFocusOnRightColFrozen = frozenRightRange.columns.some(function (col) { return column.idx === col.idx; });
    var isColumnBelowRightPane = function () { return column.right > visibleScrollAreaWidth + scrollLeft; };
    var isColumnBelowLeftPane = function () { return column.left < scrollLeft && !isFocusOnRightColFrozen; };
    var shouldScrollToRight = function () { return (location.cellX ? column.left + location.cellX : column.right) > visibleScrollAreaWidth + scrollLeft - 1 || state.cellMatrix.last.column.idx === column.idx || isColumnBelowRightPane(); };
    var shouldScrollToLeft = function () { return (column.left + (location.cellX ? location.cellX : 0) < scrollLeft + 1) && !isFocusOnRightColFrozen; };
    var isFocusedAndHasRightFrozens = function () { return state.focusedLocation && frozenRightRange.columns.length > 0; };
    var isFocusOnRightFrozen = function () { return state.focusedLocation && frozenRightRange.columns.length > 0 && state.focusedLocation.column.idx > frozenRightRange.columns[0].idx; };
    var isFocusOnLeftFrozen = function () { return state.focusedLocation && state.focusedLocation.column.idx >= frozenLeftRange.columns.length; };
    if (frozenRightRange.columns.length === 0 && shouldScrollToRight()) {
        if (location.cellX) {
            return cols[column.idx] ? cols[column.idx].right - visibleScrollAreaWidth + 1 : cols[column.idx].right - visibleScrollAreaWidth + 1;
        }
        else {
            return column.right - visibleScrollAreaWidth + 1;
        }
    }
    else if (isColumnBelowRightPane() && isFocusedAndHasRightFrozens() && !isFocusOnRightFrozen()) {
        return column.right - visibleScrollAreaWidth + 1;
    }
    else if (frozenLeftRange.columns.length === 0 && shouldScrollToLeft()) {
        if (location.cellX) {
            return cols[column.idx - 1] ? cols[column.idx + -1].left - 1 : cols[column.idx].left - 1;
        }
        else {
            return column.left - 1;
        }
    }
    else if (isColumnBelowLeftPane() || isFocusOnLeftFrozen() && !isFocusOnLeftFrozen()) {
        return column.left - 1;
    }
    else {
        return scrollLeft;
    }
}
