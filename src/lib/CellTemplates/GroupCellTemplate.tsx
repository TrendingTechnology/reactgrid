import * as React from 'react';
import { keyCodes } from '../Functions';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible, Id } from '../Model';
import { isNavigationKey, isAlphaNumericKey } from './keyCodeCheckings';
import { getCellProperty } from '..';

export interface GroupCell extends Cell {
    type: 'group';
    text: string;
    isExpanded?: boolean;
    hasChildrens?: boolean;
    // rowId: Id;
    parentId?: Id;
    indent?: number;
}

export class GroupCellTemplate implements CellTemplate<GroupCell> {

    getCompatibleCell(uncertainCell: Uncertain<GroupCell>): Compatible<GroupCell> {
        const text = getCellProperty(uncertainCell, 'text', 'string');
        let isExpanded;
        try {
            isExpanded = getCellProperty(uncertainCell, 'isExpanded', 'boolean');
        } catch {
            isExpanded = true;
        }
        let indent;
        try {
            indent = getCellProperty(uncertainCell, 'indent', 'number');
        } catch {
            indent = 0;
        }
        let hasChildrens;
        try {
            hasChildrens = getCellProperty(uncertainCell, 'hasChildrens', 'boolean');
        } catch {
            hasChildrens = true;
        }
        const value = parseFloat(text);
        return { ...uncertainCell, text, value, isExpanded, hasChildrens, indent };
    }

    update(cell: Compatible<GroupCell>, cellToMerge: UncertainCompatible<GroupCell>): Compatible<GroupCell> {
        return this.getCompatibleCell({ ...cell, isExpanded: cellToMerge.isExpanded })
    }

    handleKeyDown(cell: Compatible<GroupCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<GroupCell>, enableEditMode: boolean } {
        let enableEditMode = keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER;
        const cellCopy = { ...cell };
        const char = String.fromCharCode(keyCode);
        if (keyCode === keyCodes.SPACE && cellCopy.isExpanded !== undefined) {
            cellCopy.isExpanded = !cellCopy.isExpanded;
        } else if (!ctrl && !alt && isAlphaNumericKey(keyCode)) {
            cellCopy.text = !shift ? char.toLowerCase() : char;
            enableEditMode = true;
        }
        return { cell: cellCopy, enableEditMode };
    }

    getClassName(cell: Compatible<GroupCell>, isInEditMode: boolean) {
        return cell.className ? cell.className : '';
    }

    render(cell: Compatible<GroupCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<GroupCell>, commit: boolean) => void): React.ReactNode {
        const canBeExpanded = cell.hasChildrens === true;
        const indent = cell.indent ? cell.indent : 0;
        const elementMarginMultiplier = indent * 1.2;

        return (
            !isInEditMode ?
                <div
                    className="wrapper"
                    style={{ marginLeft: `${elementMarginMultiplier}em` }}
                >
                    {canBeExpanded &&
                        <div
                            className="chevron"
                            onPointerDown={e => {
                                e.stopPropagation();
                                onCellChanged(this.getCompatibleCell({ ...cell, isExpanded: !cell.isExpanded}), true)
                            }}
                        >
                            <div style={{ transform: `${cell.isExpanded ? 'rotate(90deg)' : 'rotate(0)'}`, transition: '200ms all' }}>❯</div>
                        </div>
                    }
                    <div className="content">{cell.text}</div>
                </div>
                :
                <input
                    ref={input => {
                        if (input) {
                            input.focus();
                            input.setSelectionRange(input.value.length, input.value.length);
                        }
                    }}
                    defaultValue={cell.text}
                    onChange={e => onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), false)}
                    onCopy={e => e.stopPropagation()}
                    onCut={e => e.stopPropagation()}
                    onPaste={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onKeyDown={e => {
                        if (isAlphaNumericKey(e.keyCode) || (isNavigationKey(e.keyCode))) e.stopPropagation();
                    }}
                />
        );
    }

}

