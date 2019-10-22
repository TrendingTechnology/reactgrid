import { GridColumn, GridRow, Range, State } from '../Model';

export function recalcVisibleRange(state: State): State {
    console.log('recalc')
    const matrix = state.cellMatrix;
    const { scrollTop, scrollLeft, clientWidth, clientHeight } = state.hiddenScrollableElement ? state.hiddenScrollableElement : state.viewportElement;
    const scrollAreaWidth = clientWidth - matrix.frozenLeftRange.width - matrix.frozenRightRange.width;
    const scrollAreaHeight = clientHeight - matrix.frozenTopRange.height - matrix.frozenBottomRange.height;
    // TODO improve calculation of visibleCols & visibleRows - this filter is very inefficient for big tables
    const visibleCols = matrix.scrollableRange.cols.filter((col: GridColumn) => col.right >= scrollLeft && col.left <= scrollLeft + scrollAreaWidth);
    const visibleRows = matrix.scrollableRange.rows.filter((row: GridRow) => row.bottom >= scrollTop && row.top <= scrollTop + scrollAreaHeight);
    const visibleRange = new Range(visibleCols, visibleRows);
    return {
        ...state,
        minScrollLeft: visibleRange.first.column == undefined ? 0 : visibleRange.first.column.left,
        maxScrollLeft: visibleRange.last.column == undefined ? 0 : visibleRange.last.column.right - scrollAreaWidth,
        minScrollTop: visibleRows.length > 0 ? visibleRange.first.row.top : 0,
        maxScrollTop: visibleCols.length > 0 ? (visibleRange.last.row == undefined ? 0 : visibleRange.last.row.bottom - scrollAreaHeight) : 0,
        visibleRange: visibleRange
    };
}
