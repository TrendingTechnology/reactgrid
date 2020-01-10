import { State, Direction, PointerLocation } from '../Model';
import { isBrowserIE, isBrowserEdge } from '../Functions';

export function scrollIntoView(state: State, location: any, direction: Direction = 'both') {
    const top = getScrollTop(state, location, direction === 'horizontal');
    const left = getScrollLeft(state, location, direction === 'vertical');

    if (isBrowserIE() || isBrowserEdge()) {
        // TODO use viewportElement in LegacyRenderer
        state.hiddenScrollableElement.scrollTop = top;
        state.hiddenScrollableElement.scrollLeft = left;
    } else {
        state.viewportElement.scrollTop = top;
        state.viewportElement.scrollLeft = left;
    }
}

function getScrollTop(state: State, location: PointerLocation, dontChange: boolean): number {
    const row = location.row;
    const { scrollTop, clientHeight } = state.viewportElement;
    const { frozenTopRange, frozenBottomRange, rows } = state.cellMatrix;
    if (dontChange || !row) return scrollTop;

    const visibleContentHeight = Math.min(clientHeight, state.cellMatrix.height);
    const visibleScrollAreaHeight = visibleContentHeight - frozenTopRange.height - frozenBottomRange.height;

    const hasTopFrozens = () => frozenTopRange.rows.length > 0;
    const hasBottomFrozens = () => frozenBottomRange.rows.length > 0;

    const isFocusLocationOnTopFrozen = () => hasTopFrozens() && row.idx <= frozenTopRange.last.row.idx;
    const isFocusLocationOnBottomFrozen = () => hasBottomFrozens() && row.idx >= frozenBottomRange.first.row.idx;

    if (isFocusLocationOnTopFrozen() || isFocusLocationOnBottomFrozen()) {
        return scrollTop;
    }

    const isBottomRowFrozen = () => frozenBottomRange.rows.some(r => row.idx === r.idx);
    const isRowBelowBottomPane = () => row.bottom > visibleScrollAreaHeight + scrollTop;
    const isRowBelowTopPane = () => row.top < scrollTop && !isBottomRowFrozen();
    const isLastRow = () => state.cellMatrix.last.row.idx === row.idx;
    const shouldScrollToTop = () => row.top + (location.cellY ? location.cellY : 0) < scrollTop + 1 && !isLastRow() &&
        !isFocusLocationOnBottomFrozen() || isFocusLocationOnTopFrozen() || isRowBelowTopPane();
    const shouldScrollToBottom = () => (location.cellY ? row.top + location.cellY : row.bottom) > visibleScrollAreaHeight + scrollTop - 4 ||
        isFocusLocationOnBottomFrozen() || isLastRow() || isRowBelowBottomPane();

    if (shouldScrollToTop()) {
        if (hasTopFrozens() || !location.cellY) {
            return row.top - 1;
        } else {
            return rows[row.idx].top - 1;
        }
    }
    if (shouldScrollToBottom()) {
        if (hasBottomFrozens() || location.cellY) {
            return rows[row.idx].bottom - visibleScrollAreaHeight + 1
        } else {
            return row.bottom - visibleScrollAreaHeight + 1;
        }
    }
    return scrollTop;
}

function getScrollLeft(state: State, location: PointerLocation, dontChange: boolean): number {
    const column = location.column;
    const { scrollLeft, clientWidth } = state.viewportElement;
    const { frozenLeftRange, frozenRightRange, columns: cols } = state.cellMatrix;
    if (dontChange || !column) return scrollLeft;

    const visibleContentWidth = Math.min(clientWidth, state.cellMatrix.width);
    const visibleScrollAreaWidth = visibleContentWidth - frozenLeftRange.width - frozenRightRange.width;

    const hasLeftFrozens = () => frozenLeftRange.columns.length > 0;
    const hasRightFrozens = () => frozenRightRange.columns.length > 0;

    const isFocusLocationOnLeftFrozen = () => hasLeftFrozens() && column.idx <= frozenLeftRange.last.column.idx;
    const isFocusLocationOnRightFrozen = () => hasRightFrozens() && column.idx >= frozenRightRange.first.column.idx;

    if (isFocusLocationOnLeftFrozen() || isFocusLocationOnRightFrozen()) {
        return scrollLeft;
    }

    const isRightColumnFrozen = () => frozenRightRange.columns.some(r => column.idx === r.idx);
    const isColumnBelowRightPane = () => column.right > visibleScrollAreaWidth + scrollLeft;
    const isColumnBelowLeftPane = () => column.left < scrollLeft && !isRightColumnFrozen();
    const isLastColumn = () => state.cellMatrix.last.column.idx === column.idx;
    const shouldScrollToTop = () => column.left + (location.cellX ? location.cellX : 0) < scrollLeft + 1 && !isLastColumn() &&
        !isFocusLocationOnRightFrozen() || isFocusLocationOnLeftFrozen() || isColumnBelowLeftPane();
    const shouldScrollToBottom = () => (location.cellX ? column.left + location.cellX : column.right) > visibleScrollAreaWidth + scrollLeft - 4 ||
        isFocusLocationOnRightFrozen() || isLastColumn() || isColumnBelowRightPane();

    if (shouldScrollToTop()) {
        if (hasLeftFrozens() || !location.cellX) {
            return column.left - 1;
        } else {
            return cols[column.idx].left - 1;
        }
    }
    if (shouldScrollToBottom()) {
        if (hasRightFrozens() || location.cellX) {
            return cols[column.idx].right - visibleScrollAreaWidth + 1
        } else {
            return column.right - visibleScrollAreaWidth + 1;
        }
    }
    return scrollLeft;
}
