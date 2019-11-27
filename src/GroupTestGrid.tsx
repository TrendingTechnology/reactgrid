import React, { useState } from 'react';
import { ReactGrid, Column, Row, CellChange, Id } from './reactgrid'
import './lib/assets/core.scss';
import { NumberCell } from './lib/CellTemplates/NumberCellTemplate';
import { GroupCell, Cell } from './lib';

const columnCount = 10;
const rowCount = 200;

interface TestGridState {
    columns: Column[]
    rows: Row[]
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

    const isGroupCell = (cell: Cell): boolean => {
        return !!(cell.type === 'group')
    }

    const filterRows = (rows: Row[]): Row[] => {
        return rows.filter((row, ri) => {
            return row.cells.every((cell: Cell) => !isGroupCell(cell) || (cell as GroupCell).isExpanded === true)
        })
    }

    const findRowChildrens = (rows: Row[], parentRow: Row, foundRows: Row[]): Row[] => {
        if (rows.length === 0) return [];
        
        const childRows = rows.filter((row: Row) => {
            const cell = row.cells.find((cell: Cell) => {
                return isGroupCell(cell) && (cell as GroupCell).parentId === parentRow.rowId;
            })
            return !!cell;
        });
        const res = childRows.forEach((row: Row) => {
            console.log(row);
            findRowChildrens(childRows, row, childRows)
        });
        return []
    }

    const getClickedRow = (rows: Row[], rowId: Id): Row | undefined => {
        return rows.find((row: Row) => row.rowId === rowId);
    }

    const handleRowToggle = (rowId: Id) => {
        console.log('handling row toggle: ', rowId, getClickedRow(state.rows, rowId));
        const clickedRow = getClickedRow(state.rows, rowId);
        if (clickedRow) {
            const childRows = findRowChildrens(state.rows, clickedRow, []);
            // console.log(childRows);
        }
        const rows = filterRows(state.rows);
        let newState = { 
            ...state, 
            rows
        };
        setState(newState);
    }

    const [state, setState] = useState<TestGridState>(() => {
        const columns = new Array(columnCount).fill(0).map((_, ci) => ({
            columnId: ci, resizable: true
        } as Column));

        let rows: any = new Array(rowCount).fill(0).map((_, ri) => {
            return {
                rowId: ri, cells: columns.map((_, ci) =>  {
                    const now = new Date();
                    switch (ci) {
                        case 0:
                            const rowId = ri;
                            const parentId = rowId - (rowId % 2);
                            return {
                                type: 'group',
                                text: `rId: ${ri}, pId: ${parentId}`,
                                parentId,
                                rowId,
                                isExpanded: true,
                                hasChilds: true, // remove
                                depth: rowId % 6, // remove
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

        rows = filterRows(rows);
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