import * as React from 'react';
import { ReactGrid, CellChange } from '../lib';

export default class DataChangingSample extends React.Component<{}, {}> {
    state = {
        columns: [{ columnId: 'player', width: 200 }, { columnId: 'age', width: 50 }, { columnId: 'rate', width: 130 }, { columnId: 'club', width: 200 }],
        rows: [
            {
                rowId: 'header',
                cells: [{ type: 'header', data: 'Player' }, { type: 'header', data: 'Age' }, { type: 'header', data: 'Rate' }, { type: 'header', data: 'Club' }]
            },
            { rowId: '1', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '2', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '3', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '4', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '5', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '6', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '7', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '8', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '9', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '10', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '11', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '12', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '13', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '14', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '15', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '16', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '17', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '18', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '19', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '21', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '22', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '23', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '24', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '25', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] },
            { rowId: '26', cells: [{ type: 'text', text: 'Lionel Messi' }, { type: 'number', value: 32 }, { type: 'number', value: 9 }, { type: 'text', text: 'Barcelona' }] }
        ]
    };

    private prepareDataChanges = (dataChanges: CellChange[]): {} => {
        const state = { ...this.state };
        dataChanges.forEach(change => {
            state.rows.forEach(row => {
                if (row.rowId == change.rowId) {
                    const field = this.state.columns.findIndex(column => column.columnId == change.columnId);
                    //if (field !== undefined) row.cells[field] = change.newCell;
                }
            });
        });
        return state;
    };

    render() {
        return <ReactGrid columns={this.state.columns} rows={this.state.rows} onCellsChanged={changes => this.setState(this.prepareDataChanges(changes))} license={'non-commercial'} />;
    }
}
