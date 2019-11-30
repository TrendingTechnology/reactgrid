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

    const isGroupCell = (cell: Cell): boolean => !!(cell.type === 'group');

    const isCellExpanded = (cell: Cell): boolean => !!(cell as GroupCell).isExpanded;

    const getGroupCell = (row: Row): GroupCell => row.cells.find((cell: Cell) => isGroupCell(cell)) as GroupCell;

    const hasChildren = (rows: Row[], row: Row): boolean => rows.some((r: Row) => getGroupCell(r).parentId === row.rowId);

    const isRowFullyExpanded = (rows: Row[], row: Row): boolean => {
      const parentRow = getParentRow(rows, row);
      if (parentRow) {
        if (!isCellExpanded(getGroupCell(parentRow))) return false;
        return isRowFullyExpanded(rows, parentRow);
      }
      return true
    };

    const getExpandedRows = (rows: Row[]): Row[] => {
        return rows.filter((row: Row) => {
            const areAllParentsExpanded = isRowFullyExpanded(rows, row);
            return areAllParentsExpanded === undefined ? true : areAllParentsExpanded;
        });
    };

    const getDirectChildrenRows = (rows: Row[], parentRow: Row): Row[] => rows.filter((row: Row) => !!row.cells.find((cell: Cell) => isGroupCell(cell) && (cell as GroupCell).parentId === parentRow.rowId));

    const getParentRow = (rows: Row[], row: Row): Row | undefined => rows.find((r) => r.rowId === getGroupCell(row).parentId);

    // TODO level in other function
    // TODO hasChilds in other function
    const getRowChildrens = (allRows: Row[], parentRow: Row, foundRows: Row[], indent: number): Row[] => {
        const childRows = getDirectChildrenRows(allRows, parentRow).map((row: Row) => {
            const groupCell = getGroupCell(row);
            groupCell.indent = indent;
            groupCell.hasChildrens = hasChildren(allRows, row);
            return row;
        });
        const mergedResults = [ ...foundRows, ...childRows ];
        if (childRows.length === 0) return foundRows;
        ++indent;
        let rows: Row[] = [];
        childRows.forEach((row: Row) => {
            rows = getRowChildrens(allRows, row, mergedResults, indent);
        });
        return rows;
    };

    const createIndents = (rows: Row[]): Row[] => {
        return rows.map((row: Row) => {
            const groupCell: GroupCell = getGroupCell(row);
            groupCell.hasChildrens = hasChildren(rows, row);
            if (groupCell.parentId === undefined) {
                getRowChildrens(rows, row, [], 1);
            }
            return row;
        });
    };

    const getReactgridRowsFromData = (): Row[] => {
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
                    { type: 'text', text: `${dataRow.text} ` } as TextCell,
                ]
            }
        });
    };

    const [state, setState] = useState<GroupTestGridStateData>(() => {
        const columns: Column[] = [
            { columnId: 0, width: 200, resizable: true },
            { columnId: 1 },
        ];
        let rows: Row[] = getReactgridRowsFromData();
        rows = createIndents(rows);
        rows = getExpandedRows(rows);
        return { columns, rows }
    });
    const [rowsToRender, setRowsToRender] = useState<Row[]>([...state.rows]);

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