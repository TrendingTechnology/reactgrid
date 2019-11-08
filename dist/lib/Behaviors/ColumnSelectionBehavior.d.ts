import { State, Location, Behavior, Direction } from '../Model';
import { PointerEvent } from '../Functions/domEvents';
export declare class ColumnSelectionBehavior extends Behavior {
    autoScrollDirection: Direction;
    handlePointerDown(event: PointerEvent, location: Location, state: State): State;
    handlePointerEnter(event: PointerEvent, location: Location, state: State): State;
}
