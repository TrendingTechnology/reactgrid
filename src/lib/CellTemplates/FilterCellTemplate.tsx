import * as React from 'react';
import { CellTemplate, isTextInput, keyCodes, CellRenderProps, isNavigationKey } from '../Common';

export class FilterCellTemplate implements CellTemplate<string, any> {
    isFillHandleVisible = true;
    isValid(data: string): boolean { return (typeof (data) === 'string') }

    isReplacable = () => false;

    cellDataToText = (cellData: any) => cellData;

    handleKeyDown(cellData: string, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, event: any) {
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cellData: '', enableEditMode: true }
        if (keyCode === keyCodes.ENTER) {
            event.stopPropagation();
            event.preventDefault();
        }
        return { cellData, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    renderContent: (props: CellRenderProps<string, any>) => React.ReactNode = (props) => {
        if (!props.isInEditMode && props.cellData.length === 0) return <span style={{ color: "rgba(0, 0, 0, .5)" }}>Filter...</span>;
        if (!props.isInEditMode) return props.cellData;
        return <input
            type='text'
            style={{
                position: 'inherit',
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
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            defaultValue={props.cellData}
            onChange={e => props.onChange(e.currentTarget.value)}
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