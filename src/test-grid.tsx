import React from 'react';
import { ReactGrid } from './lib/Components/ReactGrid'
import { ColumnProps, RowProps, DataChange, Id } from './lib/Common/PublicModel'
import './lib/assets/core.scss';

const columns_count = 10;
const columns_width = 100;
const rows_height = 25;
const rows_count = 16;

interface Column {
    id: string;
    width: number;
}

interface Data {
    [key: string]: string
}

interface Row {
    id: string;
    height: number;
    data: Data;
}

interface DevGridState {
    columns: Column[]
    rows: Row[]
}

interface DevGridProps {
    columns: number;
    rows: number;
    rowsHeight?: number;
    columnsWidth?: number;
}

export default class DevGrid extends React.Component<DevGridProps, DevGridState> {
    constructor(props: DevGridProps) {
        super(props)
        const columns = new Array(props.columns).fill(props.columnsWidth || 100).map((width, idx) => ({ id: this.getRandomId(), width, idx }));
        this.state = {
            columns,
            rows: new Array(props.rows).fill(props.rowsHeight || 25).map((height, idx) => columns.reduce((row: Row, column: Column) => { row.data[column.id] = (idx + ' - ' + columns.findIndex(c => c.id == column.id)); return row }, { id: this.getRandomId(), height, data: {} })),
        }
    }

    private getRandomId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private getMatrix() {
        const columns: ColumnProps[] = [...this.state.columns].map((c, cIdx) => ({
            id: c.id,
            width: c.width,
            reorderable: true,
            resizable: true,
            onDrop: idxs => this.setState({ columns: this.getReorderedColumns(idxs as string[], cIdx) }),
            onResize: width => {
                const state = { ...this.state };
                state.columns[cIdx].width = width;
                this.setState(state);
            }
        }))
        const rows: RowProps[] = [...this.state.rows].map((r, rIdx) => ({
            id: r.id,
            height: r.height,
            reorderable: true,
            cells: [...this.state.columns].map(c => ({ data: r.data[c.id], type: 'text' })),
            onDrop: idxs => this.setState({ rows: this.getReorderedRows(idxs as string[], rIdx) }),

        }))
        return { rows, columns }
    }

    private prepareDataChanges(dataChanges: DataChange[]) {
        const state = { ...this.state }
        dataChanges.forEach(change => {
            state.rows.map(r => r.id == change.rowId ? r.data[change.columnId] = change.newData : r)
        })
        return state
    }

    private getReorderedColumns(colIds: Id[], to: number) {
        const movedColumns: Column[] = [...this.state.columns].filter(c => colIds.includes(c.id));
        const clearedColumns: Column[] = [...this.state.columns].filter(c => !colIds.includes(c.id));
        if (to > [...this.state.columns].findIndex(c => c.id == colIds[0]))
            to -= colIds.length - 1
        clearedColumns.splice(to, 0, ...movedColumns)
        return clearedColumns
    }

    private getReorderedRows(rowIds: Id[], to: number) {
        const movedRows = [...this.state.rows].filter(r => rowIds.includes(r.id));
        const clearedRows = [...this.state.rows].filter(r => !rowIds.includes(r.id));
        if (to > [...this.state.rows].findIndex(r => r.id == rowIds[0]))
            to -= rowIds.length - 1
        clearedRows.splice(to, 0, ...movedRows)
        return clearedRows
    }

    render() {
        return <ReactGrid
            cellMatrixProps={this.getMatrix()}
            onDataChanged={(changes: DataChange[]) => this.setState(this.prepareDataChanges(changes))}
            license={'non-commercial'}
        />
    }

}