import * as React from 'react';
import { CellRenderProps as CellRenderProps, CellTemplate } from '../Common';
export declare class CheckboxCellTemplate implements CellTemplate<boolean, any> {
    isValid(cellData: boolean): boolean;
    textToCellData(text: string): boolean;
    cellDataToText(cellData: boolean): "" | "true";
    handleKeyDown(cellData: boolean, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, props?: any): {
        cellData: boolean;
        enableEditMode: boolean;
    };
    renderContent: (props: CellRenderProps<boolean, any>) => React.ReactNode;
}
