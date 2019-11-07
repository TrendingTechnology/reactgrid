import * as React from 'react';
import { Range, Borders, State } from '../Model';
import { CellFocus } from './CellFocus';
import { FillHandle } from './FillHandle';
import { RowRenderer } from './RowRenderer';
import { PartialArea } from './PartialArea';

export interface PaneProps {
    id: string
    class?: string,
    state: State,
    style: React.CSSProperties,
    range: Range,
    borders: Borders,
    className?: string
}

interface RowsProps {
    state: State;
    range: Range;
    borders: Borders;
}

class GridContent extends React.Component<RowsProps> {
    shouldComponentUpdate(nextProps: RowsProps) {
        if (this.props.state.focusedLocation && nextProps.state.focusedLocation) {
            if (this.props.state.focusedLocation.column.columnId !== nextProps.state.focusedLocation.column.columnId || this.props.state.focusedLocation.row.rowId !== nextProps.state.focusedLocation.row.rowId)
                // && // needed when select range by touch
                //nextProps.state.lastKeyCode !== keyCodes.ENTER && nextProps.state.lastKeyCode !== keyCodes.TAB) // improved performance during moving focus inside range
                return true;
        } else {
            return true; // needed when select range by touch after first focus
        }
        return this.props.state.visibleRange != nextProps.state.visibleRange || this.props.state.cellMatrix.props != nextProps.state.cellMatrix.props;
    }

    render() {
        return (
            <>
                {this.props.range.rows.map((row) => <RowRenderer key={row.rowId} state={this.props.state} row={row} columns={this.props.range.columns} forceUpdate={true} borders={{ ...this.props.borders, top: this.props.borders.top && row.top === 0, bottom: this.props.borders.bottom && row.idx === this.props.range.last.row.idx }} />)}
                {this.props.range.rows.map((row) => <div key={row.rowId} className="rg-separator-line rg-separator-line-row" style={{ top: row.top, height: row.height, }} />)}
                {this.props.range.columns.map((col) => <div key={col.columnId} className="rg-separator-line rg-separator-line-col" style={{ left: col.left, width: col.width }} />)}
            </>
        );
    }
}

function renderCustomFocuses(props: PaneProps) {
    const customFocuses = props.state.customFocuses.filter((value: any) => Object.keys(value).length !== 0);
    return customFocuses.map((focus: any, id: number) => {
        const location = props.state.cellMatrix.getLocationById(focus.rowId, focus.colId);
        return location && props.range.contains(location) && <CellFocus key={id} location={location} color={focus.color} />;
    });
}

export const Pane: React.FunctionComponent<PaneProps> = props => {
    return (
        <div key={props.id} className={`rg-pane ${props.class}`} style={{ width: props.range.width, ...props.style }}>
            <GridContent state={props.state} range={props.range} borders={props.borders} />
            {renderSelectedRanges(props.state, props.range)}
            {props.state.currentBehavior.renderPanePart(props.state, props.range)}
            {props.state.customFocuses && renderCustomFocuses(props)}
            {props.state.focusedLocation && props.range.contains(props.state.focusedLocation) && <CellFocus location={props.state.focusedLocation} />}
            {props.state.selectedRanges[props.state.activeSelectedRangeIdx] && props.range.contains(props.state.selectedRanges[props.state.activeSelectedRangeIdx].last) && !props.state.disableFillHandle && !props.state.currentlyEditedCell && <FillHandle state={props.state} location={props.state.selectedRanges[props.state.activeSelectedRangeIdx].last} />}
        </div>
    );
};

function renderSelectedRanges(state: State, pane: Range) {
    return state.selectedRanges.map((range, i) => !(state.focusedLocation && range.contains(state.focusedLocation) && range.columns.length === 1 && range.rows.length === 1) && pane.intersectsWith(range) && <PartialArea key={i} pane={pane} range={range} class="rg-partial-area-selected-range" style={{}} />);
}
