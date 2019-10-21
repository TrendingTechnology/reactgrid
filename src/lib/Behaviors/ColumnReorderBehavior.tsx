import { State, Behavior, PointerEvent, PointerLocation, Direction } from '../Model';

export class ColumnReorderBehavior extends Behavior {
    private initialColumnIdx!: number;
    private lastPossibleDropLocation?: PointerLocation;
    private pointerOffset!: number;
    private selectedIdxs!: number[];
    autoScrollDirection: Direction = 'horizontal';

    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State {
        this.initialColumnIdx = location.column.idx;
        this.lastPossibleDropLocation = location;
        this.selectedIdxs = state.selectedIndexes.sort();
        const columns = this.selectedIdxs.map(i => state.cellMatrix.cols[i]);
        const leftIndexes = this.selectedIdxs.filter(i => i < location.column.idx);
        const leftColumns = leftIndexes.map(i => state.cellMatrix.cols[i]);
        const leftColumnsWidth = leftColumns.reduce((sum, col) => sum + col.width!, 0);
        this.pointerOffset = leftColumnsWidth + location.cellX;
        return {
            ...state,
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

    handlePointerEnter(event: PointerEvent, location: PointerLocation, state: State): State {
        const dropLocation = this.getLastPossibleDropLocation(location, state)
        if (!dropLocation) return state;
        const drawRight = dropLocation.column.idx > this.initialColumnIdx;
        const linePosition = Math.min(dropLocation.viewportX - dropLocation.cellX + (drawRight ? dropLocation.column.width : 0) + state.viewportElement.scrollLeft,
            state.visibleRange.width + state.cellMatrix.frozenLeftRange.width + state.cellMatrix.frozenRightRange.width + state.viewportElement.scrollLeft
        )
        return {
            ...state,
            linePosition
        }
    }

    getLastPossibleDropLocation(currentLocation: PointerLocation, state: State): PointerLocation | undefined {
        const position = currentLocation.column.idx <= this.initialColumnIdx ? 'before' : 'after';
        if (!currentLocation.column.canDrop || currentLocation.column.canDrop(this.selectedIdxs, position)) {
            return this.lastPossibleDropLocation = currentLocation;
        }
        return this.lastPossibleDropLocation;
    }

    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State {
        if (this.initialColumnIdx !== location.column.idx && this.lastPossibleDropLocation && this.lastPossibleDropLocation.column.onDrop) {
            const isBefore = this.lastPossibleDropLocation.column.idx <= this.initialColumnIdx;
            this.lastPossibleDropLocation.column.onDrop(this.selectedIdxs, isBefore ? 'before' : 'after');
        }
        return {
            ...state,
            linePosition: -1,
            shadowPosition: -1
        };
    }
}
