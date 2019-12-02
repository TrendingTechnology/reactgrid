import * as React from 'react';
import { MenuOption, Location, State } from '../Model';
import { copySelectedRangeToClipboard, pasteData } from '../Behaviors/DefaultBehavior';
import { isBrowserIE, getDataToPasteInIE } from '../Functions';

interface ContextMenuProps {
    contextMenuPosition: {top: number, left: number};
    focusedLocation?: Location;
    state: State;
    onContextMenu?: (menuOptions: MenuOption[]) => MenuOption[];
}

export class ContextMenu extends React.Component<ContextMenuProps> {
    render() {
        const { contextMenuPosition, onContextMenu, state } = this.props;
        const focusedLocation = state.focusedLocation;
        let contextMenuOptions: MenuOption[] = customContextMenuOptions(state);
        const options = onContextMenu ? onContextMenu(customContextMenuOptions(state)) : [];
        if (focusedLocation && options.length > 0) {
            contextMenuOptions = options;
        }
        return (contextMenuOptions.length > 0 && 
            (
                <div
                    className="rg-context-menu"
                    style={{
                        top: contextMenuPosition.top + 'px',
                        left: contextMenuPosition.left + 'px',
                    }}
                >
                    {contextMenuOptions.map((el, idx) => (
                        <div
                            key={idx}
                            className="rg-context-menu-option"
                            onPointerDown={e => e.stopPropagation()}
                            onClick={() => {
                                el.handler();
                                state.update((state: State) => ({ ...state, contextMenuPosition: {top: -1, left: -1} }))
                            }}
                        >
                            {el.label}
                        </div>
                    ))}
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
                    //setTimeout(() => state.update((state: State) => pasteData(state, getDataToPasteInIE())));
                } else {
                    //navigator.clipboard.readText().then(e => state.update((state: State) => pasteData(state, e.split('\n').map(line => line.split('\t').map(t => ({ text: t, data: t, type: 'text' }))))));
                }
            }
        }
    ];
}
