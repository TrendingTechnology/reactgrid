import * as React from 'react';
import { State, Borders, Location } from '../Model';
import { tryAppendChange } from '../Functions';
import { ResizeHandle } from './ResizeHandle';
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';

export interface CellRendererProps {
    state: State;
    location: Location;
    borders: Borders;
}

export const CellRenderer: React.FunctionComponent<CellRendererProps> = props => {
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(props.state, props.location);
    const state = { ...props.state };
    const location = props.location;
    const isFocused = state.focusedLocation !== undefined && (state.focusedLocation.column.idx === props.location.column.idx && state.focusedLocation.row.idx === props.location.row.idx);

    // TODO custom style
    const style: React.CSSProperties = {
        left: location.column.left,
        top: location.row.top,
        width: location.column.width,
        height: location.row.height,
        ...(cellTemplate.getStyle && cellTemplate.getStyle(cell, false) || {}),
        // TODO when to prevent scrolling?
        touchAction: isFocused || cell.type === 'header' ? 'none' : 'auto' // prevent scrolling

    };

    return (
        <div className="cell" style={style}>
            {cellTemplate.render(cell, false, (cell, commit) => {
                if (!commit) throw 'commit should be set to true in this case.';
                props.state.update(state => tryAppendChange(state, location, cell));
            })}
            {location.row.idx === 0 && location.column.resizable && <ResizeHandle />}
        </div>
    );
};
