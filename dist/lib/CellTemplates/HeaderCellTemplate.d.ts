import * as React from 'react';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
export interface HeaderCell extends Cell {
    type: 'header';
    text: string;
}
export declare class HeaderCellTemplate implements CellTemplate<HeaderCell> {
    validate(cell: HeaderCell): CompatibleCell<HeaderCell>;
    render(cell: HeaderCell, isInEditMode: boolean, onCellChanged: (cell: HeaderCell, commit: boolean) => void): React.ReactNode;
    isFocusable: () => boolean;
    getStyle: (cell: HeaderCell) => {
        background: string;
    };
}
