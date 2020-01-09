import { State, Behavior, PointerEvent, PointerLocation, Direction, DropPosition, Id, GridRow } from '../Model';

// TODO do a total rewrite here
export class RowReorderBehavior extends Behavior {
    // TODO dont use internal state. Always fresh recalculation based on input data!
    private initialRowIdx!: number;
    private lastPossibleDropLocation?: PointerLocation;
    private pointerOffset!: number;
    private selectedIds!: Id[];
    private selectedIdxs!: number[];
    private topOffset!: number;
    private bottomOffset!: number;
    private distanceToUpSelectionEdge!: number;
    private distanceToDownSelectionEdge!: number;
    private selectedRow!: GridRow;
    private position!: DropPosition;
    autoScrollDirection: Direction = 'vertical';

    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State {
        this.initialRowIdx = location.row.idx;
        this.lastPossibleDropLocation = location;
        this.selectedIdxs = state.selectedIndexes.sort();
        const rows = this.selectedIdxs.map(i => state.cellMatrix.rows[i]);
        const upperIndexes = this.selectedIdxs.filter(i => i < location.row.idx);
        const upperRows = upperIndexes.map(i => state.cellMatrix.rows[i]);
        const upperRowsHeight = upperRows.reduce((sum, row) => sum + row.height!, 0);
        this.pointerOffset = upperRowsHeight + location.cellY;
        this.distanceToDownSelectionEdge = location.viewportY - this.getTopXViewport(state);
        this.topOffset = this.getTopXViewport(state);
        this.bottomOffset = this.getBottomXViewport(state);
        this.distanceToUpSelectionEdge = this.getBottomXViewport(state) - location.viewportY;

        return {
            ...state,
            linePosition: this.topOffset,
            lineOrientation: 'horizontal',
            shadowSize: rows.reduce((sum, row) => sum + row.height, 0),
            shadowPosition: this.getShadowPosition(location, state)
        };
    }

    getTopXViewport(state: State): number {
        const upperRows = this.selectedIdxs.map(i => state.cellMatrix.rows[i].top);
        return Math.min(...upperRows);
    }

    getBottomXViewport(state: State): number {
        const bottomRows = this.selectedIdxs.map(i => state.cellMatrix.rows[i].bottom);
        return Math.max(...bottomRows);
    }

    // handlePointerMove(event: PointerEvent, location: PointerLocation, state: State): State {
    //     const shadowPosition = this.getShadowPosition(location, state);
    //     let shadowCursor = '-webkit-grabbing';
    //     let linePosition = state.linePosition;
    //     const pointerLocation = location.viewportY + state.viewportElement.scrollTop;
    //     this.lastPossibleDropLocation = this.getLastPossibleDropLocation(state, location);
    //     if (this.lastPossibleDropLocation && this.lastPossibleDropLocation.row.idx !== this.initialRowIdx) {
    //         const drawDown = this.lastPossibleDropLocation.row.idx > this.initialRowIdx;
    //         linePosition = Math.min(this.lastPossibleDropLocation.viewportY - this.lastPossibleDropLocation.cellY + (drawDown ? this.lastPossibleDropLocation.row.height : 0) + state.viewportElement.scrollTop, state.visibleRange.height + state.cellMatrix.frozenTopRange.height + state.cellMatrix.frozenBottomRange.height + state.viewportElement.scrollTop);
    //         if (!state.props.canReorderRows) {
    //             this.position = drawDown ? 'after' : 'before';
    //         } else {
    //             if (state.props.canReorderRows && state.props.canReorderRows(this.lastPossibleDropLocation.row.rowId, this.selectedIds, this.position)) {
    //                 if (drawDown) {
    //                     if (pointerLocation > location.row.top && pointerLocation < location.row.top + location.row.height / 2) {
    //                         this.position = 'on';
    //                         shadowCursor = 'move';
    //                         linePosition = -1;
    //                     } else {
    //                         this.position = 'after';
    //                     }
    //                 } else {
    //                     if (pointerLocation > location.row.top + location.row.height / 2 && pointerLocation < location.row.top + location.row.height) {
    //                         this.position = 'on';
    //                         shadowCursor = 'move';
    //                         linePosition = -1;
    //                     } else {
    //                         this.position = 'before';
    //                     }
    //                 }
    //             } else {
    //                 linePosition = -1;
    //             }
    //         }
    //     }

