import * as React from 'react';
import { MenuOption, State, PointerEvent, KeyboardEvent, ClipboardEvent } from '../Model';
interface LegacyBrowserGridRendererProps {
    state: State;
    viewportElementRefHandler: (viewportElement: HTMLDivElement) => void;
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
    onCopy: (event: ClipboardEvent) => void;
    onCut: (event: ClipboardEvent) => void;
    onPaste: (event: ClipboardEvent) => void;
    onPointerDown: (event: PointerEvent) => void;
    onContextMenu: (event: PointerEvent) => void;
    onRowContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
    onColumnContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
    onRangeContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
}
export declare class LegacyBrowserGridRenderer extends React.Component<LegacyBrowserGridRendererProps> {
    private frozenTopScrollableElement;
    private frozenRightScrollableElement;
    private frozenBottomScrollableElement;
    private frozenLeftScrollableElement;
    render(): JSX.Element;
    private hiddenScrollableElementRefHandler;
    private frozenTopScrollableElementRefHandler;
    private frozenRightScrollableElementRefHandler;
    private frozenBottomScrollableElementRefHandler;
    private frozenLeftScrollableElementRefHandler;
    private scrollHandler;
    private isClickedOutOfGrid;
    private isHorizontalScrollbarVisible;
    private isVerticalScrollbarVisible;
}
export declare function copySelectedRangeToClipboardInIE(state: State, removeValues?: boolean): void;
export {};
