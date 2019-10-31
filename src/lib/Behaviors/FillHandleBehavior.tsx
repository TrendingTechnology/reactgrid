import * as React from 'react';
import { State, Range, PointerEvent, CellMatrix, Behavior, GridRow, GridColumn, Location, Cell } from '../Model';
import { PartialArea } from '../Components/PartialArea';
import { getActiveSelectedRange } from '../Functions/getActiveSelectedRange';
import { tryAppendChange } from '../Functions';

type Direction = '' | 'left' | 'right' | 'up' | 'down';

export class FillHandleBehavior extends Behavior {
    private fillDirection: Direction = '';
    private fillRange?: Range;

    handlePointerEnter(event: PointerEvent, location: Location, state: State): State {
        const selectedRange = getActiveSelectedRange(state);
        this.fillDirection = this.getFillDirection(selectedRange, location);
        this.fillRange = this.getFillRange(state.cellMatrix, selectedRange, location, this.fillDirection);
        return { ...state };
    }

    private getFillDirection(selectedRange: Range, pointerLocation: Location) {
        // active selection
        const differences: { direction: Direction; value: number }[] = [];
        differences.push({ direction: '', value: 0 });
        differences.push({
            direction: 'up',
            value: pointerLocation.row.idx < selectedRange.first.row.idx ? selectedRange.first.row.idx - pointerLocation.row.idx : 0
        });
        differences.push({
            direction: 'down',
            value: pointerLocation.row.idx > selectedRange.last.row.idx ? pointerLocation.row.idx - selectedRange.last.row.idx : 0
        });
        differences.push({
            direction: 'left',
            value: pointerLocation.column.idx < selectedRange.first.column.idx ? selectedRange.first.column.idx - pointerLocation.column.idx : 0
        });
        differences.push({
            direction: 'right',
            value: pointerLocation.column.idx > selectedRange.last.column.idx ? pointerLocation.column.idx - selectedRange.last.column.idx : 0
        });
        return differences.reduce((prev, current) => (prev.value >= current.value ? prev : current)).direction;
    }

    private getFillRange(cellMatrix: CellMatrix, selectedRange: Range, location: Location, fillDirection: Direction) {
        switch (fillDirection) {
            case 'right':
                return cellMatrix.getRange(cellMatrix.getLocation(selectedRange.first.row.idx, cellMatrix.last.column.idx < selectedRange.last.column.idx + 1 ? cellMatrix.last.column.idx : selectedRange.last.column.idx + 1), new Location(selectedRange.last.row, location.column));
            case 'left':
                return cellMatrix.getRange(cellMatrix.getLocation(selectedRange.first.row.idx, location.column.idx), cellMatrix.getLocation(selectedRange.last.row.idx, cellMatrix.first.column.idx > selectedRange.first.column.idx - 1 ? cellMatrix.first.column.idx : selectedRange.first.column.idx - 1));
            case 'up':
                return cellMatrix.getRange(cellMatrix.getLocation(location.row.idx, selectedRange.first.column.idx), cellMatrix.getLocation(cellMatrix.first.row.idx > selectedRange.first.row.idx - 1 ? cellMatrix.first.row.idx : selectedRange.first.row.idx - 1, selectedRange.last.column.idx));
            case 'down':
                return cellMatrix.getRange(cellMatrix.getLocation(cellMatrix.last.row.idx < selectedRange.last.row.idx + 1 ? cellMatrix.last.row.idx : selectedRange.last.row.idx + 1, selectedRange.first.column.idx), new Location(location.row, selectedRange.last.column));
        }
        return undefined;
    }

    handlePointerUp(event: PointerEvent, location: Location, state: State): State {
        const activeSelectedRange = getActiveSelectedRange(state);
        const cellMatrix = state.cellMatrix;
        let values: any[];
        if (!activeSelectedRange || this.fillRange === undefined) {
            //state.commitChanges();
            return state;
        }

        this.fillRange = state.cellMatrix.validateRange(this.fillRange);

        switch (this.fillDirection) {
            case 'right':
                values = activeSelectedRange.rows.map((row: GridRow) => new Location(row, state.cellMatrix.cols[activeSelectedRange.last.column.idx]).cell);
                state = this.iterateFillRangeRows(state, values);
                state = {
                    ...state,
                    selectedRanges: [cellMatrix.getRange(activeSelectedRange.first, new Location(activeSelectedRange.last.row, location.column))],
                    selectedIds: [...activeSelectedRange.cols.map(col => col.columnId), ...this.fillRange.cols.map(col => col.columnId)]
                };
                break;
            case 'left':
                values = activeSelectedRange.rows.map((row: GridRow) => new Location(row, state.cellMatrix.cols[activeSelectedRange.last.column.idx]).cell);
                state = this.iterateFillRangeRows(state, values);
                state = {
                    ...state,
                    selectedRanges: [cellMatrix.getRange(activeSelectedRange.last, new Location(activeSelectedRange.first.row, location.column))],
                    selectedIds: [...activeSelectedRange.cols.map(col => col.columnId), ...this.fillRange.cols.map(col => col.columnId)]
                };
                break;
            case 'up':
                values = activeSelectedRange.cols.map((col: GridColumn) => new Location(state.cellMatrix.rows[activeSelectedRange.last.row.idx], col).cell);
                state = this.iterateFillRangeCols(state, values);
                state = {
                    ...state,
                    selectedRanges: [cellMatrix.getRange(activeSelectedRange.last, new Location(location.row, activeSelectedRange.first.column))],
                    selectedIds: [...activeSelectedRange.rows.map(row => row.rowId), ...this.fillRange.rows.map(row => row.rowId)]
                };
                break;
            case 'down':
                values = activeSelectedRange.cols.map((col: GridColumn) => new Location(state.cellMatrix.rows[activeSelectedRange.last.row.idx], col).cell);
                state = this.iterateFillRangeCols(state, values);
                state = {
                    ...state,
                    selectedRanges: [cellMatrix.getRange(activeSelectedRange.first, new Location(location.row, activeSelectedRange.last.column))],
                    selectedIds: [...activeSelectedRange.rows.map(row => row.rowId), ...this.fillRange.rows.map(row => row.rowId)]
                };
                break;
        }
        return state;
    }

    private iterateFillRangeRows(state: State, values: Cell[]): State {
        this.fillRange &&
            this.fillRange.rows.forEach((row: GridRow, i: number) =>
                this.fillRange!.cols.forEach((col: GridColumn) => {
                    state = tryAppendChange(state, new Location(row, col), values[i]);
                })
            );
        return state;
    }

    private iterateFillRangeCols(state: State, values: Cell[]): State {
        this.fillRange &&
            this.fillRange.rows.forEach((row: GridRow) =>
                this.fillRange!.cols.forEach((col: GridColumn, i: number) => {
                    state = tryAppendChange(state, new Location(row, col), values[i]);
                })
            );
        return state;
    }

    renderPanePart(state: State, pane: Range): React.ReactNode {
        return this.fillDirection && this.fillRange && pane.intersectsWith(this.fillRange) &&
            <PartialArea range={state.cellMatrix.validateRange(this.fillRange)} class="rg-partial-area-part" pane={pane} style={{
                backgroundColor: '',
                borderTop: this.fillDirection === 'down' ? '0px solid transparent' : '',
                borderBottom: this.fillDirection === 'up' ? '0px solid transparent' : '',
                borderLeft: this.fillDirection === 'right' ? '0px solid transparent' : '',
                borderRight: this.fillDirection === 'left' ? '0px solid transparent' : ''
            }} />
    }
}
