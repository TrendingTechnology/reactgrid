import * as React from 'react';
import { PaneRow } from './PaneRow';
import { Line } from './Line';
import { Shadow } from './Shadow';
import { GridRendererProps } from '../Model';
import { CellEditor } from './CellEditor';

export const DefaultGridRenderer: React.FunctionComponent<GridRendererProps> = props => {
    console.log(props)
    return (
        <div className="reactgrid"
            onKeyDown={props.eventHandlers.keyDownHandler}
            onKeyUp={props.eventHandlers.keyUpHandler}
            style={{ width: '100%', height: '100%' }}>
            <div
                className="dg-viewport"
                ref={props.eventHandlers.viewportElementRefHandler}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    MozUserSelect: 'none',
                    WebkitUserSelect: 'none',
                    msUserSelect: 'none',
                    userSelect: 'none',
                    overflow: 'auto'
                }}
                onScroll={props.eventHandlers.scrollHandler}
            >
                <div
                    data-cy="reactgrid"
                    className="dg-content"
                    style={{
                        width: props.state.cellMatrix.width,
                        height: props.state.cellMatrix.height,
                        position: 'relative',
                        outline: 'none'
                    }}
                    onPointerDown={props.eventHandlers.pointerDownHandler}
                    onCopy={props.eventHandlers.copyHandler}
                    onCut={props.eventHandlers.cutHandler}
                    onPaste={props.eventHandlers.pasteHandler}
                    onPasteCapture={props.eventHandlers.pasteCaptureHandler}
                    onContextMenu={props.eventHandlers.handleContextMenu}
                >
                    {props.state.cellMatrix.frozenTopRange.height > 0 &&
                        <PaneRow
                            id="T"
                            state={props.state}
                            style={{ background: 'white', top: 0, position: 'sticky', boxShadow: '0 3px 3px -3px rgba(0, 0, 0, .2)' }}
                            range={props.state.cellMatrix.frozenTopRange}
                            borders={{ bottom: true }} zIndex={3} />}
                    {props.state.cellMatrix.scrollableRange.height > 0 && props.state.cellMatrix.scrollableRange.first.column &&
                        props.state.cellMatrix.scrollableRange.first.row && props.state.cellMatrix.scrollableRange.last.row &&
                        props.state.visibleRange &&
                        <PaneRow id="M" state={props.state} style={{ height: props.state.cellMatrix.scrollableRange.height }} range={props.state.cellMatrix.scrollableRange.slice(props.state.visibleRange, 'rows')} borders={{}} zIndex={0} />}
                    {props.state.cellMatrix.frozenBottomRange.height > 0 && props.state.cellMatrix.rows.length > 1 &&
                        <PaneRow id="B" state={props.state} style={{ background: 'white', bottom: 0, position: 'sticky', boxShadow: '0 -3px 3px -3px rgba(0, 0, 0, .2)' }} range={props.state.cellMatrix.frozenBottomRange} borders={{ top: true }} zIndex={3} />}
                    <input className="dg-hidden-element" readOnly={true} style={{ position: 'fixed', width: 1, height: 1, opacity: 0 }} ref={props.eventHandlers.hiddenElementRefHandler} />
                    <Line linePosition={props.state.linePosition} orientation={props.state.lineOrientation} cellMatrix={props.state.cellMatrix} />
                    <Shadow shadowPosition={props.state.shadowPosition} orientation={props.state.lineOrientation} cellMatrix={props.state.cellMatrix} shadowSize={props.state.shadowSize} cursor={props.state.shadowCursor} />
                    {/* <ContextMenu state={props.state} onRowContextMenu={(menuOptions: MenuOption[]) => (props.eventHandlers.handleContextMenu ? props.eventHandlers.handleContextMenu(menuOptions) : [])} onColumnContextMenu={(menuOptions: MenuOption[]) => (props.onColumnContextMenu ? props.onColumnContextMenu(menuOptions) : [])} onRangeContextMenu={(menuOptions: MenuOption[]) => (props.onRangeContextMenu ? props.onRangeContextMenu(menuOptions) : [])} contextMenuPosition={props.state.contextMenuPosition} /> */}
                </div>
            </div>
            {props.state.currentlyEditedCell && <CellEditor state={props.state} />}
        </div>

    )
};
