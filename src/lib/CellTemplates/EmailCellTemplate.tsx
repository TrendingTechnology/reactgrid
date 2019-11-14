import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
import { isNavigationKey, isTextInput } from './keyCodeCheckings';

export interface EmailCell extends Cell {
    type: 'email',
    text: string,
    isValid?: boolean | undefined
}

export class EmailCellTemplate implements CellTemplate<EmailCell> {

    validate(cell: any): CompatibleCell<EmailCell> {        
        if (cell.text === undefined || cell.text === null)
            throw 'EmailCell is missing text property'
        if (!this.isEmailValid(cell.text))
            cell.isValid = false;
        return cell;
    }

    isEmailValid(email: string): boolean {
        const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email_regex.test(email.replace(/\s+/g, '')))
            return true;
        return false;
    }

    handleKeyDown(cell: EmailCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: EmailCell, enableEditMode: boolean } {
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cell: { ...cell, text: '' }, enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    update(cell: EmailCell, newCell: EmailCell | CompatibleCell): EmailCell {
        if (newCell.text !== undefined && newCell.text.length !== 0) {
            const isValid = this.isEmailValid((newCell as CompatibleCell).text);
            return { ...cell, text: newCell.text, isValid } as EmailCell;
        }
        return newCell as EmailCell;
    }

    render(cell: EmailCell, isInEditMode: boolean, onCellChanged: (cell: EmailCell, commit: boolean) => void): React.ReactNode {
        if (!isInEditMode) {
            return <span className={cell.isValid === false ? `rg-email-cell-template-invalid` : `rg-email-cell-template-valid`}>{cell.text}</span>
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
            }}
            defaultValue={cell.text}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}
