import { State, Location, Behavior } from '../Common';
import { PointerEvent } from "../Common/domEvents";
export declare class CellSelectionBehavior extends Behavior {
    handlePointerDown(event: PointerEvent, location: Location, state: State): State;
    handlePointerEnter(event: PointerEvent, location: Location, state: State): State;
    handleDoubleClick(event: PointerEvent, location: Location, state: State): State;
}
