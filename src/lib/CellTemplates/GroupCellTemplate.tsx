import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible, Id } from '../Model';
import { isNavigationKey, isAlphaNumericKey } from './keyCodeCheckings';
import { getCellProperty } from '../Functions/getCellProperty';
import { CellEditor } from '../Components/CellEditor';

export interface GroupCell extends Cell {
    type: 'group';
    text: string;
    isExpanded?: boolean;
    hasChildrens?: boolean;
    isDisplayed: boolean;
    rowId: Id;
    parentId?: Id;
    indent?: number;
    onClick?: (rowId: Id) => void;
}

export class GroupCellTemplate implements CellTemplate<GroupCell> {

    getCompatibleCell(uncertainCell: Uncertain<GroupCell>): Compatible<GroupCell> {
        const text = getCellProperty(uncertainCell, 'text', 'string');
        const isExpanded = getCellProperty(uncertainCell, 'isExpanded', 'boolean');
        const rowId = getCellProperty(uncertainCell, 'rowId', 'number');
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
        let isDisplayed;
        try {
            isDisplayed = getCellProperty(uncertainCell, 'isDisplayed', 'boolean');
        } catch {
            isDisplayed = false;
        }
        const value = parseFloat(text);
        return { ...uncertainCell, text, value, isExpanded, hasChildrens: hasChildrens, isDisplayed, rowId, indent };
    }

    update(cell: Compatible<GroupCell>, cellToMerge: UncertainCompatible<GroupCell>): Compatible<GroupCell> {
        return this.getCompatibleCell({ ...cell, isExpanded: cellToMerge.isExpanded })
    }

    handleKeyDown(cell: Compatible<GroupCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<GroupCell>, enableEditMode: boolean } {
        let enableEditMode = keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER;
        const cellCopy = { ...cell };
        const char = String.fromCharCode(keyCode)
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
        const elementMarginMultiplier = cell.indent ? canBeExpanded ? cell.indent : cell.indent + 1 : 0;

        return (
            !isInEditMode ?
                <div
                    className="wrapper"
                    style={{ marginLeft: `calc( 1.3em * ${elementMarginMultiplier})` }}
                >
                    {canBeExpanded &&
                        <div
                            className="chevron"
                            onPointerDown={e => {
                                e.stopPropagation();
                                onCellChanged(this.getCompatibleCell({ ...cell, isExpanded: !cell.isExpanded}), true)
                                cell.onClick ? cell.onClick(cell.rowId) : null;
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

// class Chevron extends React.Component<IChevronProps> {
// const Chevron: React.FC<{ 
//     cell: Compatible<GroupCell>, 
//     onCellChanged: (cell: Compatible<GroupCell>, commit: boolean) => void, 
//     getCompatibleCell: (uncertainCell: Uncertain<GroupCell>) => Compatible<GroupCell> }
// > = ({ cell, onCellChanged, getCompatibleCell }) => {
//     return (
//         <div
//             onPointerDown={e => {
//                 e.stopPropagation();
//                 onCellChanged(getCompatibleCell({ ...cell, isExpanded: false }), true);
//             }}
//             className="chevron"
//         >
//             <div style={{ transform: `${cell.isExpanded ? 'rotate(90deg)' : 'rotate(0)'}`, transition: '200ms all' }}>
//                 ❯
//             </div>
//         </div>
//     )
// }

