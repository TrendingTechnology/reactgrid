import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
import { isTextInput, isNavigationKey } from './keyCodeCheckings'

export interface TextCell extends Cell {
    type: 'text',
    text: string
}

export class TextCellTemplate implements CellTemplate<TextCell> {

    validate(cell: TextCell): CompatibleCell<TextCell> {
        if (cell.text === undefined || cell.text === null)
            throw 'TextCell is missing text property'
        return cell;
    }

    update(cell: TextCell, newCell: TextCell | CompatibleCell): TextCell {
        return { ...cell, text: newCell.text !== undefined ? newCell.text : '' };
    }

    handleKeyDown(cell: TextCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: TextCell, enableEditMode: boolean } {
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cell: { ...cell, text: '' }, enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    render(cell: TextCell, isInEditMode: boolean, onCellChanged: (cell: TextCell, commit: boolean) => void): React.ReactNode {

        if (!isInEditMode)
            return cell.text;

        return <input
            className="rg-text-cell-template"
            ref={input => {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            defaultValue={cell.text}
            onChange={e => onCellChanged({ ...cell, text: e.currentTarget.value }, false)}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            onKeyDown={e => {
                if (isTextInput(e.keyCode) || (isNavigationKey(e))) e.stopPropagation();
            }}
        />
    }
}