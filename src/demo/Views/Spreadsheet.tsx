import * as React from 'react'
import { ColumnProps, RowProps, CellMatrixProps, DataChange, Id, MenuOption, Range } from '../../lib/Common';
import { DynaGrid } from '../../lib/Components/DynaGrid';

const COL_SIZE = 20;
const ROW_SIZE = 50;

interface Cell {
    colId: string;
    data: any;
}
interface Row {
    rowId: string;
    cols: Cell[]
}

export class Spreadsheet extends React.Component<{}, { data: Row[], widths: number[] }> {
    constructor(props: {}) {
        super(props);

        const colIds: string[] = Array.from(Array(COL_SIZE), () => Math.random().toString(36).substr(2, 9));

        this.state = {
            widths: Array(1000).fill(120),
            data: Array(ROW_SIZE).fill(0).map((_, ri) =>
                ({
                    rowId: Math.random().toString(36).substr(2, 9),
                    cols: Array(COL_SIZE).fill(0).map((_, ci) =>
                        ({
                            data: (ri + 100) + ' - ' + (ci + 100),
                            colId: colIds[ci]
                        }))
                })
            )
        }
    }

    private generateCellMatrix(): CellMatrixProps {
        const columns: ColumnProps[] = this.state.data[0].cols.map((c, idx) => ({
            id: c.colId,
            width: this.state.widths[idx],
            onDrop: (ids) => this.reorderColumns(ids as number[], idx),
            reorderable: true,
            resizable: true,
            onResize: width => { this.state.widths[idx] = width, this.forceUpdate(); }
        }));
        const rows: RowProps[] = this.state.data.map((row, rowIdx) => ({
            id: row.rowId,
            height: 25,
            onDrop: (ids) => this.reorderRows(ids as number[], rowIdx),
            reorderable: true,
            cells: row.cols.map((data, colIdx) => (rowIdx === 0 || colIdx === 0) ? { data: data.data, type: 'header' } : (rowIdx !== 0 && colIdx === 1) ? { data: data.data, type: 'checkbox' } : { data: data.data, type: 'text' })
        }))
        return ({ frozenTopRows: 0, frozenLeftColumns: 0, frozenBottomRows: 0, frozenRightColumns: 0, rows, columns })
    }

    private calculateColumnReorder(row: Row, colIdxs: number[], direction: string, destination: number) {
        const movedColumns: Cell[] = row.cols.filter((_, idx) => colIdxs.includes(idx));
        const clearedRow: Cell[] = row.cols.filter((_, idx) => !colIdxs.includes(idx));
        if (direction === 'right') {
            destination = destination - colIdxs.length + 1
        }
        clearedRow.splice(destination, 0, ...movedColumns)
        row.cols = clearedRow
        return row
    }

    render() {
        return (<div>
            <button style={{ width: 100, height: 50 }} onClick={() => {
                const data = [...this.state.data];
                data.shift()
                this.setState({ data })
            }}>
                - rekord
            </button>
            <button style={{ width: 100, height: 50 }} onClick={() => {
                const data = [...this.state.data];
                data.splice(5, 0, { rowId: Math.random().toString(36).substr(2, 9), cols: [...data[0].cols.map(c => ({ data: c.data + c.colId, colId: c.colId }))] })
                this.setState({ data })
            }}>
                + rekord
            </button>
            <button style={{ width: 100, height: 50 }} onClick={() => {
                const data = [...this.state.data];
                data.forEach(r => r.cols.shift())
                this.setState({ data })
            }}>
                - kolumn
            </button>
            <button style={{ width: 100, height: 50 }} onClick={() => {
                const colId = Math.random().toString(36).substr(2, 9);
                const data = [...this.state.data];
                data.forEach(r => r.cols.splice(2, 0, { colId: colId, data: '+' + colId }))
                this.setState({ data })
            }}>
                + kolumn
            </button>
            <DynaGrid style={{ position: 'absolute', top: 50, bottom: 0, left: 0, right: 0, fontFamily: 'Sans-Serif' }}
                cellMatrixProps={this.generateCellMatrix()}
                onDataChanged={changes => this.handleDataChanges(changes)}
                onRowContextMenu={(selectedRowIds: Id[], menuOptions: MenuOption[]) => this.handleRowContextMenu(selectedRowIds, menuOptions)}
                onColumnContextMenu={(selectedColIds: Id[], menuOptions: MenuOption[]) => this.handleColContextMenu(selectedColIds, menuOptions)}
                onRangeContextMenu={(selectedRanges: Range[], menuOptions: MenuOption[]) => this.handleRangeContextMenu(selectedRanges, menuOptions)}
                cellTemplates={{}}
            />
        </div>
        );
    }

