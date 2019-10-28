import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
import { isNumberInput, isNavigationKey } from './keyCodeCheckings'

interface NumberCell extends Cell {
    type: 'number',
    value: number
}

export class NumberCellTemplate implements CellTemplate<NumberCell> {

    validate(cell: NumberCell): CompatibleCell<NumberCell> {
        return { ...cell, text: cell.value.toString() }
    }

    handleKeyDown(cell: NumberCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
        if (!ctrl && !alt && !shift && isNumberInput(keyCode))
            return { cell: { ...cell, data: NaN }, enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    render(cell: NumberCell, isInEditMode: boolean, onCellChanged: (cell: NumberCell, commit: boolean) => void): React.ReactNode {
        if (!isInEditMode) {
            return cell.value;
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
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            value={cell.value}
            onChange={e => onCellChanged({ ...cell, value: parseFloat(e.currentTarget.value) }, false)}
            onKeyDown={e => {
                if (isNumberInput(e.keyCode) || isNavigationKey(e)) e.stopPropagation();
                if (e.keyCode == keyCodes.ESC) e.currentTarget.value = cell.value.toString(); // reset
            }}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}