import * as React from 'react';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
export interface GroupCell extends Cell {
    type: 'group';
    text: string;
    isExpanded: boolean | undefined;
    depth?: number;
}
export declare class GroupCellTemplate implements CellTemplate<GroupCell> {
    validate(cell: GroupCell): CompatibleCell<GroupCell>;
    update(cell: GroupCell, newCell: GroupCell | CompatibleCell): GroupCell;
    handleKeyDown(cell: GroupCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: {
            type: "group";
            text: string;
            isExpanded: boolean | undefined;
            depth?: number | undefined;
            style?: import("../Model").CellStyle | undefined;
        };
        enableEditMode: boolean;
    };
    render(cell: GroupCell, isInEditMode: boolean, onCellChanged: (cell: GroupCell, commit: boolean) => void): React.ReactNode;
}
