import { State, Behavior, KeyboardEvent, ClipboardEvent, PointerEvent, Location, PointerLocation, Cell } from "../Common";
export interface ClipboardData {
    type?: string | null;
    data: any;
    text: string;
}
export declare class DefaultBehavior extends Behavior {
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    private getNewBehavior;
    handleContextMenu(event: PointerEvent, state: State): State;
    handleDoubleClick(event: PointerEvent, location: Location, state: State): State;
    handleKeyDown(event: KeyboardEvent, state: State): State;
    handleKeyUp(event: KeyboardEvent, state: State): State;
    handleCopy(event: ClipboardEvent, state: State): State;
    handlePaste(event: ClipboardEvent, state: State): State;
    handleCut(event: ClipboardEvent, state: State): State;
}
export declare function validateOuterData(state: State, clipboardData: ClipboardData): Cell;
export declare function pasteData(state: State, pasteContent: ClipboardData[][]): State;
export declare function copySelectedRangeToClipboard(state: State, removeValues?: boolean): void;
export declare function copySelectedRangeToClipboardInIE(state: State, removeValues?: boolean): void;
