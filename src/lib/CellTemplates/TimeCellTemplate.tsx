import * as React from 'react';
import { isTextInput, isNavigationKey } from './keyCodeCheckings'
import { CellRenderProps, CellTemplate, keyCodes } from '../Model';

type TimeCell = Cell<'time', string, {}>

export class TimeCellTemplate implements CellTemplate<TimeCell> {

    isValid(cell: TimeCell): boolean {
        const time_regex = /^\d{2}\:\d{2}$/;
        return time_regex.test(cell.data.replace(/\s+/g, ''));
    }

    toText(cell: TimeCell) {
        return cell.data;
    }

    handleKeyDown(cell: TimeCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cell: { ...cell, data: '' }, enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    renderContent: (props: CellRenderProps<TimeCell>) => React.ReactNode = (props) => {
        if (!props.isInEditMode)
            return props.cell.data;

        return <input
            type='time'
            style={{
                width: '100%',
                height: '100%',
                padding: 0,
                border: 0,
                background: 'transparent',
                fontSize: 14,
                outline: 'none'
            }}
            ref={input => {
                if (input) {
                    input.focus();
                    // input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            defaultValue={props.cell.data}
            onChange={e => props.onCellChanged({ ...props.cell, data: e.currentTarget.value }, false)}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            onKeyDown={e => {
                if (isTextInput(e.keyCode) || isNavigationKey(e)) e.stopPropagation();
                if (e.keyCode == keyCodes.ESC) e.currentTarget.value = props.cell.data; // reset
            }}
        />
    }
}
