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
                top: position.top - 1,
                left: position.left - 1,
                height: location.row.height + 1,
                width: location.column.width + 1,
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
    if (state.cellMatrix.frozenRightRange.first.column && location.column.idx >= state.cellMatrix.frozenRightRange.first.column.idx) {
        return Math.min(state.cellMatrix.width, state.viewportElement.clientWidth) - state.cellMatrix.frozenRightRange.width;
    } else if (location.column.idx > (state.cellMatrix.frozenLeftRange.last.column ? state.cellMatrix.frozenLeftRange.last.column.idx : state.cellMatrix.first.column.idx) || location.column.idx == state.cellMatrix.last.column.idx) {
        return state.cellMatrix.frozenLeftRange.width - state.viewportElement.scrollLeft;
    }
    return 0;
};

const calculatedYAxisOffset = (location: Location, state: State) => {
    if (state.cellMatrix.frozenBottomRange.first.row && location.row.idx >= state.cellMatrix.frozenBottomRange.first.row.idx) {
        return Math.min(state.cellMatrix.height, state.viewportElement.clientHeight) - state.cellMatrix.frozenBottomRange.height;
    } else if (location.row.idx > (state.cellMatrix.frozenTopRange.last.row ? state.cellMatrix.frozenTopRange.last.row.idx : state.cellMatrix.first.row.idx) || location.row.idx == state.cellMatrix.last.row.idx) {
        return state.cellMatrix.frozenTopRange.height - state.viewportElement.scrollTop;
    }
    return 0;
};

const calculatedEditorPosition = (location: Location, state: State) => {
    return {
        left: location.column.left + calculatedXAxisOffset(location, state),
        top: location.row.top + calculatedYAxisOffset(location, state)
    };
};
