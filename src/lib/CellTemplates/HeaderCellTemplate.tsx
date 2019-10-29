import * as React from 'react';
import { CellTemplate, CellRenderProps } from '../Common';

export class HeaderCellTemplate implements CellTemplate<string, any> {

    isReadonly = () => true;

    isValid = (cellData: string) => (typeof (cellData) === 'string');

    isFocusable = () => false;

    cellDataToText = (cellData: string) => cellData;

    getCustomStyle = (cellData: string) => ({ background: 'rgba(0, 0, 0, 0.07)' })

    renderContent: (props: CellRenderProps<string, any>) => React.ReactNode = (props) => <div className="rg-header-cell">{props.cellData}</div>
}
