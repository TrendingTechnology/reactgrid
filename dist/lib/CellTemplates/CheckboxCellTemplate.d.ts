import * as React from 'react';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
export interface CheckboxCell extends Cell {
    type: 'checkbox';
    value: boolean;
}
export declare class CheckboxCellTemplate implements CellTemplate<CheckboxCell> {
    validate(cell: any): CompatibleCell<CheckboxCell>;
    handleKeyDown(cell: CheckboxCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: CheckboxCell;
        enableEditMode: boolean;
    };
    update(cell: CheckboxCell, newCell: CheckboxCell | CompatibleCell): CheckboxCell;
    render(cell: CheckboxCell, isInEditMode: boolean, onCellChanged: (cell: CheckboxCell, commit: boolean) => void): React.ReactNode;
}
