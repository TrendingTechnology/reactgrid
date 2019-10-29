import * as React from 'react';
import { CellTemplate, CellRenderProps } from '../Common';
export declare class HeaderCellTemplate implements CellTemplate<string, any> {
    isReadonly: () => boolean;
    isValid: (cellData: string) => boolean;
    isFocusable: () => boolean;
    cellDataToText: (cellData: string) => string;
    getCustomStyle: (cellData: string) => {
        background: string;
    };
    renderContent: (props: CellRenderProps<string, any>) => React.ReactNode;
}
