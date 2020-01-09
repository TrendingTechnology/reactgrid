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
    const isBottomRowFrozen = frozenBottomRange.rows.some(r => row.idx === r.idx);
    const shouldScrollToBottom = () => ((location.cellY ? row.top + location.cellY : row.bottom) > visibleScrollAreaHeight + scrollTop - 4) || state.cellMatrix.last.row.idx === row.idx;
    const shouldScrollToTop = () => row.top + (location.cellY ? location.cellY : 0) < scrollTop + 1 && !isBottomRowFrozen;
    const isRowBelowBottomPane = () => row.bottom > visibleScrollAreaHeight + scrollTop;
    const isRowBelowTopPane = () => row.top < scrollTop && !isBottomRowFrozen;

    const hasTopFrozens = () => frozenTopRange.rows.length > 0;
    const hasBottomFrozens = () => frozenBottomRange.rows.length > 0;

    const isFocusLocationOnTopFrozen = () => frozenTopRange.last.row && row.idx <= frozenTopRange.last.row.idx;
    const isFocusLocationOnBottomFrozen = () => frozenBottomRange.first.row && row.idx >= frozenBottomRange.first.row.idx;

    if (!hasTopFrozens() && shouldScrollToBottom() || isRowBelowBottomPane()) {
        if (location.cellY) {
            return rows[row.idx + 1] ? rows[row.idx + 1].top - visibleScrollAreaHeight + 1 : rows[row.idx].bottom - visibleScrollAreaHeight + 1;
        } else {
            return row.bottom - visibleScrollAreaHeight + 1;
        }
    } else if (hasBottomFrozens() && isRowBelowBottomPane() && isFocusLocationOnBottomFrozen()) {
        return row.bottom - visibleScrollAreaHeight;
    } else if (frozenTopRange.rows.length === 0 && shouldScrollToTop()) {
        if (location.cellY) {
            return rows[row.idx - 1] ? rows[row.idx - 1].top - 1 : rows[row.idx].top - 1;
        } else {
            return row.top - 1;
        }
    } else if (isRowBelowTopPane() && state.focusedLocation && state.focusedLocation.row.idx > frozenTopRange.rows.length && !isFocusLocationOnTopFrozen()) {
        return row.top - 1;
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
    const isFocusOnRightColFrozen = frozenRightRange.columns.some(col => column.idx === col.idx);
    const isColumnBelowRightPane = () => column.right > visibleScrollAreaWidth + scrollLeft;
    const isColumnBelowLeftPane = () => column.left < scrollLeft && !isFocusOnRightColFrozen;
    const shouldScrollToRight = () => (location.cellX ? column.left + location.cellX : column.right) > visibleScrollAreaWidth + scrollLeft - 1 || state.cellMatrix.last.column.idx === column.idx || isColumnBelowRightPane();
    const shouldScrollToLeft = () => (column.left + (location.cellX ? location.cellX : 0) < scrollLeft + 1) && !isFocusOnRightColFrozen;

    const hasRightFrozens = () => frozenRightRange.columns.length > 0;
    const hasLeftFrozens = () => frozenLeftRange.columns.length > 0;
    const isFocusLocationOnRightFrozen = () => hasRightFrozens() && column.idx > frozenRightRange.columns[0].idx;
    const isFocusLocationOnLeftFrozen = () => hasLeftFrozens() && column.idx < frozenLeftRange.columns.length;

    if (!hasRightFrozens() && shouldScrollToRight()) {
        if (location.cellX) {
            return cols[column.idx] ? cols[column.idx].right - visibleScrollAreaWidth + 1 : cols[column.idx].right - visibleScrollAreaWidth + 1;
        } else {
            return column.right - visibleScrollAreaWidth + 1;
        }
    } else if (isColumnBelowRightPane() && hasRightFrozens() && !isFocusLocationOnRightFrozen()) {
        if (isFocusLocationOnLeftFrozen()) {
            return cols[column.idx - 1].left;
        }
        return column.right - visibleScrollAreaWidth + 1;
    } else if (!hasLeftFrozens() && shouldScrollToLeft()) {
        if (location.cellX) {
            return cols[column.idx - 1] ? cols[column.idx - 1].left - 1 : cols[column.idx].left - 1;
        } else {
            return column.left - 1;
        }
    } else if (isColumnBelowLeftPane() && !isFocusLocationOnLeftFrozen()) {
        return column.left - 1;
    }
    return scrollLeft;
}
