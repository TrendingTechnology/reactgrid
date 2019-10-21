import * as React from 'react';
import { keyCodes } from '../Model/keyCodes';
import { isTextInput, isNavigationKey } from './keyCodeCheckings'
import { CellRenderProps, CellTemplate } from '../Model';

interface GroupHeaderCellData {
    name: string;
    isExpanded: boolean | undefined;
    depth: number;
}

type GroupHeaderCell = Cell<'group', GroupHeaderCellData, {}>

export class GroupHeaderCellTemplate implements CellTemplate<GroupHeaderCell> {

    isValid(cell: GroupHeaderCell): boolean {
        return typeof (cell.data.name) === 'string' && (cell.data.isExpanded === undefined || typeof (cell.data.isExpanded) === 'boolean') && typeof (cell.data.depth) === 'number';
    }

    textToCellData(text: string): any {
        return { name: text, isExpanded: false, depth: 1 };
    }

    toText(cell: GroupHeaderCell) {
        return cell.data.name;
    }

    handleKeyDown(cell: GroupHeaderCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
        let enableEditMode = keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER;
        const cellCopy = { ...cell };
        if (keyCode === keyCodes.SPACE && cellCopy.data.isExpanded !== undefined) {
            cellCopy.data.isExpanded = !cellCopy.data.isExpanded;
        } else if (!ctrl && !alt && isTextInput(keyCode)) {
            cellCopy.data.name = '';
            enableEditMode = true;
        }
        return { cell: cellCopy, enableEditMode };
    }

    renderContent: (props: CellRenderProps<GroupHeaderCell>) => React.ReactNode = (props) => {
        const cellData = { ...props.cell.data };

        const isHeaderTreeRoot = cellData.depth !== 1;
        const canBeExpanded = cellData.isExpanded !== undefined;
        const elementMarginMultiplier = canBeExpanded && isHeaderTreeRoot ? cellData.depth - 2 : cellData.depth - 1;
        return (
            !props.isInEditMode ?
                <div
                    style={{ display: 'flex', alignItems: 'center', width: '100%', marginLeft: `calc( 1.4em * ${(cellData.depth ? elementMarginMultiplier : 1)} )` }}>
                    {cellData.isExpanded !== undefined && <Chevron cellData={cellData} cellProps={props} />}
                    <div style={{ display: 'flex', alignItems: 'center' }}>{cellData.name}</div>
                </div>
                :
                <input
                    style={{
                        position: 'inherit',
                        width: '100%',
                        height: '100%',
                        padding: 0,
                        border: 0,
                        background: 'transparent',
                        fontSize: '1em',
                        outline: 'none',
                    }}
                    ref={input => {
                        if (input) {
                            input.focus();
                            input.setSelectionRange(input.value.length, input.value.length);
                        }
                    }}
                    defaultValue={cellData.name}
                    onChange={e =>
                        props.onCellChanged({ ...props.cell, data: { ...cellData, name: e.currentTarget.value } }, false)
                    }
                    onCopy={e => e.stopPropagation()}
                    onCut={e => e.stopPropagation()}
                    onPaste={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onKeyDown={e => {
                        if (isTextInput(e.keyCode) || (isNavigationKey(e))) e.stopPropagation();
                        if (e.keyCode == keyCodes.ESC) (e as any).currentTarget.value = props.cell.data.name; // reset
                    }}
                />
        );
    }
}

interface IChevronProps {
    cellData: GroupHeaderCellData;
    cellProps: any;
}

class Chevron extends React.Component<IChevronProps> {
    render() {
        const { cellData, cellProps } = this.props;
        return (
            <div
                onPointerDown={e => {
                    e.stopPropagation();
                    cellData.isExpanded = !cellData.isExpanded;
                    cellProps.onCellDataChanged(cellData, true);
                }}
                style={{
                    zIndex: 1,
                    pointerEvents: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    height: '1.4em',
                    width: '1.4em',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                }}
            >
                <div
                    style={{
                        transform: `${cellData.isExpanded ? 'rotate(90deg)' : 'rotate(0)'}`,
                        transition: '200ms all',
                    }}>❯</div>
            </div>
        )
    }
}

