import * as React from 'react';
import { CellTemplate, CellRenderProps } from '../Model';

type HeaderCell = Cell<'header', string, {}>

export class HeaderCellTemplate implements CellTemplate<HeaderCell> {

    isReadonly = () => true;

    isValid = (cell: HeaderCell) => (typeof (cell.data) === 'string');

    isFocusable = () => false;

    toText = (cellData: HeaderCell) => cellData.data;

    getCustomStyle = (cell: HeaderCell) => ({ background: '#f3f3f3' })

    renderContent: (props: CellRenderProps<HeaderCell>) => React.ReactNode = (props) => props.cell.data
}
