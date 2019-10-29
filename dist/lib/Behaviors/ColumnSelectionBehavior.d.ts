import { State, Location, Behavior, Direction } from '../Common';
import { PointerEvent } from "../Common/domEvents";
export declare class ColumnSelectionBehavior extends Behavior {
    autoScrollDirection: Direction;
    handlePointerDown(event: PointerEvent, location: Location, state: State): State;
    handlePointerEnter(event: PointerEvent, location: Location, state: State): State;
}
