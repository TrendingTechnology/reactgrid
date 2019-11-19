import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible } from '../Model';
import { isNavigationKey, isTextInput } from './keyCodeCheckings';
import { getCellProperty } from '../Functions/getCellProperty';

export interface GroupCell extends Cell { // rename GroupHeaderCell to GroupCell ?? 
    type: 'group';
    text: string;
    isExpanded?: boolean;
    depth?: number;
}

export class GroupCellTemplate implements CellTemplate<GroupCell> {

    getCompatibleCell(uncertainCell: Uncertain<GroupCell>): Compatible<GroupCell> {
        const text = getCellProperty(uncertainCell, 'text', 'string');
        const value = parseFloat(text);
        return { ...uncertainCell, text, value };
    }

    update(cell: Compatible<GroupCell>, cellToMerge: UncertainCompatible<GroupCell>): Compatible<GroupCell> {
        return this.getCompatibleCell({ ...cell, text: cellToMerge.text })
    }

    handleKeyDown(cell: Compatible<GroupCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<GroupCell>, enableEditMode: boolean } {
        let enableEditMode = keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER;
        const cellCopy = { ...cell };
        const char = String.fromCharCode(keyCode)
        if (keyCode === keyCodes.SPACE && cellCopy.isExpanded !== undefined) {
            cellCopy.isExpanded = !cellCopy.isExpanded;
        } else if (!ctrl && !alt && isTextInput(keyCode)) {
            cellCopy.text = !shift ? char.toLowerCase() : char;
            enableEditMode = true;
        }
        return { cell: cellCopy, enableEditMode };
    }

    render(cell: Compatible<GroupCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<GroupCell>, commit: boolean) => void): React.ReactNode {
        const canBeExpanded = cell.isExpanded !== undefined;
        const elementMarginMultiplier = cell.depth ? cell.depth : 0;
        return (
            !isInEditMode ?
                <div
                    className="wrapper"
                    style={{ marginLeft: `calc( 1.2em * ${elementMarginMultiplier})` }}
                >
                    {canBeExpanded &&
                        <Chevron cell={cell} onCellChanged={onCellChanged} />
                    }
                    <div className="wrapper-content">{cell.text}</div>
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
                    onChange={e => onCellChanged({ ...cell, text: e.currentTarget.value }, false)}
                    onCopy={e => e.stopPropagation()}
                    onCut={e => e.stopPropagation()}
                    onPaste={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onKeyDown={e => {
                        if (isTextInput(e.keyCode) || (isNavigationKey(e))) e.stopPropagation();
                    }}
                />
        );
    }

}

// class Chevron extends React.Component<IChevronProps> {
const Chevron: React.FC<{ cell: Compatible<GroupCell>, onCellChanged: (cell: Compatible<GroupCell>, commit: boolean) => void }> = ({ cell, onCellChanged }) => {
    return (
        <div
            onPointerDown={e => {
                e.stopPropagation();
                onCellChanged({ ...cell, isExpanded: !cell.isExpanded }, true);
            }}
            className="chevron"
        >
            <div style={{ transform: `${cell.isExpanded ? 'rotate(90deg)' : 'rotate(0)'}`, transition: '200ms all' }}>
                ❯
            </div>
        </div>
    )
}

