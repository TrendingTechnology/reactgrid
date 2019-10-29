import * as React from "react";
import { MenuOption, State, KeyboardEvent, ClipboardEvent, PointerEvent } from "../Common";
interface DefaultGridRendererProps {
    state: State;
    viewportElementRefHandler: (viewportElement: HTMLDivElement) => void;
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
    onScroll: () => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
    onPointerDown: (event: PointerEvent) => void;
    onCopy: (event: ClipboardEvent) => void;
    onCut: (event: ClipboardEvent) => void;
    onPaste: (event: ClipboardEvent) => void;
    onPasteCapture: (event: ClipboardEvent) => void;
    onContextMenu: (event: PointerEvent) => void;
    onRowContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
    onColumnContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
    onRangeContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
}
export declare const DefaultGridRenderer: React.FunctionComponent<DefaultGridRendererProps>;
export {};
