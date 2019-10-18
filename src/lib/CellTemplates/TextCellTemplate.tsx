import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { CellRenderProps, CellTemplate, Cell } from '../Common';
import { isTextInput, isNavigationKey } from './keyCodeCheckings'

type TextCell = Cell<'text', string, {}>

export class TextCellTemplate implements CellTemplate<TextCell> {

    isValid(cell: TextCell): boolean {
        return typeof (cell.data) === 'string';
    }

    toText(cell: TextCell) {
        return cell.data;
    }

    handleKeyDown(cell: TextCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cell:{...cell, data: ''}, enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    renderContent: (props: CellRenderProps<TextCell>) => React.ReactNode = (props) => {
        if (!props.isInEditMode)
            return props.cell.data;

        return <input
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
            defaultValue={props.cell.data}
            onChange={e => props.onCellChanged({...props.cell, data:e.currentTarget.value}, false)}
            onBlur={e => props.onCellChanged({...props.cell, data:e.currentTarget.value}, true)} // TODO should it be added to each cell? // additional question, because everything works without that
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            onKeyDown={e => {
                if (isTextInput(e.keyCode) || (isNavigationKey(e))) e.stopPropagation();
                if (e.keyCode == keyCodes.ESC) e.currentTarget.value = props.cell.data; // reset
            }}
        />
    }
}