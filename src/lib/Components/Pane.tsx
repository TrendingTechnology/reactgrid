import * as React from "react";
import { GridContext, Range, Borders, Row, Column, zIndex } from "../Common";
import { Cell } from "./Cell";
import { renderMultiplePartialAreasForPane } from "../Functions/renderPartialAreaForPane";
import { CellFocus } from "./CellFocus";
import { FillHandle } from "./FillHandle";

export interface PaneProps {
    id: string
    gridContext: GridContext,
    style: React.CSSProperties,
    range: Range,
    borders: Borders,
}

export const Pane: React.FunctionComponent<PaneProps> = (props) =>
    <div key={props.id} className="dg-pane" style={{ position: 'relative', width: props.range.width, height: '100%', ...props.style }}>
        {props.range.rows.map((row) => <RowRenderer key={row.idx} gridContext={props.gridContext} row={row} columns={props.range.cols} forceUpdate={false} borders={{ ...props.borders, top: props.borders.top && row.top === 0, bottom: props.borders.bottom && row.idx === props.range.last.row.idx }} />)}
        {renderPartial(props.gridContext, props.range)}
        {props.gridContext.currentBehavior.renderPanePart(props.range)}
        {props.gridContext.state.focusedLocation && props.range.contains(props.gridContext.state.focusedLocation) &&
            <CellFocus location={props.gridContext.state.focusedLocation} />}
        {props.gridContext.state.selectedRanges[props.gridContext.state.focusedSelectedRangeIdx] && props.range.contains(props.gridContext.state.selectedRanges[props.gridContext.state.focusedSelectedRangeIdx].last) &&
            <FillHandle gridContext={props.gridContext} location={props.gridContext.state.selectedRanges[props.gridContext.state.focusedSelectedRangeIdx].last} />}
    </div>

export function renderPartial(gridContext: GridContext, range: Range) {
    return renderMultiplePartialAreasForPane(gridContext, gridContext.state.selectedRanges, range, {
        border: '1px solid rgb(53, 121, 248)',
        backgroundColor: 'rgba(53, 121, 248, 0.1)',
    });
}

export interface RowRendererProps {
    gridContext: GridContext,
    row: Row,
    columns: Column[],
    forceUpdate: boolean,
    borders: Borders
}

export class RowRenderer extends React.Component<RowRendererProps, {}> {
    shouldComponentUpdate(nextProps: RowRendererProps) {
        return nextProps.forceUpdate || nextProps.columns[0].idx !== this.props.columns[0].idx || nextProps.columns.length !== this.props.columns.length;
    }

    render() {
        const lastColIdx = this.props.columns[this.props.columns.length - 1].idx;
        return this.props.columns.map((col) => <Cell key={this.props.row.idx + '-' + col.idx} borders={{ ...this.props.borders, left: this.props.borders.left && col.left === 0, right: this.props.borders.right && col.idx === lastColIdx }} gridContext={this.props.gridContext} location={{ col, row: this.props.row }} />)
    }
}


