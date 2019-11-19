import * as React from 'react';
import { CellTemplate, Cell, Compatible, Uncertain } from '../Model';
import { getCellProperty } from '../Functions/getCellProperty';

export interface HeaderCell extends Cell {
    type: 'header',
    text: string,
}

export class HeaderCellTemplate implements CellTemplate<HeaderCell> {

    getCompatibleCell(uncertainCell: Uncertain<HeaderCell>): Compatible<HeaderCell> {
        const text = getCellProperty(uncertainCell, 'text', 'string');
        const value = parseFloat(text);
        return { ...uncertainCell, text, value };
    }

    render(cell: Compatible<HeaderCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<HeaderCell>, commit: boolean) => void): React.ReactNode {
        return cell.text;
    }

    isFocusable = () => false;

    getStyle = (cell: Compatible<HeaderCell>) => ({ background: '#f3f3f3' })
}
