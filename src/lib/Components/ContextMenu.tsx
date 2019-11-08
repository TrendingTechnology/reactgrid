import * as React from 'react';
import { MenuOption, Location, State } from '../Model';
import { copySelectedRangeToClipboard, pasteData } from '../Behaviors/DefaultBehavior';
import { isBrowserIE, getDataToPasteInIE } from '../Functions';

interface ContextMenuProps {
    contextMenuPosition: number[];
    focusedLocation?: Location;
    state: State;
    onRowContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
    onColumnContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
    onRangeContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
}

export class ContextMenu extends React.Component<ContextMenuProps> {
    render() {
        const { contextMenuPosition, onRowContextMenu, onColumnContextMenu, onRangeContextMenu, state } = this.props;
        const focusedLocation = state.focusedLocation;
        let contextMenuOptions: MenuOption[] = customContextMenuOptions(state);
        const rowOptions = onRowContextMenu && onRowContextMenu(customContextMenuOptions(state));
        const colOptions = onColumnContextMenu && onColumnContextMenu(customContextMenuOptions(state));
        const rangeOptions = onRangeContextMenu && onRangeContextMenu(customContextMenuOptions(state));

        if (focusedLocation) {
            if (state.selectionMode == 'row' && state.selectedIds.includes(focusedLocation.row.rowId) && rowOptions) {
                contextMenuOptions = rowOptions;
            } else if (state.selectionMode == 'column' && state.selectedIds.includes(focusedLocation.column.columnId) && colOptions) {
                contextMenuOptions = colOptions;
            } else if (state.selectionMode == 'range' && rangeOptions) {
                contextMenuOptions = rangeOptions;
            }
        }
        return (
            contextMenuPosition[0] !== -1 &&
            contextMenuPosition[1] !== -1 &&
            contextMenuOptions.length > 0 && (
                <div
                    className="rg-context-menu"
                    style={{
                        top: contextMenuPosition[0] + 'px',
                        left: contextMenuPosition[1] + 'px',
                    }}
                >
                    {contextMenuOptions.map((el, idx) => {
                        <div
                            key={idx}
                            className="rg-context-menu-option"
                            onPointerDown={e => e.stopPropagation()}
                            onClick={() => {
                                el.handler();
                                state.update((state: State) => ({ ...state, contextMenuPosition: [-1, -1] }))
                            }}
                        >
                            {el.label}
                        </div>
                    })}
                </div>
            )
        );
    }
}

function customContextMenuOptions(state: State): MenuOption[] {
    // TODO use document.execCommand('copy') and paste
    return [
        {
            id: 'copy',
            label: 'Copy',
            handler: () => copySelectedRangeToClipboard(state, false)
        },
        {
            id: 'cut',
            label: 'Cut',
            handler: () => copySelectedRangeToClipboard(state, true)
        },
        {
            id: 'paste',
            label: 'Paste',
            handler: () => {
                // TODO 
                if (isBrowserIE()) {
                    setTimeout(() => state.update((state: State) => pasteData(state, getDataToPasteInIE())));
                } else {
                    navigator.clipboard.readText().then(e => state.update((state: State) => pasteData(state, e.split('\n').map(line => line.split('\t').map(t => ({ text: t, data: t, type: 'text' }))))));
                }
            }
        }
    ];
}
