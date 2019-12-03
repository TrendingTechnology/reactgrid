import * as React from 'react';
import { CellMatrix, Orientation } from '../Model';

interface LineProps {
    linePosition: number;
    orientation: Orientation;
    cellMatrix: CellMatrix;
}

export const Line: React.FunctionComponent<LineProps> = (props) => {
    const { cellMatrix, linePosition } = props;
    const isVertical = !!(props.orientation === 'vertical');
    const lineStyles = Object.assign({}, isVertical
        ? { left: props.linePosition, height: cellMatrix.height }
        : { top: props.linePosition, width: cellMatrix.width });
    return (
        <>
            {linePosition !== -1 &&
                <div
                    className={`rg-line ${isVertical ? 'rg-line-vertical' : 'rg-line-horizontal'}`}
                    style={lineStyles}
                />}
        </>
    )
}
