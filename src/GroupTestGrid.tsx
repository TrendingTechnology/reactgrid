import React, {useState} from 'react';
import {Cell, CellChange, Column, GroupCell, Id, ReactGrid, Row, TextCell} from './lib'
import './lib/assets/core.scss';


interface GroupTestGridState {
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
        label: 'g',
        text: 'g',
        parent: 'a'
    },
];


export const GroupTestGrid: React.FunctionComponent = () => {

    const isGroupCell = (cell: Cell): boolean => !!(cell.type === 'group');

    const isCellExpanded = (cell: Cell): boolean => !!(cell as GroupCell).isExpanded;

    const getGroupCell = (row: Row): GroupCell => row.cells.find((cell: Cell) => isGroupCell(cell)) as GroupCell;

    const hasChildren = (rows: Row[], row: Row): boolean => rows.some((r: Row) => getGroupCell(r).parentId === row.rowId);

    const fx = (rows: Row[], row: Row): boolean => {
      let parentRow = getParentRow(rows, row);
      if (parentRow) {
        if (!isCellExpanded(getGroupCell(parentRow))) return false;
        return fx(rows, parentRow);
      } else {
        return true
      }
    };

    const getExpandedRows = (rows: Row[]): Row[] => {
        return rows.filter((row: Row) => {

            const areAllParentsExpanded = fx(rows, row);
            console.log('areAllParentsExpanded: ', areAllParentsExpanded);

            let parentRow = getParentRow(rows, row);
            print(row, parentRow);
            return areAllParentsExpanded === undefined ? true : areAllParentsExpanded ;
        });
    };

    const print = (row: Row, parentRow: Row | undefined): void => {
        let spaces = '';
        for (let i = 0; i < getGroupCell(row).indent!; i++) { spaces += ' '; }
        console.log(`${spaces} row: ${getGroupCell(row).rowId}, parent: ${getGroupCell(row).parentId}, isParentExpanded: ${parentRow && getGroupCell(parentRow).isExpanded}`)
    };

    const getRowById = (rows: Row[], rowId: Id): Row | undefined => rows.find((row: Row) => row.rowId === rowId);

    const getDirectChildrenRows = (rows: Row[], parentRow: Row): Row[] => rows.filter((row: Row) => !!row.cells.find((cell: Cell) => isGroupCell(cell) && (cell as GroupCell).parentId === parentRow.rowId));

    const getParentRow = (rows: Row[], row: Row): Row | undefined => rows.find((r) => getGroupCell(r).rowId === getGroupCell(row).parentId);

    // TODO level in other function
    // TODO hasChilds in other function
    const getRowChildrens = (allRows: Row[], parentRow: Row, foundRows: Row[], level: number): Row[] => {
        const childRows = getDirectChildrenRows(allRows, parentRow).map((row: Row) => {
            const cell = getGroupCell(row);
            cell.indent = level;
            cell.hasChildrens = hasChildren(allRows, row);
            return row;
        });
        const mergedResults = [ ...foundRows, ...childRows ];
        if (childRows.length === 0) return foundRows;
        ++level;
        let rows: Row[] = [];
        childRows.forEach((row: Row) => {
            rows = getRowChildrens(allRows, row, mergedResults, level);
        });
        return rows;
    };

    const createIndents = (rows: Row[]): Row[] => {
        return rows.map((row: Row) => {
            const groupCell: GroupCell = getGroupCell(row);
            if (groupCell.parentId === undefined) {
                getRowChildrens(rows, row, [], 1);
            }
            return row;
        });
    };

    const getReactgridRowsFromData = (currentRows?: Row[]): Row[] => {
        return [ ...data ].map((dataRow: any): Row => {
            let isExpanded = true;
            if (currentRows) {
                const row = getRowById(currentRows, dataRow.id);
                if (row) {
                    isExpanded = isCellExpanded(getGroupCell(row));
                } else {
                    // isExpanded = fx(currentRows, row)
                }
            }

            return {
                rowId: dataRow.id,
                cells: [
                    {
                        type: 'group',
                        text: `id: ${dataRow.id}, pId: ${dataRow.parent}`,
                        parentId: dataRow.parent,
                        rowId: dataRow.id,
                        isExpanded
                    } as GroupCell,
                    { type: 'text', text: `${dataRow.text} ` }  as TextCell
                ]
            }
        });
    };

    const [state, setState] = useState<GroupTestGridState>(() => {

        const columns: Column[] = [
            { columnId: 0, width: 200, resizable: true },
            { columnId: 1 },
        ];

        let rows: Row[] = getReactgridRowsFromData();

        rows = createIndents(rows);
        rows = getExpandedRows(rows);

        return { rows, columns }
    });

    const handleColumnResize = (ci: Id, width: number) => {
        let newState = { ...state };
        const columnIndex = newState.columns.findIndex(el => el.columnId === ci);
        const resizedColumn: Column = newState.columns[columnIndex];
        newState.columns[columnIndex] = { ...resizedColumn, width };
        setState(newState);
    };

    const handleChanges = (changes: CellChange[]) => {
        let newState = {
          ...state,
          rows: getReactgridRowsFromData(state.rows)
        };
        changes.forEach((change: CellChange) => {
            const changeRowIdx = newState.rows.findIndex(el => el.rowId === change.rowId);
            const changeColumnIdx = newState.columns.findIndex(el => el.columnId === change.columnId);
            newState.rows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
        });

        let rows = createIndents(newState.rows);
        rows = getExpandedRows(rows);

        setState((prevState) => {
            return { ...prevState, rows }
        });
        return true;
    };

    return <ReactGrid
        rows={state.rows}
        columns={state.columns}
        license={'non-commercial'}
        onCellsChanged={handleChanges}
        onColumnResized={handleColumnResize}
        frozenLeftColumns={1}
        enableRowSelection
        enableColumnSelection
    />
};