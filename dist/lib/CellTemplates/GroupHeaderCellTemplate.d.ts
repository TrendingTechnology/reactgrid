import * as React from 'react';
import { CellRenderProps, CellTemplate } from '../Common';
interface GroupHeaderCellData {
    name: string;
    isExpanded: boolean | undefined;
    depth: number;
}
export declare class GroupHeaderCellTemplate implements CellTemplate<GroupHeaderCellData, any> {
    isValid(cellData: GroupHeaderCellData): boolean;
    textToCellData(text: string): any;
    cellDataToText(cellData: GroupHeaderCellData): string;
    handleKeyDown(cellData: GroupHeaderCellData, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, props?: any): {
        cellData: {
            name: string;
            isExpanded: boolean | undefined;
            depth: number;
        };
        enableEditMode: boolean;
    };
    renderContent: (props: CellRenderProps<GroupHeaderCellData, any>) => React.ReactNode;
}
export {};
