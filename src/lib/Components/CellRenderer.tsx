import * as React from 'react';
import { State, Borders, Location } from '../Model';
import { tryAppendChange } from '../Functions';
import { ResizeHandle } from './ResizeHandle';

export interface CellRendererProps {
    state: State;
    location: Location;
    borders: Borders;
}

export const CellRenderer: React.FunctionComponent<CellRendererProps> = props => {
    const state = { ...props.state };
    const location = props.location;
    const isFocused = state.focusedLocation !== undefined && (state.focusedLocation.column.idx === props.location.column.idx && state.focusedLocation.row.idx === props.location.row.idx);
    const cellTemplate = state.cellTemplates[location.cell.type];
    if (cellTemplate === undefined)
        throw `CellTemplate missing for type '${location.cell.type}'`
    try {

        const cell = cellTemplate.validate(location.cell);
        if (!cell)
            throw 'Cell validation failed'


        // TODO custom style
        const style: React.CSSProperties = {
            //...((cellTemplate.getStyle? && cellTemplate.getCustomStyle(cell, false)) || {}),
            boxSizing: 'border-box',
            whiteSpace: 'nowrap',
            position: 'absolute',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            overflow: 'hidden',
            left: location.column.left,
            top: location.row.top,
            width: location.column.width,
            height: location.row.height,
            padding: '0 1px',
            fontSize: 14,
            // paddingLeft: 2,
            // paddingRight: 2,
            //borderTop: borders.top ? 'solid 1px #ccc' : '',
            //borderLeft: borders.left ? 'solid 1px #ccc' : '',
            // borderBottom: borders.bottom
            //     ? 'solid 1px #ccc'
            //     : 'solid 1px #e5e5e5',
            // borderRight: borders.right
            //     ? 'solid 1px #ccc'
            //     : 'solid 1px #e5e5e5',

            // TODO hardcoded type "header" - can we do better?
            touchAction: isFocused || props.state.cellMatrix.getCell(props.location.row.rowId, props.location.column.columnId).type === 'header' ? 'none' : 'auto' // prevent scrolling
        };

        return (
            <div className="cell" style={style}>
                {cellTemplate.render(cell, false, (cell, commit) => {
                    if (!commit) throw 'commit should be set to true in this case.';
                    props.state.update(state => tryAppendChange(state, location, cell));
                })}
                {location.row.idx === 0 && location.column.onResize && <ResizeHandle />}
            </div>
        );

    } catch (e) {
        throw `${e} (columnId: ${location.column.columnId}, rowId: ${location.row.rowId}) `
    }
};
