import * as React from 'react';
import { keyCodes } from '../Common/Constants';
import { isTextInput, isNavigationKey } from './keyCodeCheckings'
import { CellRenderProps, CellTemplate } from '../Common';

interface GroupHeaderCellData {
    name: string;
    isExpanded: boolean | undefined;
    depth: number;
}

export class GroupHeaderCellTemplate implements CellTemplate<GroupHeaderCellData, any> {

    isValid(cellData: GroupHeaderCellData): boolean {
        return typeof (cellData.name) === 'string' && (cellData.isExpanded === undefined || typeof (cellData.isExpanded) === 'boolean') && typeof (cellData.depth) === 'number';
    }

    textToCellData(text: string): any {
        return { name: text, isExpanded: false, depth: 1 };
    }

    cellDataToText(cellData: GroupHeaderCellData) {
        return cellData.name;
    }

    handleKeyDown(cellData: GroupHeaderCellData, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, props?: any) {
        let enableEditMode = keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER;
        const cellDataCopy = { ...cellData };
        if (keyCode === keyCodes.SPACE && cellDataCopy.isExpanded !== undefined) {
            cellDataCopy.isExpanded = !cellDataCopy.isExpanded;
        } else if (!ctrl && !alt && isTextInput(keyCode)) {
            cellDataCopy.name = '';
            enableEditMode = true;
        }
        return { cellData: cellDataCopy, enableEditMode };
    }

    renderContent: (props: CellRenderProps<GroupHeaderCellData, any>) => React.ReactNode = (props) => {
        const cellData = { ...props.cellData };

        const isHeaderTreeRoot = cellData.depth !== 1;
        const canBeExpanded = cellData.isExpanded !== undefined;
        const elementMarginMultiplier = canBeExpanded && isHeaderTreeRoot ? cellData.depth - 2 : cellData.depth - 1;
        return (
            !props.isInEditMode ?
                <div
                    className="rg-group-header-cell-template-wrapper"
                    style={{ marginLeft: `calc( 1.4em * ${(cellData.depth ? elementMarginMultiplier : 1)} )` }}>
                    {cellData.isExpanded !== undefined &&<Chevron cellData={cellData} cellProps={props}/>}
                    <div className="rg-group-header-cell-template-wrapper-content">{cellData.name}</div>
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
                    defaultValue={cellData.name}
                    onChange={e =>
                        props.onCellDataChanged({ name: e.currentTarget.value, isExpanded: cellData.isExpanded, depth: cellData.depth }, false)
                    }
                    onCopy={e => e.stopPropagation()}
                    onCut={e => e.stopPropagation()}
                    onPaste={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onKeyDown={e => {
                        if (isTextInput(e.keyCode) || (isNavigationKey(e))) e.stopPropagation();
                        if (e.keyCode == keyCodes.ESC) (e as any).currentTarget.value = props.cellData.name; // reset
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
                className="rg-group-header-cell-template-chevron-wrapper"
            >
                <div style={{ transform: `${cellData.isExpanded ? 'rotate(90deg)' : 'rotate(0)'}`, transition: '200ms all',}}>
                    ❯
                </div>
            </div>
        )
    }
}

