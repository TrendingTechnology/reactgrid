import * as React from 'react';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
export interface NumberCell extends Cell {
    type: 'number';
    value: number;
    format?: Intl.NumberFormat;
    hideZero?: boolean;
    isValid: boolean | undefined;
}
export declare class NumberCellTemplate implements CellTemplate<NumberCell> {
    validate(cell: any): CompatibleCell<NumberCell>;
    handleKeyDown(cell: NumberCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: {
            value: number;
            type: "number";
            format?: Intl.NumberFormat | undefined;
            hideZero?: boolean | undefined;
            isValid: boolean | undefined;
            style?: import("../Model").CellStyle | undefined;
        };
        enableEditMode: boolean;
    };
    parseNumber(strg: string): number;
    update(cell: NumberCell, newCell: NumberCell | CompatibleCell): NumberCell;
    replaceCommasToDots(value: any): any;
    isValidPrecisonFormat(format: string | undefined): boolean;
    render(cell: NumberCell, isInEditMode: boolean, onCellChanged: (cell: NumberCell, commit: boolean) => void): React.ReactNode;
}
