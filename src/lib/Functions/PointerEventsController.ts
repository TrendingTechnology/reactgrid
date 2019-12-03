import { Location, State, StateUpdater, PointerEvent } from '../Model';
import { getLocationFromClient, scrollIntoView, isBrowserIE } from '.';
import { DefaultBehavior } from '../Behaviors/DefaultBehavior';
import { areLocationsEqual } from './areLocationsEqual';

export class PointerEventsController {
    constructor(private readonly updateState: StateUpdater) { }

    private eventTimestamps: number[] = [0, 0];
    private eventLocations: Array<Location | undefined> = [undefined, undefined];
    private currentIndex: number = 0;
    private pointerDownLocation?: Location;

    // TODO Handle PointerCancel
    public handlePointerDown = (event: PointerEvent, state: State): State => {
        // TODO open context menu (long hold tap)
        window.addEventListener('contextmenu', this.handleContextMenu as any);
        if (event.button !== 0 && event.button !== undefined) {
            return state;
        }
        window.addEventListener('pointermove', this.handlePointerMove as any);
        window.addEventListener('pointerup', this.handlePointerUp as any);
        window.addEventListener('pointerup', this.handlePointerUp as any);
        const previousLocation = this.eventLocations[this.currentIndex];
        const currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
        this.pointerDownLocation = currentLocation;
        this.currentIndex = 1 - this.currentIndex;
        this.eventTimestamps[this.currentIndex] = new Date().valueOf();
        this.eventLocations[this.currentIndex] = currentLocation;
        if (event.pointerType === 'mouse' || (currentLocation.row.idx === 0 || currentLocation.column.idx === 0) || areLocationsEqual(currentLocation, previousLocation) || event.pointerType === undefined) {
            // === undefined only for cypress tests
            state = state.currentBehavior.handlePointerDown(event, currentLocation, state);
        }
        return state;
    };

    private handleContextMenu = (event: PointerEvent): void => {
        this.updateState(state => {
            window.removeEventListener('pointerup', this.handlePointerUp as any);
            window.removeEventListener('pointermove', this.handlePointerMove as any);
            window.removeEventListener('contextmenu', this.handleContextMenu as any);
            const currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
            state = state.currentBehavior.handlePointerUp(event, currentLocation, state);
            state = state.currentBehavior.handleContextMenu(event, state);
            state.hiddenFocusElement.focus();
            return state;
        });
    };

    private handlePointerMove = (event: PointerEvent): void => {
        this.updateState(state => {
            const autoScrollDirection = state.currentBehavior.autoScrollDirection;
            const currentLocation = getLocationFromClient(state, event.clientX, event.clientY, autoScrollDirection);
            scrollIntoView(state, currentLocation, autoScrollDirection);
            state = state.currentBehavior.handlePointerMove(event, currentLocation, state);
            const previousLocation = this.eventLocations[this.currentIndex];
            this.eventLocations[this.currentIndex] = currentLocation;
            if (!areLocationsEqual(currentLocation, previousLocation)) {
                state = state.currentBehavior.handlePointerEnter(event, currentLocation, state);
            }
            return state;
        });
    };

    private handlePointerUp = (event: PointerEvent): void => {
        if (event.button !== 0 && event.button !== undefined) return;

        this.updateState(state => {
            window.removeEventListener('pointerup', this.handlePointerUp as any);
            window.removeEventListener('pointermove', this.handlePointerMove as any);
            window.removeEventListener('contextmenu', this.handleContextMenu as any);
            const currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
            const currentTimestamp = new Date().valueOf();
            const secondLastTimestamp = this.eventTimestamps[1 - this.currentIndex];
            state = state.currentBehavior.handlePointerUp(event, currentLocation, state);
            // TODO explain this case
            if (
                event.pointerType !== 'mouse' &&
                areLocationsEqual(currentLocation, this.pointerDownLocation) &&
                event.pointerType !== undefined && // !== undefined only for cypress tests
                currentTimestamp - this.eventTimestamps[this.currentIndex] < 500 &&
                (currentLocation.row.idx > 0 && currentLocation.column.idx > 0)
            ) {
                state = state.currentBehavior.handlePointerDown(event, currentLocation, state);
            }
            state = { ...state, currentBehavior: new DefaultBehavior() };
            if (currentTimestamp - secondLastTimestamp < 500 &&
                areLocationsEqual(currentLocation, this.eventLocations[0]) &&
                areLocationsEqual(currentLocation, this.eventLocations[1])) {
                state = state.currentBehavior.handleDoubleClick(event, currentLocation, state);
            }
            if (event.pointerType !== 'mouse' &&
                currentTimestamp - this.eventTimestamps[this.currentIndex] >= 500 &&
                areLocationsEqual(currentLocation, this.eventLocations[0]) &&
                areLocationsEqual(currentLocation, this.eventLocations[1])) {
            }
            state.hiddenFocusElement.focus();
            return state;
        });
    };
}
