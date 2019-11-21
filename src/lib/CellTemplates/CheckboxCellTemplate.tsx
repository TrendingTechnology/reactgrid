import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Compatible, Cell, Uncertain, UncertainCompatible } from '../Model';
import { getCellProperty } from '../Functions/getCellProperty';

export interface CheckboxCell extends Cell {
    type: 'checkbox';
    checked: boolean;
    checkedText?: string;
    uncheckedText?: string;
}

export class CheckboxCellTemplate implements CellTemplate<CheckboxCell> {

    getCompatibleCell(uncertainCell: Uncertain<CheckboxCell>): Compatible<CheckboxCell> {
        const checked = getCellProperty(uncertainCell, 'checked', 'boolean');
        const text = checked ?
            uncertainCell.checkedText ? uncertainCell.checkedText : '1' :
            uncertainCell.uncheckedText ? uncertainCell.uncheckedText : '';
        return { ...uncertainCell, checked, value: checked ? 1 : NaN, text };
    }

    handleKeyDown(cell: Compatible<CheckboxCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<CheckboxCell>; enableEditMode: boolean } {
        if (keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER)
            return { cell: this.getCompatibleCell(this.toggleCheckboxCell(cell)), enableEditMode: false }
        return { cell, enableEditMode: false }
    }

    private toggleCheckboxCell(cell: Compatible<CheckboxCell>): Compatible<CheckboxCell> {
        return this.getCompatibleCell({ ...cell, checked: !cell.checked })
    }

    update(cell: Compatible<CheckboxCell>, cellToMerge: UncertainCompatible<CheckboxCell>): Compatible<CheckboxCell> {
        const checked = cellToMerge.type === 'checkbox' ?
            cellToMerge.checked :
            cellToMerge.value ? true : false;
        return this.getCompatibleCell({ ...cell, checked });
    }

    render(cell: Compatible<CheckboxCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<CheckboxCell>, commit: boolean) => void): React.ReactNode {
        return (
            <>
                <input
                    type="checkbox"
                    checked={cell.checked}
                    onChange={e => onCellChanged(this.toggleCheckboxCell(cell), true)}
                />
                <span></span>
            </>
        )
    }



}
