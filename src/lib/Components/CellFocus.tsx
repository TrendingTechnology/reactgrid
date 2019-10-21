import * as React from 'react';
import { Location, Id } from '../Model';

interface CellFocusProps {
    location: Location;
    color?: string;
}

export const CellFocus: React.FunctionComponent<CellFocusProps> = props => (
    <div
        key={props.color}
        className="dg-cell-focus"
        style={{
            boxSizing: 'border-box',
            position: 'absolute',
            top: props.location.row.top - (props.location.row.top === 0 ? 0 : 1),
            left: props.location.column.left - (props.location.column.left === 0 ? 0 : 1),
            width: props.location.column.width + (props.location.column.left === 0 ? 0 : 1),
            height: props.location.row.height + (props.location.row.top === 0 ? 0 : 1),
            border: `solid 2px ${props.color ? props.color : '#3579f8'}`,
            pointerEvents: 'none' // prevent delegating events around cell
        }}
    />
);
