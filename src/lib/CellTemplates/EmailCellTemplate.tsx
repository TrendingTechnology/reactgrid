import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
import { isNavigationKey, isTextInput } from './keyCodeCheckings';

export interface EmailCell extends Cell {
    type: 'email',
    text: string,
    isValid: boolean
}

export class EmailCellTemplate implements CellTemplate<EmailCell> {

    validate(cell: any): CompatibleCell<EmailCell> {
        if (cell.text === undefined || cell.text === null)
            throw 'EmailCell is missing text property'
        const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        cell.isValid = true;
        if (!email_regex.test(cell.text.replace(/\s+/g, ''))) {
            cell.isValid = false;
        }
        return cell;
    }

    handleKeyDown(cell: EmailCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: EmailCell, enableEditMode: boolean } {
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cell: { ...cell, text: '' }, enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    update(cell: EmailCell, newCell: EmailCell | CompatibleCell): EmailCell {
        // A CompatibleCell will provide the properties a EmailCell needs
        return newCell as EmailCell;
    }

    render(cell: EmailCell, isInEditMode: boolean, onCellChanged: (cell: EmailCell, commit: boolean) => void): React.ReactNode {
        if (!isInEditMode) {
            return <span className={cell.isValid === false ? `rg-email-cell-template-invalid` : ``}>{cell.text}</span>
        }

        return <input
            className="rg-email-cell-template"
            ref={input => {
                if (input) {
                    input.focus();
                }
            }}
            onChange={e => onCellChanged({ ...cell, text: e.currentTarget.value }, false)}
            onKeyDown={e => {
                if (isTextInput(e.keyCode) || (isNavigationKey(e))) e.stopPropagation();
                if (e.keyCode == keyCodes.ESC) e.currentTarget.value = cell.text; // reset
            }}
            defaultValue={cell.text}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}
