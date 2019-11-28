import React, { useState } from 'react';
import { ReactGrid, Column, Row, CellChange, Id } from './reactgrid'
import './lib/assets/core.scss';
import { NumberCell } from './lib/CellTemplates/NumberCellTemplate';
import { GroupCell, Cell } from './lib';

const columnCount = 10;
const rowCount = 60;

interface GroupTestGridState {
    columns:    Column[]
    rows:       Row[]
}

const emailValidator = (email: string): boolean => {
    const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email_regex.test(email.replace(/\s+/g, '')))
        return true;
    return false;
}

export const GroupTestGrid: React.FunctionComponent = () => {

    const myNumberFormat = new Intl.NumberFormat('pl', { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'PLN' });
    const myDateFormat = new Intl.DateTimeFormat('pl', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
    const myTimeFormat = new Intl.DateTimeFormat('pl', { hour: '2-digit', minute: '2-digit' })

    const isGroupCell = (cell: Cell): boolean => !!(cell.type === 'group');

    const isExpandedCell = (cell: Cell): boolean => !!(cell as GroupCell).isExpanded;

    const getGroupCell = (row: Row): GroupCell => row.cells.find((cell: Cell) => isGroupCell(cell)) as GroupCell;

    const hasChildren = (rows: Row[], row: Row): boolean => rows.some((r: Row) => getGroupCell(r).parentId === row.rowId);

    const getDisplayedRows = (rows: Row[]): Row[] => rows.filter(row => getGroupCell(row).isDisplayed)

    // TODO level in other function
    // TODO hasChilds in other function
    const getRowChildrens = (allRows: Row[], parentRow: Row, foundRows: Row[], level: number): Row[] => {
        const childRows = allRows.filter((row: Row) => {
            return !!row.cells.find((cell: Cell) => isGroupCell(cell) && (cell as GroupCell).parentId === parentRow.rowId);
        }).map((row: Row) => {
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
    }

    const createIndents = (rows: Row[]): Row[] => {
        return rows.map((row: Row) => {
            const groupCell: GroupCell = getGroupCell(row);
            if (groupCell.parentId === undefined) {
                //  implement indent here
                getRowChildrens(rows, row, [], 1);
            }
            return row;
        });
    }

    const toggleDisplayAttr = (rows: Row[], rowIds: Id[], newIsDisplayedValue: boolean): Row[] => {
        if (rowIds.length === 0) return rows;
        return rows.map((row: Row) => {
            const groupCell: GroupCell = getGroupCell(row);
            if (rowIds.includes(row.rowId)) groupCell.isDisplayed = newIsDisplayedValue;
            return row
        })
    }

    const getRowById = (rows: Row[], rowId: Id): Row | undefined => {
        return rows.find((row: Row) => row.rowId === rowId);
    }

    const handleRowToggle = (rowId: Id) => {
        const clickedRow = getRowById(state.rows, rowId);
        console.log('handling row toggle: ', rowId, clickedRow);
        
        let childRows: Row[] = [];
        if (clickedRow) {
            
            // TODO INDENT
            childRows = getRowChildrens(state.rows, clickedRow, [], getGroupCell(clickedRow).indent! + 1 );

            let rows = state.rows;

            rows = toggleDisplayAttr(rows, childRows.map(row => row.rowId), isExpandedCell(getGroupCell(clickedRow)));
            rows = getDisplayedRows(rows);

            let newState = { ...state, rows };
            
            setState(newState);
        }
    }

    const [state, setState] = useState<GroupTestGridState>(() => {
        const columns = new Array(columnCount).fill(0).map((_, ci) => ({
            columnId: ci, resizable: true, width: ci === 0 ? 250 : undefined
        } as Column));

        let rows: any = new Array(rowCount).fill(0).map((_, ri) => {
            return {
                rowId: ri, cells: columns.map((_, ci) =>  {
                    const now = new Date();
                    switch (ci) {
                        case 0:
                            const rowId = ri;
                            const math = rowId - (rowId % 10);
                            const a = (rowId % 3) === 0 ? 1 : 0;
                            const p = math + (rowId % 10) - a - 1;
                            const parentId = (math === rowId) ? undefined : p;
                            return {
                                type: 'group',
                                text: `rId: ${ri}, pId: ${parentId}`,
                                parentId,
                                rowId,
                                isExpanded: true, // optionaly 
                                isDisplayed: true, // optionaly
                                onClick: handleRowToggle
                            } as GroupCell
                        case 1:
                            return { type: 'text', text: `${ri} - ${ci}` }
                        case 2: 
                            return { type: 'email', text: `${ri}.${ci}@bing.pl`, validator: emailValidator }
                        case 3: 
                            return { type: 'number', format: myNumberFormat, value: 2.78, nanToZero: false, hideZero: true } as NumberCell
                        case 4: 
                            return { type: 'date', format: myDateFormat, date: new Date(now.setHours((ri * 24), 0, 0, 0)) }
                        case 5: 
                            return { type: 'time', format: myTimeFormat, time: new Date(now.setHours(now.getHours() + ri)) }
                        case 6: 
                            return { type: 'checkbox', checked: false, checkedText: 'Zaznaczono' , uncheckedText: false }
                        default:
                            return { type: 'text', text: `${ri} - ${ci}`, validator: () => {} }
                    }
                })
            }
        });

        rows = createIndents(rows);

        return { rows, columns }
    })

    const handleColumnResize = (ci: Id, width: number) => {
        let newState = { ...state };
        const columnIndex = newState.columns.findIndex(el => el.columnId === ci);
        const resizedColumn: Column = newState.columns[columnIndex];
        const updateColumn: Column = { ...resizedColumn, width };
        newState.columns[columnIndex] = updateColumn;
        setState(newState);
    }

    const handleChanges = (changes: CellChange[]) => {
        let newState = { ...state };
        changes.forEach((change: CellChange) => {
          const changeRowIdx = newState.rows.findIndex(el => el.rowId === change.rowId);
          const changeColumnIdx = newState.columns.findIndex(el => el.columnId === change.columnId);
          newState.rows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
        })
        setState(newState);
        return true;
      }

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
}