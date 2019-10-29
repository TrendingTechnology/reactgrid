import * as React from 'react';
import { CellRenderProps, CellTemplate } from '../Common';
export declare class NumberCellTemplate implements CellTemplate<number, any> {
    isValid(cellData: number): boolean;
    textToCellData(text: string): number;
    cellDataToText(cellData: number): string;
    handleKeyDown(cellData: number, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, props?: any): {
        cellData: number;
        enableEditMode: boolean;
    };
    renderContent: (props: CellRenderProps<number, any>) => React.ReactNode;
}
