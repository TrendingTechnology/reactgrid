import * as React from 'react';
import { isTextInput, isNavigationKey } from './keyCodeCheckings'
import { CellRenderProps, CellTemplate, keyCodes } from '../Common';

export class TimeCellTemplate implements CellTemplate<string, any> {

    isValid(cellData: string): boolean {
        const time_regex = /^\d{2}\:\d{2}$/;
        return time_regex.test(cellData.replace(/\s+/g, ''));
    }

    textToCellData(text: string): string {
        return text;
    }

    cellDataToText(cellData: string) {
        return cellData;
    }

    handleKeyDown(cellData: string, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, props?: any) {
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cellData: '', enableEditMode: true }
        return { cellData, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    renderContent: (props: CellRenderProps<string, any>) => React.ReactNode = (props) => {
        if (!props.isInEditMode)
            return props.cellData;

        return <input
            type='time'
            className="rg-time-cell-template"
            ref={input => {
                if (input) {
                    input.focus();
                    // input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            defaultValue={props.cellData}
            onChange={e => props.onCellDataChanged(e.currentTarget.value, false)}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            onKeyDown={e => {
                if (isTextInput(e.keyCode) || isNavigationKey(e)) e.stopPropagation();
                if (e.keyCode == keyCodes.ESC) e.currentTarget.value = props.cellData; // reset
            }}
        />
    }
}
