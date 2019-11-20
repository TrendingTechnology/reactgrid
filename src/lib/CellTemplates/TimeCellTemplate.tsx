import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible } from '../Model';
import { inNumericKey, isNavigationKey, isAlphaNumericKey } from './keyCodeCheckings'
import { getCellProperty } from '../Functions/getCellProperty';
import { parse } from 'path';

export interface TimeCell extends Cell {
    type: 'time';
    time: Date;
    format?: Intl.DateTimeFormat;
}

export class TimeCellTemplate implements CellTemplate<TimeCell> {

    getCompatibleCell(uncertainCell: Uncertain<TimeCell>): Compatible<TimeCell> {
        const time = getCellProperty(uncertainCell, 'time', 'object');
        const dateFormat = uncertainCell.format || new Intl.DateTimeFormat(window.navigator.language);
        const value = time.getTime() % 86400000; // each day has 86400000 millis
        const text = dateFormat.format(time);
        return { ...uncertainCell, time, value, text }
    }

    handleKeyDown(cell: Compatible<TimeCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<TimeCell>, enableEditMode: boolean } {
        if (!ctrl && !alt && isAlphaNumericKey(keyCode))
            return { cell: this.getCompatibleCell({ ...cell }), enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    update(cell: Compatible<TimeCell>, cellToMerge: UncertainCompatible<TimeCell>): Compatible<TimeCell> {
        const timestamp = Date.parse(`01-01-1970 ${cellToMerge.text}`);
        if (!Number.isNaN(timestamp)) {
            return this.getCompatibleCell({ ...cell, time: new Date(timestamp) });
        }
        const time = new Date( !Number.isNaN(cellToMerge.value) ? cellToMerge.value % 86400000 : '01-01-1970 00:00:00' );
        return this.getCompatibleCell({ ...cell, time });
    }

    render(cell: Compatible<TimeCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TimeCell>, commit: boolean) => void): React.ReactNode {

        if (!isInEditMode) 
            return cell.text;

        const hours = cell.time.getHours().toString().padStart(2, '0');
        const minutes = cell.time.getMinutes().toString().padStart(2, '0');
        const seconds = cell.time.getSeconds().toString().padStart(2, '0');
        const defaultTime = `${hours}:${minutes}:${seconds}`;
        
        return <input
            ref={input => {
                if (input) input.focus();
            }}
            type="time"
            step={1}
            defaultValue={defaultTime}
            onChange={e => {
                const timestamp = Date.parse(`01-01-1970 ${e.currentTarget.value}`);
                if (!Number.isNaN(timestamp)) {
                    const time = new Date(timestamp);
                    onCellChanged(this.getCompatibleCell({ ...cell, time }), false)
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