import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible } from '../Model';
import { isTextInput, isNavigationKey } from './keyCodeCheckings'
import { getCellProperty } from '../Functions/getCellProperty';

export interface TextCell extends Cell {
    type: 'text',
    text: string,
    validator?: (text: string) => boolean,
    renderer?: (text: string) => React.ReactNode
}

export class TextCellTemplate implements CellTemplate<TextCell> {

    getCompatibleCell(uncertainCell: Uncertain<TextCell>): Compatible<TextCell> {
        const text = getCellProperty(uncertainCell, 'text', 'string');
        const value = parseFloat(text); // TODO more advanced parsing for all text based cells
        return { ...uncertainCell, text, value };
    }

    update(cell: Compatible<TextCell>, cellToMerge: UncertainCompatible<TextCell>): Compatible<TextCell> {
        return this.getCompatibleCell({ ...cell, text: cellToMerge.text })
    }

    handleKeyDown(cell: Compatible<TextCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<TextCell>, enableEditMode: boolean } {
        const char = String.fromCharCode(keyCode)
        if (!ctrl && !alt && isTextInput(keyCode))
            return { cell: this.getCompatibleCell({ ...cell, text: shift ? char : char.toLowerCase() }), enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    getClassName(cell: Compatible<TextCell>, isInEditMode: boolean) {
        const isValid = cell.validator ? cell.validator(cell.text) : true;
        return isValid ? 'valid' : 'invalid';
    }

    render(cell: Compatible<TextCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TextCell>, commit: boolean) => void): React.ReactNode {

        if (!isInEditMode)
            return cell.renderer ? cell.renderer(cell.text) : cell.text;

        return <input
            className="rg-text-cell-template"
            ref={input => {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            defaultValue={cell.text}
            onChange={e => {
                // const caretPositionStart = e.target.selectionStart;
                // const input = e.target;
                // window.requestAnimationFrame(() => {
                //     input.selectionStart = caretPositionStart;
                //     input.selectionEnd = caretPositionStart;
                // });
                onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), false);
            }}
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