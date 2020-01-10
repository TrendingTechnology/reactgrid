import * as React from 'react';
import { PaneRow } from './PaneRow';
import { Line } from './Line';
import { Shadow } from './Shadow';
import { GridRendererProps, MenuOption } from '../Model';
import { CellEditor } from './CellEditor';
import { ContextMenu } from './ContextMenu'
import { HiddenElement } from './HiddenElement';


export const DefaultGridRenderer: React.FunctionComponent<GridRendererProps> = props =>
    <div
        className="reactgrid"
        onKeyDown={props.eventHandlers.keyDownHandler}
        onKeyUp={props.eventHandlers.keyUpHandler}
        onPointerDown={props.eventHandlers.pointerDownHandler}
        onPasteCapture={props.eventHandlers.pasteCaptureHandler}
        onPaste={props.eventHandlers.pasteHandler}
        onCopy={props.eventHandlers.copyHandler}
        onCut={props.eventHandlers.cutHandler}
        onBlur={props.eventHandlers.blurHandler}
        onScroll={props.eventHandlers.scrollHandler}
        ref={props.eventHandlers.viewportElementRefHandler}
    >
        <div
            data-cy="reactgrid"
            className="rg-content"
            style={{
                width: props.state.cellMatrix.width, height: props.state.cellMatrix.height
            }}
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
            {props.state.cellMatrix.scrollableRange.height > 0 && props.state.cellMatrix.scrollableRange.first.column &&
                props.state.cellMatrix.scrollableRange.first.row && props.state.cellMatrix.scrollableRange.last.row &&
                props.state.visibleRange && props.state.visibleRange.height > 0 &&
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
            <HiddenElement hiddenElementRefHandler={props.eventHandlers.hiddenElementRefHandler} state={props.state} />
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
            {props.state.contextMenuPosition.top !== -1 && props.state.contextMenuPosition.left !== -1 &&
                <ContextMenu
                    state={props.state}
                    onContextMenu={(menuOptions: MenuOption[]) => props.state.props.onContextMenu
                        ? props.state.props.onContextMenu((props.state.selectionMode === 'row') ? props.state.selectedIds : [],
                            (props.state.selectionMode === 'column') ? props.state.selectedIds : [], props.state.selectionMode, menuOptions)
                        : []}
                    contextMenuPosition={props.state.contextMenuPosition}
                />
            }
            {props.state.currentlyEditedCell && <CellEditor state={props.state} />}
        </div>

    </div>