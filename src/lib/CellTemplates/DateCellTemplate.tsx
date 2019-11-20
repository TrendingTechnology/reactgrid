import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible } from '../Model';
import { inNumericKey, isNavigationKey, isAlphaNumericKey } from './keyCodeCheckings'
import { getCellProperty } from '../Functions/getCellProperty';
import { type } from 'os';

export interface DateCell extends Cell {
    type: 'date';
    date: Date;
    format?: Intl.DateTimeFormat;
}

export class DateCellTemplate implements CellTemplate<DateCell> {

    getCompatibleCell(uncertainCell: Uncertain<DateCell>): Compatible<DateCell> {
        const date = getCellProperty(uncertainCell, 'date', 'object');
        const dateFormat = uncertainCell.format || new Intl.DateTimeFormat(window.navigator.language);
        return { ...uncertainCell, date, value: date.getTime(), text: dateFormat.format(date) }
    }

    handleKeyDown(cell: Compatible<DateCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<DateCell>, enableEditMode: boolean } {
        const char = String.fromCharCode(keyCode)
        if (!ctrl && !alt && isAlphaNumericKey(keyCode))
            return { cell: this.getCompatibleCell({ ...cell }), enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    update(cell: Compatible<DateCell>, cellToMerge: UncertainCompatible<DateCell>): Compatible<DateCell> {
        return this.getCompatibleCell({ ...cell, date: new Date(cellToMerge.value) });
    }

    render(cell: Compatible<DateCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<DateCell>, commit: boolean) => void): React.ReactNode {

        if (!isInEditMode) return cell.text;

        const locale = cell.format ? cell.format.resolvedOptions().locale : window.navigator.languages[0];
        const dateParts = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(cell.date);

        const yearPart = dateParts.find(obj => obj.type === 'year');
        const monthPart = dateParts.find(obj => obj.type === 'month');
        const dayPart = dateParts.find(obj => obj.type === 'day');

        const year = yearPart ? yearPart.value : 0;
        const month = monthPart ? monthPart.value : 0;
        const day = dayPart ? dayPart.value : 0;

        return <input
            ref={input => {
                if (input) input.focus();
            }}
            type="date"
            defaultValue={`${year}-${month}-${day}`}
            onChange={e => {
                const date = new Date(Date.parse(e.currentTarget.value));
                onCellChanged(this.getCompatibleCell({ ...cell, date}), false)
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