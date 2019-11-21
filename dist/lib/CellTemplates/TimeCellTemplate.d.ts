import * as React from 'react';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible } from '../Model';
export interface TimeCell extends Cell {
    type: 'time';
    time?: Date;
    format?: Intl.DateTimeFormat;
}
export declare class TimeCellTemplate implements CellTemplate<TimeCell> {
    getCompatibleCell(uncertainCell: Uncertain<TimeCell>): Compatible<TimeCell>;
    handleKeyDown(cell: Compatible<TimeCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<TimeCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<TimeCell>, cellToMerge: UncertainCompatible<TimeCell>): Compatible<TimeCell>;
    render(cell: Compatible<TimeCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TimeCell>, commit: boolean) => void): React.ReactNode;
}
