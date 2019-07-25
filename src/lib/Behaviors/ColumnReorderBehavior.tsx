import { State, Behavior, PointerEvent, PointerLocation, Id, Direction } from '../Common';

export class ColumnReorderBehavior extends Behavior {
    private initialColumnIdx!: number;
    private lastPossibleDropLocation?: PointerLocation;
    private shadowWidth!: number;
    private pointerOffset!: number;
    private selectedIdxs!: number[];
    autoScrollDirection: Direction = 'horizontal';

    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State {
        this.initialColumnIdx = location.col.idx;
        this.lastPossibleDropLocation = location;
        const indexes = state.selectedIndexes.sort();
        const columns = indexes.map(i => state.cellMatrix.cols[i]);
        const leftIndexes = indexes.filter(i => i < location.col.idx);
        const leftColumns = leftIndexes.map(i => state.cellMatrix.cols[i]);
        const leftColumnsWidth = leftColumns.reduce((sum, col) => sum + col.width, 0);
        this.pointerOffset = leftColumnsWidth + location.cellX;
        // changed from id to idx
        this.selectedIdxs = columns.map(c => c.idx);
        return {
            ...state,
            lineOrientation: 'vertical',
            shadowSize: columns.reduce((sum, col) => sum + col.width, 0),
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
        const x = location.viewportX - this.pointerOffset;
        const max = Math.min(state.viewportElement.clientWidth, state.cellMatrix.width) - this.shadowWidth;
        if (x < 0) {
            return 0;
        } else if (x > max) {
            return max;
        }
        return x;
    }

    handlePointerEnter(event: PointerEvent, location: PointerLocation, state: State): State {
        const dropLocation = this.getLastPossibleDropLocation(location)
        if (!dropLocation) return state;
        const drawRight = dropLocation.col.idx > this.initialColumnIdx;
        return {
            ...state,
            linePosition: dropLocation.viewportX - dropLocation.cellX + (drawRight ? dropLocation.col.width : 0) + state.viewportElement.scrollLeft
        }
    }

    getLastPossibleDropLocation(currentLocation: PointerLocation): PointerLocation | undefined {
        const position = currentLocation.col.idx <= this.initialColumnIdx ? 'before' : 'after'
        if (!currentLocation.col.canDrop || currentLocation.col.canDrop(this.selectedIdxs, position)) {
            return this.lastPossibleDropLocation = currentLocation;
        }
        return this.lastPossibleDropLocation;
    }

    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State {
        if (this.initialColumnIdx !== location.col.idx && this.lastPossibleDropLocation && this.lastPossibleDropLocation.col.onDrop) {
            const isBefore = this.lastPossibleDropLocation.col.idx <= this.initialColumnIdx;
            this.lastPossibleDropLocation.col.onDrop(this.selectedIdxs, isBefore ? 'before' : 'after');
        }
        return {
            ...state,
            linePosition: -1,
            shadowPosition: -1
        };
    }
}
