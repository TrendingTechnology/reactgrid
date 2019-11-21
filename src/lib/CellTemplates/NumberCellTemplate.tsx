import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible } from '../Model';
import { inNumericKey, isNavigationKey } from './keyCodeCheckings'
import { getCellProperty } from '../Functions/getCellProperty';

export interface NumberCell extends Cell {
    type: 'number';
    value: number;
    format?: Intl.NumberFormat;
    nanToZero?: boolean;
    hideZero?: boolean;
}

export class NumberCellTemplate implements CellTemplate<NumberCell> {

    getCompatibleCell(uncertainCell: Uncertain<NumberCell>): Compatible<NumberCell> {
        const value = getCellProperty(uncertainCell, 'value', 'number');
        const numberFormat = uncertainCell.format || new Intl.NumberFormat(window.navigator.language);
        const displayValue = (uncertainCell.nanToZero && Number.isNaN(value)) ? 0 : value;
        const text = (Number.isNaN(displayValue)) ? '' : (uncertainCell.hideZero && displayValue === 0) ? '' : numberFormat.format(displayValue);
        return { ...uncertainCell, value: displayValue, text }
    }

    handleKeyDown(cell: Compatible<NumberCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
        if (keyCode >= keyCodes.NUMPAD_0 && keyCode <= keyCodes.NUMPAD_9) keyCode -= 48;
        const char = String.fromCharCode(keyCode);
        // console.log(keyCode, Number(char), char);
        if (!ctrl && !alt && !shift && (inNumericKey(keyCode) || (keyCode >= keyCodes.COMMA && keyCode <= keyCodes.PERIOD)))
            return { cell: this.getCompatibleCell({ ...cell, value: Number(char) }), enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    update(cell: Compatible<NumberCell>, cellToMerge: UncertainCompatible<NumberCell>): Compatible<NumberCell> {
        return this.getCompatibleCell({ ...cell, value: cellToMerge.value });
    }

    render(cell: Compatible<NumberCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<NumberCell>, commit: boolean) => void): React.ReactNode {

        if (!isInEditMode) {
            return cell.text;
        }

        const locale = cell.format ? cell.format.resolvedOptions().locale : window.navigator.languages[0];
        const format = new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 20 });

        return <input
            ref={input => {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            defaultValue={format.format(cell.value)}
            onChange={e => {
                onCellChanged(this.getCompatibleCell({ ...cell, value: parseFloat(e.currentTarget.value.replace(',', '.')) }), false)
            }}
            onKeyDown={e => {
                if (inNumericKey(e.keyCode) || isNavigationKey(e.keyCode) || (e.keyCode === keyCodes.COMMA || e.keyCode === keyCodes.PERIOD || e.keyCode === keyCodes.DASH )) e.stopPropagation();
                if (!inNumericKey(e.keyCode) && !isNavigationKey(e.keyCode) && (e.keyCode !== keyCodes.COMMA && e.keyCode !== keyCodes.PERIOD && e.keyCode !== keyCodes.DASH )) e.preventDefault();
            }}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}