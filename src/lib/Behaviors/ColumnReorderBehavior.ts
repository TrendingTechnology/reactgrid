import { State, Behavior, PointerEvent, PointerLocation, Direction, GridColumn } from '../Model';
import { stat } from 'fs';

export class ColumnReorderBehavior extends Behavior {
    private initialColumnIdx!: number;
    private lastPossibleDropLocation?: PointerLocation;
    private pointerOffset!: number;
    private selectedIdxs!: number[];
    private rightOffset!: number;
    private leftOffset!: number;
    autoScrollDirection: Direction = 'horizontal';

    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State {
        this.initialColumnIdx = location.column.idx;
        this.lastPossibleDropLocation = location;
        this.selectedIdxs = state.selectedIndexes.sort();
        const columns = this.selectedIdxs.map(i => state.cellMatrix.columns[i]);
        const leftIndexes = this.selectedIdxs.filter(i => i < location.column.idx);
        const leftColumns = leftIndexes.map(i => state.cellMatrix.columns[i]);
        const leftColumnsWidth = leftColumns.reduce((sum, col) => sum + col.width!, 0);
        this.pointerOffset = leftColumnsWidth + location.cellX;
        // this.leftOffset = location.viewportX - this.getLeftXViewport(state);
        this.leftOffset = this.getLeftXViewport(state);
        this.rightOffset = this.getRightXViewport(state) - location.viewportX;
        // this.rightOffset = this.getRightXViewport(state);

        return {
            ...state,
            linePosition: this.leftOffset,
            lineOrientation: 'vertical',
            shadowSize: columns.reduce((sum, col) => sum + col.width!, 0),
            shadowPosition: this.getShadowPosition(location, state)
        }
    }

    handlePointerMove(event: PointerEvent, location: PointerLocation, state: State): State {
        return {
            ...state,
            shadowPosition: this.getShadowPosition(location, state)
        }
    }

    getShadowPosition(location: PointerLocation, state: State): number {
        const x = location.viewportX + state.viewportElement.scrollLeft - this.pointerOffset;
        const max = state.cellMatrix.width - state.shadowSize;
        if (x < 0) {
            return 0;
        } else if (x > max) {
            return max;
        }
        return x;
    }

    getLeftXViewport(state: State): number {
        const leftColumns = this.selectedIdxs.map(i => state.cellMatrix.columns[i].left);
        return Math.min(...leftColumns);
    }

    getRightXViewport(state: State): number {
        const rightColumns = this.selectedIdxs.map(i => state.cellMatrix.columns[i].right);
        return Math.max(...rightColumns);
    }

    getXPositionForSelection(state: State, edge: number, isRight: boolean): number {
        const column = state.cellMatrix.columns.find((gridColumn: GridColumn) => {
            return gridColumn.left <= edge && gridColumn.right >= edge;
        });
        if (column === undefined) {
            return 0;
        }
        return isRight ? column.right : column.left;
    }

    handlePointerEnter(event: PointerEvent, location: PointerLocation, state: State): State {
        const dropLocation = this.getLastPossibleDropLocation(location, state)
        let linePosition = this.leftOffset;
        if (!dropLocation) return {
            ...state,
            linePosition
        }
        const drawRight = dropLocation.column.idx > this.initialColumnIdx;
        console.log("Pierwszy: ", linePosition);
        linePosition = Math.min((drawRight ? this.getXPositionForSelection(state, dropLocation.viewportX + this.rightOffset, drawRight) : this.getXPositionForSelection(state, dropLocation.viewportX, drawRight)) + state.viewportElement.scrollLeft,
            state.visibleRange.width + state.cellMatrix.frozenLeftRange.width + state.cellMatrix.frozenRightRange.width + state.viewportElement.scrollLeft
        )
        this.lastPossibleDropLocation = dropLocation;
        console.log("Drugi: ", linePosition);
        return {
            ...state,
            linePosition
        }
    }

    getLastPossibleDropLocation(currentLocation: PointerLocation, state: State): PointerLocation | undefined {
        const position = currentLocation.column.idx <= this.initialColumnIdx ? 'before' : 'after';
        const columnIds = this.selectedIdxs.map(i => state.cellMatrix.columns[i].columnId);
        if (!state.props.canReorderColumns || state.props.canReorderColumns(currentLocation.column.columnId, columnIds, position)) {
            return currentLocation;
        }
        return this.lastPossibleDropLocation;
    }

    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State {
        if (this.initialColumnIdx !== location.column.idx && this.lastPossibleDropLocation && state.props.onColumnsReordered) {
            const isBefore = this.lastPossibleDropLocation.column.idx <= this.initialColumnIdx;
            const columnIds = this.selectedIdxs.map(i => state.cellMatrix.columns[i].columnId);
            state.props.onColumnsReordered(this.lastPossibleDropLocation.column.columnId, columnIds, isBefore ? 'before' : 'after');
        }
        return {
            ...state,
            linePosition: -1,
            shadowPosition: -1
        };
    }
}
