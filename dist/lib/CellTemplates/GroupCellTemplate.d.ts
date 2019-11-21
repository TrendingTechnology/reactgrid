import * as React from 'react';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible } from '../Model';
export interface GroupCell extends Cell {
    type: 'group';
    text: string;
    isExpanded?: boolean;
    depth?: number;
}
export declare class GroupCellTemplate implements CellTemplate<GroupCell> {
    getCompatibleCell(uncertainCell: Uncertain<GroupCell>): Compatible<GroupCell>;
    update(cell: Compatible<GroupCell>, cellToMerge: UncertainCompatible<GroupCell>): Compatible<GroupCell>;
    handleKeyDown(cell: Compatible<GroupCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<GroupCell>;
        enableEditMode: boolean;
    };
    render(cell: Compatible<GroupCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<GroupCell>, commit: boolean) => void): React.ReactNode;
}
