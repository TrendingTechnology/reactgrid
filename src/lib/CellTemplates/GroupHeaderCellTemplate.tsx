import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
import { isNavigationKey, isTextInput } from './keyCodeCheckings'

export interface GroupCell extends Cell { // rename GroupHeaderCell to GroupCell ?? 
    type: 'group';
    text: string; 
    isExpanded: boolean | undefined;
    depth?: number;
}

export class GroupCellTemplate implements CellTemplate<GroupCell> {

    validate(cell: GroupCell): CompatibleCell<GroupCell> {
        if (cell.text === undefined || cell.text === null)
            throw 'GroupCell is missing text property'
        return { ...cell }
    }

    update(cell: GroupCell, newCell: GroupCell | CompatibleCell): GroupCell {
        return newCell as GroupCell;
    }

    handleKeyDown(cell: GroupCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
        let enableEditMode = keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER;
        const cellCopy = { ...cell };
        if (keyCode === keyCodes.SPACE && cellCopy.isExpanded !== undefined) {
            cellCopy.isExpanded = !cellCopy.isExpanded;
        } else if (!ctrl && !alt && isTextInput(keyCode)) {
            cellCopy.text = '';
            enableEditMode = true;
        }
        return { cell: cellCopy, enableEditMode };
    }

    render(cell: GroupCell, isInEditMode: boolean, onCellChanged: (cell: GroupCell, commit: boolean) => void): React.ReactNode {
        const canBeExpanded = cell.isExpanded !== undefined;
        const elementMarginMultiplier = cell.depth ? cell.depth - 1 : 0;
        return (
            !isInEditMode ?
                <div
                    className="rg-group-header-cell-template-wrapper"
                    style={{ marginLeft: `calc( 1.4em * ${elementMarginMultiplier})` }}
                >
                    {canBeExpanded && 
                        <Chevron cell={cell} onCellChanged={onCellChanged}/>
                    }
                    <div className="rg-group-header-cell-template-wrapper-content">{cell.text}</div>
                </div>
                :
                <input
                    className="rg-group-header-cell-template-input"
                    ref={input => {
                        if (input) {
                            input.focus();
                            input.setSelectionRange(input.value.length, input.value.length);
                        }
                    }}
                    defaultValue={cell.text}
                    onChange={e => onCellChanged({ ...cell, text: e.currentTarget.value }, false) }
                    onCopy={e => e.stopPropagation()}
                    onCut={e => e.stopPropagation()}
                    onPaste={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onKeyDown={e => {
                        if (isTextInput(e.keyCode) || (isNavigationKey(e))) e.stopPropagation();
                        if (e.keyCode == keyCodes.ESC) e.currentTarget.value = cell.text;
                    }}
                />
        );
    }

}

// class Chevron extends React.Component<IChevronProps> {
const Chevron: React.FC<{cell: GroupCell, onCellChanged: (cell: GroupCell, commit: boolean) => void}> = ({ cell, onCellChanged }) => {
    return (
        <div
            onPointerDown={e => {
                e.stopPropagation();
                onCellChanged({...cell, isExpanded: !cell.isExpanded}, true);
            }}
            className="rg-group-header-cell-template-chevron-wrapper"
        >
            <div style={{ transform: `${cell.isExpanded ? 'rotate(90deg)' : 'rotate(0)'}`, transition: '200ms all'}}>
                ❯
            </div>
        </div>
    )
}

