import { State, Behavior, PointerEvent, PointerLocation, Direction } from '../Common';
export declare class ColumnReorderBehavior extends Behavior {
    private initialColumnIdx;
    private lastPossibleDropLocation?;
    private pointerOffset;
    private selectedIdxs;
    private selectedIds;
    autoScrollDirection: Direction;
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    handlePointerMove(event: PointerEvent, location: PointerLocation, state: State): State;
    getShadowPosition(location: PointerLocation, state: State): number;
    handlePointerEnter(event: PointerEvent, location: PointerLocation, state: State): State;
    getLastPossibleDropLocation(currentLocation: PointerLocation, state: State): PointerLocation | undefined;
    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State;
}
