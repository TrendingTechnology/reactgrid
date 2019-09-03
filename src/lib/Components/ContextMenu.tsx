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

class ContextMenuSubContainer extends React.Component<{ parentLevel: number, level: number, item: MenuOption, state: State, container: DOMRect | ClientRect, contextMenuPosition: number[]  }> {

    state = {
        contextMenuDimensions: {
            width: -1,
            height: -1,
            left: -1,
            right: -1,
        }
    };

    componentDidMount() {
        this.setState({
            contextMenuDimensions: {
                width: this.container && this.container.width,
                height: this.container && this.container.height,
                left: this.container && this.container.left,
                right: this.container && this.container.right,
            }
        });
    }

    componentWillUnmount() {
        this.setState({
            contextMenuDimensions: {
                width: -1,
                height: -1,
                left: -1,
                right: -1,
            }
        });
    }

    renderContent() {
        const { parentLevel, level, item, state, container, contextMenuPosition } = this.props;
        const { contextMenuDimensions } = this.state;

        // if (contextMenuDimensions && contextMenuDimensions.height) {
        let pos = [0, 0];

        // pos[0] = container.height;
        
        if ( contextMenuDimensions && contextMenuDimensions.width !== -1 && contextMenuDimensions.height !== -1) {

            pos[1] = container.width - contextMenuPosition[0] - contextMenuDimensions.width;
            console.log(container);

            const vieportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const vieportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        
            const leftSpace = contextMenuDimensions.right - container.width + contextMenuDimensions.width;
            console.warn(`leftSpace: ${leftSpace}}, contextMenuDimensions.right: ${contextMenuDimensions.right} ,contextMenuDimensions.width ${contextMenuDimensions.width}`);

            if (vieportWidth < leftSpace) {
                console.log('nie mieszcze sie');
            }
                
        }

        return (
            <div 
                className="dg-child-submenu-container"
                // style={{display: parentLevel !== level - 1 ? 'none' : 'block'}}
                style={{
                    top: pos[0] + 'px',
                    right: pos[1] + 'px'
                }}> 
                {item && item.childs && item.childs.map((item, idx) => {
                    return <ContextMenuItem level={level+1} key={idx} state={state} item={item} container={container} contextMenuPosition={pos}/>
                })}
            </div>
        )
    }

    private container!: DOMRect | ClientRect;

    render() {
        const { contextMenuDimensions } = this.state;
        return (
            <div 
                ref={(el: HTMLDivElement) => {
                    this.container = el && el.children[0] && el.children[0].getBoundingClientRect()
                    if (this.container) {
                        // console.log(`Context: ${el.children[0].getBoundingClientRect()}`);
                    }
                }}>
                {contextMenuDimensions && this.renderContent()}
            </div>
        );
    }
}

class ContextMenuItem extends React.Component<{level: number, item: MenuOption, state: State, container: DOMRect | ClientRect, contextMenuPosition: number[] }> {
    state = { hovered: false };
    render() {
        const {level, item, state, container, contextMenuPosition } = this.props;
        return (
            <div
                data-level={level}
                className="dg-context-menu-option"
                onPointerDown={e => e.stopPropagation()}
                onMouseEnter={() => this.setState({ hovered: true })}
                onMouseLeave={() => this.setState({ hovered: false })}
                onClick={() => {
                    item.handler();
                    state.updateState((state: State) => ({ ...state, selectedIds: state.selectedIds, contextMenuPosition: [-1, -1] }))
                }}> 
                <ContextMenuDescription title={item.title} hasChilds={item.childs && item.childs.length > 0} iconURL='https://img.icons8.com/color/2x/image.png'/>
                {item.childs && this.state.hovered &&
                    <ContextMenuSubContainer parentLevel={level-1} level={level} state={state} item={item} container={container} contextMenuPosition={contextMenuPosition}/>}
            </div>
        )
    }
}


export class ContextMenu extends React.Component<ContextMenuProps> {

    renderMenuOption = (level: number, contextMenuOptions: MenuOption[], state: State, container: DOMRect | ClientRect, contextMenuPosition: number[]): any => {
        return contextMenuOptions.map((item, idx) => {
            return <ContextMenuItem level={level} key={idx} state={state} item={item} container={container} contextMenuPosition={contextMenuPosition}/>
        })
    }

    state = {
        contextMenuDimensions: {
            width: -1,
            height: -1,
        }
    };

    componentDidMount() {
        this.setState({
            contextMenuDimensions: {
                width: this.container && this.container.width,
                height: this.container && this.container.height,
            }
        });
    }

    componentWillUnmount() {
        this.setState({
            contextMenuDimensions: {
                width: -1,
                height: -1,
            }
        });
    }

    renderContent() {
        const { contextMenuDimensions } = this.state;

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
        if (contextMenuDimensions && contextMenuDimensions.height) {
            const vieportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const vieportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            if (contextMenuDimensions.height + contextMenuPosition[0] > vieportHeight) {
                contextMenuPosition[0] = vieportHeight - contextMenuDimensions.height - 10;
            }
            if (contextMenuDimensions.width + contextMenuPosition[1] > vieportWidth) {
                contextMenuPosition[1] = vieportWidth - contextMenuDimensions.width - 10;
            }
        }
        return (
            contextMenuOptions.length > 0 && 
            <div
                className="dg-context-menu context-menu-container"
                style={{
                    top: contextMenuPosition[0] + 'px',
                    left: contextMenuPosition[1] + 'px'
                }}> 
                {this.renderMenuOption(0, contextMenuOptions, state, this.container, contextMenuPosition)}
            </div>
        );
    }

    private container!: DOMRect | ClientRect;

    render() {
        const { contextMenuDimensions } = this.state;
        return (
            <div 
                ref={(el: HTMLDivElement) => {
                    this.container = el && el.children[0].getBoundingClientRect()
                }}>
                {contextMenuDimensions && this.renderContent()}
            </div>
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
