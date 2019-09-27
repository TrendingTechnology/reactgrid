import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { CellRenderProps, CellTemplate } from '../Common';

export class NumberCellTemplate implements CellTemplate<number> {

    isValid(cellData: number): boolean {
        return typeof (cellData) === 'number';
    }

    textToCellData(text: string): number {
        return parseFloat(text);
    }

    cellDataToText(cellData: number): string {
        return cellData.toString();
    }

    handleKeyDown(cellData: number, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
        return { cellData, enableEditMode: true };
    }

    renderContent: (props: CellRenderProps<number>) => React.ReactNode = (props) => {
        if (!props.isInEditMode) {
            return isNaN(props.cellData) ? '' : props.cellData;
        }

        const validate = (keyCode: number) => {
            if (keyCode == 8 ||
                (keyCode >= 37 && keyCode <= 40) ||
                (keyCode >= 46 && keyCode <= 57) ||
                (keyCode >= 96 && keyCode <= 105) ||
                keyCode === 190) {
                return true;
            }
            return false;
        }

        return <input
            style={{
                width: '100%',
                height: '100%',
                padding: 0,
                border: 0,
                background: 'transparent',
                fontSize: 14,
                outline: 'none',
            }}
            ref={input => {
                if (input) {
                    input.focus();
                    // input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            defaultValue={this.cellDataToText(props.cellData)}
            onChange={e => props.onCellDataChanged(this.textToCellData(e.currentTarget.value), false)}
            onKeyDown={e => !validate(e.keyCode) ? e.preventDefault() : null}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}