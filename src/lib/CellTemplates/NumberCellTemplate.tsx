import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
import { isNumberInput, isNavigationKey } from './keyCodeCheckings'

export interface NumberCell extends Cell {
    type: 'number',
    value: number
    format?: string
    hideZero?: boolean
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

    update(cell: NumberCell, newCell: NumberCell | CompatibleCell): NumberCell {

        if (newCell.value !== undefined && newCell.value !== NaN)
            return { ...cell, value: newCell.value } as NumberCell;

        const parsed = parseFloat((newCell as CompatibleCell).text);
        return { ...cell, value: parsed > 0 || parsed < 0 ? parsed : 0 }
    }

    render(cell: NumberCell, isInEditMode: boolean, onCellChanged: (cell: NumberCell, commit: boolean) => void): React.ReactNode {
        if (!isInEditMode) {
            return cell.value === 0 && cell.hideZero ? '' : cell.value;
        }

        return <input
            className="rg-number-cell-template"
            ref={input => {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            value={cell.value}
            onChange={e => {
                onCellChanged({ ...cell, value: Number(e.currentTarget.value) }, false)
            }}

            onKeyDown={e => {
                if ((e.keyCode >= 48 && e.keyCode >= 57) || (e.keyCode <= 96 && e.keyCode >= 105)) {
                    e.preventDefault()
                    return
                }
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