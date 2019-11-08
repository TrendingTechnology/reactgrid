import * as React from 'react';
import { MenuOption, Location, State } from '../Model';
interface ContextMenuProps {
    contextMenuPosition: number[];
    focusedLocation?: Location;
    state: State;
    onRowContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
    onColumnContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
    onRangeContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
}
export declare class ContextMenu extends React.Component<ContextMenuProps> {
    render(): false | JSX.Element;
}
export {};
