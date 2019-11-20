import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible } from '../Model';
import { inNumericKey, isNavigationKey, isAlphaNumericKey } from './keyCodeCheckings'
import { getCellProperty } from '../Functions/getCellProperty';

export interface DateCell extends Cell {
    type: 'date';
    date: Date;
    format?: Intl.DateTimeFormat;
}

export class DateCellTemplate implements CellTemplate<DateCell> {

    getCompatibleCell(uncertainCell: Uncertain<DateCell>): Compatible<DateCell> {
        const date = getCellProperty(uncertainCell, 'date', 'object');
        const dateFormat = uncertainCell.format || new Intl.DateTimeFormat(window.navigator.language);
        const value = date.getTime();
        const text = dateFormat.format(date);
        return { ...uncertainCell, date, value, text }
    }

    handleKeyDown(cell: Compatible<DateCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<DateCell>, enableEditMode: boolean } {
        if (!ctrl && !alt && isAlphaNumericKey(keyCode))
            return { cell: this.getCompatibleCell({ ...cell }), enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    update(cell: Compatible<DateCell>, cellToMerge: UncertainCompatible<DateCell>): Compatible<DateCell> {
        return this.getCompatibleCell({ ...cell, date: new Date(cellToMerge.value) });
    }

    render(cell: Compatible<DateCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<DateCell>, commit: boolean) => void): React.ReactNode {

        if (!isInEditMode) 
            return cell.text;

        const year = cell.date.getFullYear().toString().padStart(2, '0');
        const month = (cell.date.getMonth() + 1).toString().padStart(2, '0');
        const day = cell.date.getDate().toString().padStart(2, '0');

        const defaultDate = `${year}-${month}-${day}`;
        
        return <input
            ref={input => {
                if (input) input.focus();
            }}
            type="date"
            defaultValue={defaultDate}
            onChange={e => {
                const timestamp = Date.parse(e.currentTarget.value);
                if (!Number.isNaN(timestamp)) {
                    const date = new Date(timestamp);
                    onCellChanged(this.getCompatibleCell({ ...cell, date }), false)
                }
            }}
            onKeyDown={e => {
                if (inNumericKey(e.keyCode) || isNavigationKey(e.keyCode) || (e.keyCode === keyCodes.COMMA || e.keyCode === keyCodes.PERIOD)) e.stopPropagation();
                if (!inNumericKey(e.keyCode) && !isNavigationKey(e.keyCode) && (e.keyCode !== keyCodes.COMMA && e.keyCode !== keyCodes.PERIOD)) e.preventDefault();
            }}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}