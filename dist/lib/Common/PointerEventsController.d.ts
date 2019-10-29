/// <reference types="react" />
import { State, StateUpdater } from ".";
export declare class PointerEventsController {
    private readonly updateState;
    constructor(updateState: StateUpdater);
    private eventTimestamps;
    private eventLocations;
    private currentIndex;
    private pointerDownLocation?;
    handlePointerDown: (event: import("react").PointerEvent<HTMLDivElement>, state: State) => State;
    private handlePointerMove;
    private handlePointerUp;
}
