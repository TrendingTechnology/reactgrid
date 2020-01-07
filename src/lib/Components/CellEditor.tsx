import * as React from 'react';
import { State, Location } from '../Model';
import { tryAppendChange } from '../Functions';

interface CellEditorProps {
    state: State;
}

export const CellEditor: React.FunctionComponent<CellEditorProps> = props => {

    const location = props.state.focusedLocation!;
    const [position, setPosition] = React.useState(calculatedEditorPosition(location, props.state));
    React.useEffect(() => setPosition(calculatedEditorPosition(location, props.state)), []);
    const cellTemplate = props.state.cellTemplates[props.state.currentlyEditedCell!.type];
    // TODO custom style
    //const customStyle = cellTemplate.getCustomStyle ? cellTemplate.getCustomStyle(cell.data, true) : {};
    return (
        <div
            className={`rg-celleditor rg-${props.state.currentlyEditedCell!.type}-celleditor`}
            style={{
                top: position.top + (props.state.disableFloatingCellEditor ? 0 : -1),
                left: position.left + (props.state.disableFloatingCellEditor ? 0 : -1),
                height: location.row.height + 1,
                width: location.column.width + 1,
                position: props.state.disableFloatingCellEditor ? 'absolute' : 'fixed',
                //...customStyle,
            }}
        >
            {cellTemplate.render(props.state.currentlyEditedCell!, true, (cell, commit) => {
                props.state.currentlyEditedCell = commit ? undefined : cell;
                if (commit) props.state.update(state => tryAppendChange(state, location, cell));
            })}
        </div>
    );
};

const calculatedXAxisOffset = (location: Location, state: State) => {
    const offsetLeftDistance = state.disableFloatingCellEditor ? state.viewportElement.scrollLeft - 1 : state.viewportElement.offsetLeft;
    if (state.cellMatrix.frozenRightRange.first.column && location.column.idx >= state.cellMatrix.frozenRightRange.first.column.idx) {
        return Math.min(state.cellMatrix.width, state.viewportElement.clientWidth) - state.cellMatrix.frozenRightRange.width + offsetLeftDistance;
    } else if (location.column.idx > (state.cellMatrix.frozenLeftRange.last.column ? state.cellMatrix.frozenLeftRange.last.column.idx : state.cellMatrix.first.column.idx) || location.column.idx == state.cellMatrix.last.column.idx) {
        return state.cellMatrix.frozenLeftRange.width - state.viewportElement.scrollLeft + offsetLeftDistance;
    }
    return offsetLeftDistance;
};

const calculatedYAxisOffset = (location: Location, state: State) => {
    const isViewportScrollable = state.viewportElement.clientHeight !== state.cellMatrix.height;
    const topOffsetDistance = state.disableFloatingCellEditor ? state.viewportElement.scrollTop - 1 : state.viewportElement.getBoundingClientRect().top;
    if (state.cellMatrix.frozenBottomRange.first.row && location.row.idx >= state.cellMatrix.frozenBottomRange.first.row.idx) {
        const res = topOffsetDistance - state.cellMatrix.frozenBottomRange.height + state.viewportElement.clientHeight;
        return res;
    } else if (location.row.idx > (state.cellMatrix.frozenTopRange.last.row ? state.cellMatrix.frozenTopRange.last.row.idx : state.cellMatrix.first.row.idx) || location.row.idx == state.cellMatrix.last.row.idx) {
        return topOffsetDistance + state.cellMatrix.frozenTopRange.height - state.viewportElement.scrollTop;
    }
    return topOffsetDistance;
};

const calculatedEditorPosition = (location: Location, state: State) => {
    return {
        left: location.column.left + calculatedXAxisOffset(location, state),
        top: location.row.top + calculatedYAxisOffset(location, state)
    };
};
