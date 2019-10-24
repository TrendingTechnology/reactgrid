## ReactGrid
```
npm i @silevis/reactgrid
```

Before run you need to have installed:
- "react": "^16.8.6"
- "react-dom": "^16.8.6"

## Getting Started
```
import React from 'react';
import { ReactGrid, ColumnProps, RowProps, DataChange, Id } from '@silevis/reactgrid'
import '@silevis/reactgrid/dist/lib/assets/core.css';

interface Row {
    id: string;
    height: number;
    data: Data;
}
interface Column {
    id: string;
    width: number;
}

interface Data {
    [key: string]: string;
}

interface AppState {
    columns: Column[];
    rows: Row[];
}

interface AppProps {
    columns: number;
    rows: number;
    rowsHeight?: number;
    columnsWidth?: number;
}

export default class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props)
        const columns =
            new Array(props.columns)
                .fill(props.columnsWidth || 100)
                .map((width, idx) => ({ id: this.getRandomId(), width, idx }));

        this.state = {
            columns,
            rows:
                new Array(props.rows)
                    .fill(props.rowsHeight || 25)
                    .map((height, idx) =>
                        columns.reduce((row: Row, column: Column) => {
                            row.data[column.id] = (idx + ' - ' + columns.findIndex(c => c.id == column.id)); return row
                        }, { id: this.getRandomId(), height, data: {} })),
        }
    }

    private getRandomId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private getMatrix() {
        const columns: ColumnProps[] = [...this.state.columns].map((column, cIdx) => ({
            id: column.id,
            width: column.width,
            reorderable: true,
            resizable: true,
            onResize: width => {
                const state = { ...this.state };
                state.columns[cIdx].width = width;
                this.setState(state);
            }
        }));
        const rows: RowProps[] = [...this.state.rows].map((row) => ({
            id: row.id,
            height: row.height,
            reorderable: true,
            cells: [...this.state.columns].map(c => ({ data: row.data[c.id], type: 'text' })),

        }));
        return { rows, columns }
    }

    private prepareDataChanges(dataChanges: DataChange[]) {
        const state = { ...this.state }
        dataChanges.forEach(change => {
            state.rows.map(row => row.id == change.rowId ? row.data[change.columnId] = change.newData : row)
        })
        return state;
    }

    render() {
        return (
            <ReactGrid
                cellMatrixProps={this.getMatrix()}
                onDataChanged={(changes: DataChange[]) => this.setState(this.prepareDataChanges(changes))}
                license={'non-commercial'}
            />
        );
    }
}
```
You must remember to import styles to display grid correctly. You can import core.css like in example above or core.scss which require installed node-sass.
### Internet Explorer
Additional you have to install https://www.npmjs.com/package/core-js and place it like below:
```
import React from 'react';
import "core-js/stable";
import { ReactGrid } from '@silevis/reactgrid'
```

## Features
## Documentation
## License