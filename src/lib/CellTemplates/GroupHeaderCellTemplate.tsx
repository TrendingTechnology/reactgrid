import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
import { isNavigationKey, isTextInput } from './keyCodeCheckings'


export interface GroupHeaderCell extends Cell { // rename GroupHeaderCell to GroupCell ?? 
    type: 'group';
    text: string; 
    isExpanded: boolean | undefined;
    depth: number;
}

// type GroupHeaderCell = Cell<'group', GroupHeaderCellData, {}>

export class GroupHeaderCellTemplate implements CellTemplate<GroupHeaderCell> {

//     isValid(cell: GroupHeaderCell): boolean {
//         return typeof (cell.data.name) === 'string' && (cell.data.isExpanded === undefined || typeof (cell.data.isExpanded) === 'boolean') && typeof (cell.data.depth) === 'number';
//     }
    validate(cell: GroupHeaderCell): CompatibleCell<GroupHeaderCell> {

        if (cell.depth === undefined || cell.depth === null)
            throw 'GroupHeaderCell is missing depth property'
        return { ...cell, text: cell.text }
    }

//     textToCellData(text: string): any {
//         return { name: text, isExpanded: false, depth: 1 };
//     }

//     toText(cell: GroupHeaderCell) {
//         return cell.data.name;
//     }


    handleKeyDown(cell: GroupHeaderCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
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

    render(cell: GroupHeaderCell, isInEditMode: boolean, onCellChanged: (cell: GroupHeaderCell, commit: boolean) => void): React.ReactNode {
        // const cellData = { ...cell.cellData };

        const isHeaderTreeRoot = cell.depth !== 1;
        const canBeExpanded = cell.isExpanded !== undefined;
        const elementMarginMultiplier = canBeExpanded && isHeaderTreeRoot ? cell.depth - 2 : cell.depth - 1;
        return (
            !isInEditMode ?
                <div
                    className="rg-group-header-cell-template-wrapper"
                    style={{ marginLeft: `calc( 1.4em * ${(cell.depth ? elementMarginMultiplier : 1)} )` }}
                >
                    {/* {cell.isExpanded !== undefined && 
                        <Chevron cellData={cell} cellProps={props}/>
                    } */}
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
                    // onChange={e =>
                    //     onCellChanged({ text: e.currentTarget.value, isExpanded: cell.isExpanded, depth: cell.depth }, false)
                    // }
                    onCopy={e => e.stopPropagation()}
                    onCut={e => e.stopPropagation()}
                    onPaste={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onKeyDown={e => {
                        if (isTextInput(e.keyCode) || (isNavigationKey(e))) e.stopPropagation();
                        if (e.keyCode == keyCodes.ESC) (e as any).currentTarget.value = cell.text; // reset
                    }}
                />
        );
    }

}

// class Chevron extends React.Component<IChevronProps> {
class Chevron extends React.Component<any> {
    render() {
        const { cellData, cellProps } = this.props;
        return (
            <div
                onPointerDown={e => {
                    e.stopPropagation();
                    cellData.isExpanded = !cellData.isExpanded;
                    cellProps.onCellDataChanged(cellData, true);
                }}
                className="rg-group-header-cell-template-chevron-wrapper"
            >
                <div style={{ transform: `${cellData.isExpanded ? 'rotate(90deg)' : 'rotate(0)'}`, transition: '200ms all',}}>
                    ❯
                </div>
            </div>
        )
    }
}

