import React from 'react';
import './lib/assets/core.scss';
interface Column {
    id: string;
    width: number;
}
interface Data {
    [key: string]: string;
}
interface Row {
    id: string;
    height: number;
    data: Data;
}
interface DevGridState {
    columns: Column[];
    rows: Row[];
}
interface DevGridProps {
    columns: number;
    rows: number;
    rowsHeight?: number;
    columnsWidth?: number;
}
export default class DevGrid extends React.Component<DevGridProps, DevGridState> {
    constructor(props: DevGridProps);
    private getRandomId;
    private getMatrix;
    private prepareDataChanges;
    private getReorderedColumns;
    private getReorderedRows;
    render(): JSX.Element;
}
export {};
