import * as React from 'react';
import { State, Row, Column, Borders } from "../Common";
export interface RowRendererProps {
    state: State;
    row: Row;
    columns: Column[];
    forceUpdate: boolean;
    borders: Borders;
}
export declare class RowRenderer extends React.Component<RowRendererProps, {}> {
    shouldComponentUpdate(nextProps: RowRendererProps): boolean;
    render(): JSX.Element[];
}
