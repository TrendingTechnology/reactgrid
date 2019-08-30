import * as React from 'react';
import { Id, MenuOption, Location, State, Range } from '../Common';
import { copySelectedRangeToClipboard, pasteData } from '../Behaviors/DefaultBehavior';
import { isBrowserIE, getDataToPasteInIE } from '../Functions';
import './ContextMenu.css';

interface ContextMenuProps {
    contextMenuPosition: number[],
    focusedLocation?: Location,
    state: State,
    onRowContextMenu?: (selectedRowIds: Id[], menuOptions: MenuOption[]) => MenuOption[],
    onColumnContextMenu?: (selectedColIds: Id[], menuOptions: MenuOption[]) => MenuOption[],
    onRangeContextMenu?: (selectedRanges: Range[], menuOptions: MenuOption[]) => MenuOption[];
}

const ContextMenuDescription = (props: any) => {
    const { title, hasChilds, iconURL } = props;
    const backgroundImage = 'url("' + iconURL + '")';
    return (
        <div className="dg-context-menu-description">
            <div className="dg-context-menu-description-img" style={{ backgroundImage }}></div>
            <span className="dg-context-menu-description-title">{title}</span> 
            <div className="dg-context-menu-description-shortcut"><span>CTRL+C</span></div>
            {hasChilds && <span style={{fontSize: '16px'}}>›</span>}
        </div>
    )
}

const ContextMenuItem = (props: {level: number, item: MenuOption, state: State}) => {
    const {level, item, state } = props;
    return (
        <div
            data-level={level}
            className="dg-context-menu-option"
            onPointerDown={e => e.stopPropagation()}
            onClick={() => {
                item.handler();
                state.updateState((state: State) => ({ ...state, selectedIds: state.selectedIds, contextMenuPosition: [-1, -1] }))
            }}> 
            <ContextMenuDescription title={item.title} hasChilds={item.childs && item.childs.length > 0} iconURL='https://img.icons8.com/color/2x/image.png'/>
            {item.childs && 
            <div className="dg-child-submenu-container">
                {item.childs.map((item, idx) => {
                    return <ContextMenuItem level={level+1} key={idx} state={state} item={item}/>
                })}
            </div>}
        </div>
    )
}


export class ContextMenu extends React.Component<ContextMenuProps> {

    renderMenuOption = (level: number, contextMenuOptions: MenuOption[], state: State): any => {
        return contextMenuOptions.map((item, idx) => {
            return <ContextMenuItem level={level} key={idx} state={state} item={item}/>
        })
    }

    render() {
        const { contextMenuPosition, onRowContextMenu, onColumnContextMenu, onRangeContextMenu, state } = this.props;
        const focusedLocation = state.focusedLocation;
        let contextMenuOptions: MenuOption[] = customContextMenuOptions(state);
        const rowOptions = onRowContextMenu && onRowContextMenu(state.selectedIds, customContextMenuOptions(state));
        const colOptions = onColumnContextMenu && onColumnContextMenu(state.selectedIds, customContextMenuOptions(state));
        const rangeOptions = onRangeContextMenu && onRangeContextMenu(state.selectedRanges, customContextMenuOptions(state));

        if (focusedLocation) {
            if (state.selectedIds.includes(focusedLocation.row.id) && rowOptions) {
                contextMenuOptions = rowOptions;
            } else if (state.selectedIds.includes(focusedLocation.col.id) && colOptions) {
                contextMenuOptions =  colOptions;
            } else if (rangeOptions) {
                contextMenuOptions = rangeOptions;
            }
        }
        return (
            (contextMenuOptions.length > 0 &&
                <div
                    className="dg-context-menu context-menu-container"
                    style={{
                        top: contextMenuPosition[0] + 'px',
                        left: contextMenuPosition[1] + 'px'
                    }}
                > {this.renderMenuOption(0, contextMenuOptions, state)}
                </div>
            )
        );
    }
}

function customContextMenuOptions(state: State): MenuOption[] {
    return [
        {
            title: 'Copy',
            handler: () => copySelectedRangeToClipboard(state, false)
        },
        {
            title: 'Cut',
            handler: () => copySelectedRangeToClipboard(state, true)
        },
        {
            title: 'Paste',
            handler: () => {
                if (isBrowserIE()) {
                    setTimeout(() => state.updateState((state: State) => pasteData(state, getDataToPasteInIE())));
                } else {
                    navigator.clipboard.readText().then(e => state.updateState((state: State) => pasteData(state, e.split('\n').map(line => line.split('\t').map(t => ({ text: t, data: t, type: 'text' }))))));
                }
            }
        }
    ];
}
