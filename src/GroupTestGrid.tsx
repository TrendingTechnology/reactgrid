import React, {useState} from 'react';
import {Cell, CellChange, Column, GroupCell, Id, ReactGrid, Row, TextCell} from './lib'
import './lib/assets/core.scss';


interface GroupTestGridStateData {
    columns:    Column[]
    rows:       Row[]
}

const data: any[] = [
    {
        id: 'a',
        label: 'a',
        text: 'a',
    },
    {
        id: 'b',
        label: 'b',
        text: 'b',
        parent: 'a'
    },
    {
        id: 'c',
        label: 'c',
        text: 'c',
        parent: 'b'
    },
    {
        id: 'd',
        label: 'd',
        text: 'd',
        parent: 'a'
    },
    {
        id: 'e',
        label: 'e',
        text: 'e',
        parent: 'd'
    },
    {
        id: 'f',
        label: 'f',
        text: 'f',
        parent: 'd'
    },
    {
        id: 'g',
        label: 'g',
        text: 'g',
        parent: 'f'
    },
    {
        id: 'h',
        label: 'h',
        text: 'h',
        parent: 'a'
    },
    {
        id: 'i',
        label: 'i',
        text: 'i',
    },
];


export const GroupTestGrid: React.FunctionComponent = () => {

    const getGroupCell = (row: Row): GroupCell => row.cells.find((cell: Cell) => cell.type === 'group') as GroupCell;

    const hasChildren = (rows: Row[], row: Row): boolean => rows.some((r: Row) => getGroupCell(r).parentId === row.rowId);

    const isRowFullyExpanded = (rows: Row[], row: Row): boolean => {
      const parentRow = getParentRow(rows, row);
      if (parentRow) {
        if (!getGroupCell(parentRow).isExpanded) return false;
        return isRowFullyExpanded(rows, parentRow);
      }
      return true
    };

    const getExpandedRows = (rows: Row[]): Row[] => {
        return rows.filter((row: Row) => {
            const areAllParentsExpanded = isRowFullyExpanded(rows, row);
            return areAllParentsExpanded !== undefined ? areAllParentsExpanded : true;
        });
    };

    const getDirectChildrenRows = (rows: Row[], parentRow: Row): Row[] => rows.filter((row: Row) => !!row.cells.find((cell: Cell) => cell.type === 'group' && (cell as GroupCell).parentId === parentRow.rowId));

    const getParentRow = (rows: Row[], row: Row): Row | undefined => rows.find((r: Row) => r.rowId === getGroupCell(row).parentId);

    const assignIndentAndHasChildrens = (allRows: Row[], parentRow: Row, indent: number) => {
        ++indent;
        getDirectChildrenRows(allRows, parentRow).forEach((row: Row) => {
            const groupCell = getGroupCell(row);
            groupCell.indent = indent;
            const hasRowChildrens = hasChildren(allRows, row);
            groupCell.hasChildrens = hasRowChildrens;
            if (hasRowChildrens) assignIndentAndHasChildrens(allRows, row, indent);
        });
        console.log('a')
    };

    const createIndents = (rows: Row[]): Row[] => {
        return rows.map((row: Row) => {
            const groupCell: GroupCell = getGroupCell(row);
            if (groupCell.parentId === undefined) {
                const hasRowChildrens = hasChildren(rows, row);
                groupCell.hasChildrens = hasRowChildrens;
                if (hasRowChildrens) assignIndentAndHasChildrens(rows, row, 0);
            }
            return row;
        });
    };

    const getRowsFromData = (): Row[] => {
        return [ ...data ].map((dataRow: any): Row => {
            return {
                rowId: dataRow.id,
                cells: [
                    {
                        type: 'group',
                        text: `id: ${dataRow.id}, pId: ${dataRow.parent}`,
                        parentId: dataRow.parent,
                        isExpanded: true,
                    } as GroupCell,
                    { type: 'text', text: `${dataRow.text}` } as TextCell,
                ]
            }
        });
    };

    const [state, setState] = useState<GroupTestGridStateData>(() => {
        const columns: Column[] = [
            { columnId: 0, width: 200, resizable: true },
            { columnId: 1 },
        ];
        let rows: Row[] = getRowsFromData();
        rows = createIndents(rows);
        rows = getExpandedRows(rows);
        return { columns, rows }
    });
    const [rowsToRender, setRowsToRender] = useState<Row[]>([ ...state.rows ]);

    const handleColumnResize = (ci: Id, width: number) => {
        let newState = { ...state };
        const columnIndex = newState.columns.findIndex(el => el.columnId === ci);
        const resizedColumn: Column = newState.columns[columnIndex];
        newState.columns[columnIndex] = { ...resizedColumn, width };
        setState(newState);
    };

    const handleChanges = (changes: CellChange[]) => {
        const newState = { ...state };
        changes.forEach((change: CellChange) => {
            const changeRowIdx = newState.rows.findIndex(el => el.rowId === change.rowId);
            const changeColumnIdx = newState.columns.findIndex(el => el.columnId === change.columnId);
            newState.rows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
        });

        setState({ ...state, rows: createIndents(newState.rows) });
        setRowsToRender(getExpandedRows(newState.rows));
        return true;
    };

    return <ReactGrid
        rows={rowsToRender}
        columns={state.columns}
        license={'non-commercial'}
        onCellsChanged={handleChanges}
        onColumnResized={handleColumnResize}
        frozenLeftColumns={1}
        enableRowSelection
        enableColumnSelection
    />
};