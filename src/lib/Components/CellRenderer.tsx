import * as React from "react";
import { State, Borders, Location } from "../Common";
import { trySetDataAndAppendChange } from "../Functions";
import { ResizeHandle } from "./ResizeHandle";

export interface CellRendererProps {
    state: State
    location: Location,
    borders: Borders,
}

export const CellRenderer: React.FunctionComponent<CellRendererProps> = (props) => {
    const state = { ...props.state };
    const location = props.location;
    const cell = location.cell;
    const isFocused = (state.focusedLocation !== undefined) && (state.focusedLocation.col.idx === props.location.col.idx && state.focusedLocation.row.idx === props.location.row.idx);
    const cellTemplate = state.cellTemplates[cell.type];
    const style: React.CSSProperties = {
        ...(cellTemplate.getCustomStyle && cellTemplate.getCustomStyle(cell.data, false, props) || {}),
        left: location.col.left,
        top: location.row.top,
        width: location.col.width,
        height: location.row.height,
        // TODO hardcoded type "header" - can we do better?
        touchAction: isFocused || props.state.cellMatrix.getCell(props.location.row.id, props.location.col.id).type === 'header' ? 'none' : 'auto' // prevent scrolling
    }
    return (
        <div className="cell" style={style}>
            {
                cellTemplate.renderContent({
                    cellData: props.state.cellTemplates[cell.type].isValid(cell.data) ? cell.data : '',
                    isInEditMode: false,
                    props: cell.props,
                    onCellDataChanged: (cellData, commit) => {
                        if (!commit) throw 'commit should be set to true.'
                        props.state.updateState(state => trySetDataAndAppendChange(state, location, { data: cellData, type: cell.type }))
                    }
                })
            }
            {location.row.idx === 0 && location.col.resizable && <ResizeHandle />}
        </div >
    )
}


