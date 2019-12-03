import * as React from 'react';
import { CellMatrix, Orientation } from '../Model';

interface LineProps {
    linePosition: number;
    orientation: Orientation;
    cellMatrix: CellMatrix;
}
export class Line extends React.Component<LineProps> {
    render() {
        const { cellMatrix, linePosition } = this.props;
        const isVertical = !!(this.props.orientation === 'vertical');
        const lineStyles = Object.assign({}, isVertical
            ? { left: this.props.linePosition, height: cellMatrix.height }
            : { top: this.props.linePosition, width: cellMatrix.width });
        return (
            linePosition !== -1 &&
            <div
                className={`rg-line ${isVertical ? 'rg-line-vertical' : 'rg-line-horizontal'}`}
                style={lineStyles}
            />
        )
    }
}
