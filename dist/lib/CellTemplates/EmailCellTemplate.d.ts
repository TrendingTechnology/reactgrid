import * as React from 'react';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
export interface EmailCell extends Cell {
    type: 'email';
    text: string;
    isValid?: boolean | undefined;
}
export declare class EmailCellTemplate implements CellTemplate<EmailCell> {
    validate(cell: any): CompatibleCell<EmailCell>;
    isEmailValid(email: string): boolean;
    handleKeyDown(cell: EmailCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: EmailCell;
        enableEditMode: boolean;
    };
    update(cell: EmailCell, newCell: EmailCell | CompatibleCell): EmailCell;
    render(cell: EmailCell, isInEditMode: boolean, onCellChanged: (cell: EmailCell, commit: boolean) => void): React.ReactNode;
}
