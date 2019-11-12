import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, CompatibleCell } from '../Model';

export interface CheckboxCell extends Cell {
    type: 'checkbox',
    value: boolean
}

export class CheckboxCellTemplate implements CellTemplate<CheckboxCell> {

    validate(cell: any): CompatibleCell<CheckboxCell> {
        return { ...cell, text: cell.value.toString() };
    }

    handleKeyDown(cell: CheckboxCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: CheckboxCell; enableEditMode: boolean } {
        if (keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER)
            return { cell: { ...cell, value: !cell.value }, enableEditMode: false }
        return { cell, enableEditMode: false }
    }

    update(cell: CheckboxCell, newCell: CheckboxCell | CompatibleCell): CheckboxCell {
        // A CompatibleCell will provide the properties a CheckboxCell needs
        return newCell as CheckboxCell;
    }

    render(cell: CheckboxCell, isInEditMode: boolean, onCellChanged: (cell: CheckboxCell, commit: boolean) => void): React.ReactNode {
        return (
            <label className="rg-checkbox-container">
                <input
                    type="checkbox"
                    className="rg-checkbox-cell-input"
                    checked={cell.value}
                    onChange={e => onCellChanged({ ...cell, value: !cell.value }, true)}
                />
                <span className="rg-checkbox-checkmark"></span>
            </label>
        )
    }

}