    //     return {
    //         ...state,
    //         shadowPosition: this.getShadowPosition(location, state)
    //     };
    // }

    getXPositionForSelection(state: State, edge: number, isDown: boolean): number {
        const row = state.cellMatrix.rows.find((gridRow: GridRow) => {
            return (!isDown) ? gridRow.top <= edge && gridRow.bottom > edge : gridRow.top < edge && gridRow.bottom >= edge;
        });
        if (row === undefined) {
            return 0;
        }
        return isDown ? row.bottom : row.top;
    }

    getEdgePosition(state: State, location: PointerLocation, isDown: boolean): number {
        const selectedRow = state.cellMatrix.rows.find((gridRow: GridRow) => {
            return gridRow.idx === this.initialRowIdx;
        });
        if (selectedRow === undefined) {
            return 0;
        }
        else {
            if (location.viewportX >= this.topOffset && location.viewportX <= this.bottomOffset){
                return this.topOffset;
            } 
            else {
                return location.viewportX;
            }
        }
    }

    getShadowPosition(location: PointerLocation, state: State): number {
        const y = location.viewportY + state.viewportElement.scrollTop - this.pointerOffset;
        const max = state.cellMatrix.height - state.shadowSize;
        if (y < 0) {
            return 0;
        } else if (y > max) {
            return max;
        }
        return y;
    }

    // handlePointerEnter(event: PointerEvent, location: PointerLocation, state: State): State{
    //     const dropLocation = this.getLastPossibleDropLocation(state, location);
    //     let linePosition = this.upOffset;
    //     if(!dropLocation) return {
    //         ...state,
    //         linePosition
    //     }
    //     const drawDown = dropLocation.row.idx > this.initialRowIdx;
    //     const edgePosistion = this.getEdgePosition(state, location, drawDown);
    //     linePosition = Math.min((drawDown ? this.getXPositionForSelection(state, edgePosistion, drawDown) : this.getXPositionForSelection(state, edgePosistion, drawDown)) + state.viewportElement.scrollTop,
    //         state.visibleRange.width + state.cellMatrix.frozenTopRange.width + state.cellMatrix.frozenBottomRange.width + state.viewportElement.scrollTop
    //     )
    //     this.lastPossibleDropLocation = dropLocation;
    //     console.log(dropLocation);
    //     return{
    //         ...state,
    //         linePosition
    //     }
    // }

    getLastPossibleDropLocation(state: State, currentLocation: PointerLocation): PointerLocation | undefined {
        if (!state.props.canReorderRows || state.props.canReorderRows(currentLocation.row.rowId, this.selectedIds, this.position)) {
            return (currentLocation);
        }
        return this.lastPossibleDropLocation;
    }

    // getLastPossibleDropLocation(currentLocation: PointerLocation, state: State): PointerLocation | undefined {
    //     const position = currentLocation.row.idx <= this.initialRowIdx ? 'before' : 'after';
    //     const rowIds = this.selectedIdxs.map(i => state.cellMatrix.rows[i].rowId);
    //     if (!state.props.canReorderRows || state.props.canReorderRows(currentLocation.row.rowId, rowIds, position)) {
    //         return currentLocation;
    //     }
    //     return this.lastPossibleDropLocation;
    // }

    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State {
        if (location.row.idx !== this.initialRowIdx && this.lastPossibleDropLocation && state.props.onRowsReordered) {
            state.props.onRowsReordered(this.lastPossibleDropLocation.row.rowId, this.selectedIds, this.position);
        }
        return {
            ...state,
            linePosition: -1,
            shadowPosition: -1,
            shadowCursor: 'default'
        };
    }
}
