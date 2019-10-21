import { StateUpdater, PointerEvent, ClipboardEvent, KeyboardEvent } from '../Model';
import { PointerEventsController } from './PointerEventsController';
import { recalcVisibleRange } from '../Functions';

export class EventHandlers {
    constructor(private updateState: StateUpdater) { }

    private pointerEventsController = new PointerEventsController(this.updateState);

    pointerDownHandler = (event: PointerEvent) => this.updateState(state => this.pointerEventsController.handlePointerDown(event, state));
    viewportElementRefHandler = (viewportElement: HTMLDivElement) => viewportElement && this.updateState(state => recalcVisibleRange({ ...state, viewportElement }));
    keyDownHandler = (event: KeyboardEvent) => this.updateState(state => state.currentBehavior.handleKeyDown(event, state));
    keyUpHandler = (event: KeyboardEvent) => this.updateState(state => state.currentBehavior.handleKeyUp(event, state));
    copyHandler = (event: ClipboardEvent) => this.updateState(state => state.currentBehavior.handleCopy(event, state));
    pasteHandler = (event: ClipboardEvent) => this.updateState(state => state.currentBehavior.handlePaste(event, state));
    cutHandler = (event: ClipboardEvent) => this.updateState(state => state.currentBehavior.handleCut(event, state));
    handleContextMenu = (event: PointerEvent) => this.updateState(state => state.currentBehavior.handleContextMenu(event, state));
    windowResizeHandler = () => this.updateState(recalcVisibleRange);

    // hiddenElementRefHandler = (hiddenFocusElement: HTMLInputElement) => {
    //     (state as State).hiddenFocusElement = hiddenFocusElement;
    // };

    pasteCaptureHandler = (event: ClipboardEvent) => {
        const htmlData = event.clipboardData!.getData('text/html');
        const parsedData = new DOMParser().parseFromString(htmlData, 'text/html');
        if (htmlData && parsedData.body.firstElementChild!.getAttribute('data-key') === 'dynagrid') {
            event.bubbles = false;
        }
    };

    scrollHandler = () =>
        this.updateState(state => {
            const { scrollTop, scrollLeft } = state.viewportElement;
            return scrollTop < state.minScrollTop || scrollTop > state.maxScrollTop || scrollLeft < state.minScrollLeft || scrollLeft > state.maxScrollLeft ? recalcVisibleRange(state) : state;
        });
}