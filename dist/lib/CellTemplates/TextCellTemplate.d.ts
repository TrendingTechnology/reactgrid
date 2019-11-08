import * as React from 'react';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
export interface TextCell extends Cell {
    type: 'text';
    text: string;
}
export declare class TextCellTemplate implements CellTemplate<TextCell> {
    validate(cell: TextCell): CompatibleCell<TextCell>;
    update(cell: TextCell, newCell: TextCell | CompatibleCell): TextCell;
    handleKeyDown(cell: TextCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: TextCell;
        enableEditMode: boolean;
    };
    render(cell: TextCell, isInEditMode: boolean, onCellChanged: (cell: TextCell, commit: boolean) => void): React.ReactNode;
}
