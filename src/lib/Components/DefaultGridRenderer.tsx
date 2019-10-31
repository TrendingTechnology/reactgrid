import * as React from 'react';
import { PaneRow } from './PaneRow';
import { Line } from './Line';
import { Shadow } from './Shadow';
import { GridRendererProps } from '../Model';
import { CellEditor } from './CellEditor';


export const DefaultGridRenderer: React.FunctionComponent<GridRendererProps> = props =>
    <div
        className="reactgrid"
        onKeyDown={props.eventHandlers.keyDownHandler}
        onKeyUp={props.eventHandlers.keyUpHandler}
        style={{ width: '100%', height: '100%', minWidth: 510, minHeight: 150 }}
    >
        <div
            className="rg-viewport"
            ref={props.eventHandlers.viewportElementRefHandler}
            onScroll={props.eventHandlers.scrollHandler}
        >
            <div
                data-cy="reactgrid"
                className="rg-content"
                style={{
                    width: props.state.cellMatrix.width, height: props.state.cellMatrix.height
                }}
                onScroll={props.eventHandlers.scrollHandler}
            >
                {props.state.cellMatrix.frozenTopRange.height > 0 &&
                    <PaneRow id='T'
                        class="rg-pane-row-t"
                        state={props.state}
                        style={{}}
                        range={props.state.cellMatrix.frozenTopRange}
                        borders={{ bottom: true }}
                        zIndex={3}
                    />}
                {props.state.cellMatrix.scrollableRange.height > 0 && props.state.cellMatrix.scrollableRange.first.column && props.state.cellMatrix.scrollableRange.first.row && props.state.cellMatrix.scrollableRange.last.row && props.state.visibleRange &&
                    <PaneRow
                        id='M'
                        state={props.state}
                        style={{ height: props.state.cellMatrix.scrollableRange.height }}
                        range={props.state.cellMatrix.scrollableRange.slice(props.state.visibleRange, 'rows')}
                        borders={{}}
                        zIndex={0}
                    />}
                {props.state.cellMatrix.frozenBottomRange.height > 0 && props.state.cellMatrix.rows.length > 1 &&
                    <PaneRow
                        id='B'
                        class="rg-pane-row-b"
                        state={props.state}
                        style={{}}
                        range={props.state.cellMatrix.frozenBottomRange}
                        borders={{ top: true }}
                        zIndex={3}
                    />}
                <input className="rg-hidden-element" readOnly={true} ref={props.eventHandlers.hiddenElementRefHandler} />
                <Line
                    linePosition={props.state.linePosition}
                    orientation={props.state.lineOrientation}
                    cellMatrix={props.state.cellMatrix}
                />
                <Shadow
                    shadowPosition={props.state.shadowPosition}
                    orientation={props.state.lineOrientation}
                    cellMatrix={props.state.cellMatrix}
                    shadowSize={props.state.shadowSize}
                    cursor={props.state.shadowCursor}
                />
                {/* <ContextMenu
                    state={props.state}
                    onRowContextMenu={(menuOptions: MenuOption[]) => props.onRowContextMenu ? props.onRowContextMenu(menuOptions) : []}
                    onColumnContextMenu={(menuOptions: MenuOption[]) => props.onColumnContextMenu ? props.onColumnContextMenu(menuOptions) : []}
                    onRangeContextMenu={(menuOptions: MenuOption[]) => props.onRangeContextMenu ? props.onRangeContextMenu(menuOptions) : []}
                    contextMenuPosition={props.state.contextMenuPosition}
                /> */}
            </div>
            {props.state.currentlyEditedCell && <CellEditor state={props.state} />}
        </div>
    </div>
