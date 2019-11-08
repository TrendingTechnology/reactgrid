import * as React from 'react';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
export interface NumberCell extends Cell {
    type: 'number';
    value: number;
}
export declare class NumberCellTemplate implements CellTemplate<NumberCell> {
    validate(cell: NumberCell): CompatibleCell<NumberCell>;
    handleKeyDown(cell: NumberCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: {
            data: number;
            type: "number";
            value: number;
            style?: import("../Model").CellStyle | undefined;
        };
        enableEditMode: boolean;
    } | {
        cell: NumberCell;
        enableEditMode: boolean;
    };
    render(cell: NumberCell, isInEditMode: boolean, onCellChanged: (cell: NumberCell, commit: boolean) => void): React.ReactNode;
}
