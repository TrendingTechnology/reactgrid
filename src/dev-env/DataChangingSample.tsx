import * as React from 'react';
import { ReactGrid, DataChange } from '..';

export default class DataChangingSample extends React.Component<{}, {}> {
    state = {
        columns: [{ id: 'player', reorderable: false, resizable: false, width: 200 }, { id: 'age', reorderable: false, resizable: false, width: 50 }, { id: 'rate', reorderable: false, resizable: false, width: 130 }, { id: 'club', reorderable: false, resizable: false, width: 200 }],
        rows: [
            {
                id: 'header',
                height: 25,
                reorderable: false,
                cells: [{ type: 'header', data: 'Player' }, { type: 'header', data: 'Age' }, { type: 'header', data: 'Rate' }, { type: 'header', data: 'Club' }]
            },
            { id: '1', height: 45, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '2', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '3', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '4', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '5', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '6', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '7', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '8', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '9', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '10', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '11', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '12', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '13', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '14', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '15', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '16', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '17', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '18', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '19', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '21', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '22', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '23', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '24', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '25', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] },
            { id: '26', height: 25, reorderable: false, cells: [{ type: 'text', data: 'Lionel Messi' }, { type: 'number', data: 32 }, { type: 'number', data: 9 }, { type: 'text', data: 'Barcelona' }] }
        ]
    };

    private prepareDataChanges = (dataChanges: DataChange[]): {} => {
        const state = { ...this.state };
        dataChanges.forEach(change => {
            state.rows.forEach(row => {
                if (row.id == change.rowId) {
                    const field = this.state.columns.findIndex(column => column.id == change.columnId);
                    if (field !== undefined) row.cells[field].data = change.newData;
                }
            });
        });
        return state;
    };

    render() {
        return <ReactGrid columns={this.state.columns} rows={this.state.rows} onDataChanged={changes => this.setState(this.prepareDataChanges(changes))} license={'non-commercial'} />;
    }
}