    private handleDataChanges(dataChanges: DataChange[]) {
        const data: Row[] = this.state.data;
        dataChanges.forEach(change => {
            const row: any = data.find(row => row.rowId === change.rowId);
            const cell: any = row ? row.cols.find((c: any) => c.colId === change.columnId) : null
            if (cell && row) {
                cell.data = change.newData as string;
                row.cols.map((c: any) => c.colId == cell.colId ? c = cell : change)
                const newData: Row[] = data.map(r => r.rowId == row.rowId ? r = row : r)
                this.setState({ data: newData })
            }
        })
    }

    private handleRangeContextMenu(selectedRanges: Range[], menuOptions: MenuOption[]): MenuOption[] {
        let selectedRowIds: Id[] = [];
        let selectedColIds: Id[] = [];
        let options = menuOptions.concat([
            {
                title: 'Delete Row',
                handler: () => {
                    this.deleteRows(selectedRowIds);
                }
            },
            {
                title: 'Delete Column',
                handler: () => {
                    this.deleteColumns(selectedColIds);
                }
            }
        ]);

        selectedRanges.forEach((range, idx) => {
            range.cols.forEach((col, colIdx) => {
                selectedColIds.push(col.id);
                range.rows.forEach((row, rowIdx) => {
                    selectedRowIds.push(row.id);
                    if (row.cells[range.cols[colIdx].idx].type === 'header' && rowIdx > 1) {
                        options = options.filter(option => option.title !== 'Delete Column');
                    }
                    if (row.cells[range.cols[colIdx].idx].type === 'header' && colIdx > 0) {
                        options = options.filter(option => option.title !== 'Delete Row');
                    }
                })
            })
        });

        // delete duplicated ids
        selectedRowIds = Array.from(new Set(selectedRowIds));
        selectedColIds = Array.from(new Set(selectedColIds));

        return options;
    }

    private handleRowContextMenu(selectedRowIds: Id[], menuOptions: MenuOption[]): MenuOption[] {
        return menuOptions.concat([
            {
                title: 'Delete Row',
                handler: () => {
                    this.deleteRows(selectedRowIds);
                }
            }
        ]);
    }

    private handleColContextMenu(selectedColIds: Id[], menuOptions: MenuOption[]): MenuOption[] {
        return menuOptions.concat([
            {
                title: 'Delete Column',
                handler: () => {
                    this.deleteColumns(selectedColIds)
                }
            }
        ]);
    }

    private deleteRows(selectedRowIds: Id[]) {
        const data = this.state.data;
        const newData = data.filter(row => !selectedRowIds.includes(row.rowId));
        this.setState({ data: newData })
    }

    private deleteColumns(selectedColIds: Id[]) {
        const data = this.state.data;
        const newData = data.map(row => ({ cols: row.cols.filter(col => !selectedColIds.includes(col.colId)), rowId: row.rowId }));
        this.setState({ data: newData })
    }

    private reorderColumns(colIdxs: number[], to: number) {
        let data = [...this.state.data];
        if (to > colIdxs[0]) {
            data = data.map(r => this.calculateColumnReorder(r, colIdxs, 'right', to));
        } else {
            data = data.map(r => this.calculateColumnReorder(r, colIdxs, 'left', to));
        }
        this.setState({ data })
    }

    private reorderRows(rowIdxs: number[], to: number) {
        const data = [...this.state.data];
        const movedRows = data.filter((_, idx) => rowIdxs.includes(idx));
        const clearedData = data.filter((_, idx) => !rowIdxs.includes(idx));
        if (to > rowIdxs[0])
            to = to - rowIdxs.length + 1
        clearedData.splice(to, 0, ...movedRows)
        this.setState({ data: clearedData })
    }
}