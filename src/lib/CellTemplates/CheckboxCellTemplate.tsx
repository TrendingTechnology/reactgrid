import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { CellRenderProps as CellRenderProps, CellTemplate } from '../Common';

export class CheckboxCellTemplate implements CellTemplate<boolean, any> {

    isValid(cellData: boolean): boolean {
        return typeof (cellData) === 'boolean';
    }

    textToCellData(text: string): boolean {
        return text === 'true';
    }

    cellDataToText(cellData: boolean) {
        return cellData ? 'true' : '';
    }

    handleKeyDown(cellData: boolean, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, props?: any) {
        if (keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER)
            cellData = !cellData
        return { cellData, enableEditMode: false }
    }

    renderContent: (props: CellRenderProps<boolean, any>) => React.ReactNode = (props) => {
        return <input
            type="checkbox"
            className="rg-checkbox-cell-template"
            checked={props.cellData}
            onChange={() => props.onCellDataChanged(!props.cellData, true)}
        />
    }
}