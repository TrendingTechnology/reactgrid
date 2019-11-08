import * as React from 'react';
import { CellMatrix, Orientation } from '../Model';
interface LineProps {
    linePosition: number;
    orientation: Orientation;
    cellMatrix: CellMatrix;
}
export declare class Line extends React.Component<LineProps> {
    render(): false | JSX.Element;
}
export {};
