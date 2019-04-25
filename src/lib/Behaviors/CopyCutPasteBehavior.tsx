import * as React from 'react'
import { DelegateBehavior } from "./DelegateBehavior";
import { Utilities } from '../Common/Utilities';
import { Row, Column, Location } from '../Common';

export class CopyCutPasteBehavior extends DelegateBehavior {

    handleCut = (event: React.ClipboardEvent<HTMLDivElement>) => {
        //this.grid.preventFocusChange = true;
        this.copySelectedRangeToClipboard(true)
        //this.grid.hiddenFocusElement.focus()
        //this.grid.preventFocusChange = false;
        event.preventDefault()
        this.gridContext.commitChanges()
    }

    handleCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {
        this.gridContext.preventFocusChange = true;
        this.copySelectedRangeToClipboard()
        this.gridContext.hiddenFocusElement.focus()
        this.gridContext.preventFocusChange = false;
        event.preventDefault()
    }

    handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const activeSelectedRange = Utilities.getActiveSelectionRange(this.gridContext.state.selectedRanges, this.gridContext.state.focusedLocation)
        const pasteContent = event.clipboardData.getData('text/plain').split('\n').map((line: string) => line.split('\t'))
        const cellMatrix = this.gridContext.cellMatrix
        if (pasteContent.length === 1 && pasteContent[0].length === 1) {
            activeSelectedRange.rows.forEach((row: Row) =>
                activeSelectedRange.cols.forEach((col: Column) =>
                    cellMatrix.getCell({ row, col }).trySetValue(pasteContent[0][0])
                )
            )
        } else {
            let lastLocation: Location
            pasteContent.forEach((row: Row[], pasteRowIdx: number) => {
                row.forEach((pasteValue, pasteColIdx) => {
                    const rowIdx = activeSelectedRange.rows[0].idx + pasteRowIdx
                    const colIdx = activeSelectedRange.cols[0].idx + pasteColIdx
                    if (rowIdx <= cellMatrix.last.row.idx && colIdx <= cellMatrix.last.col.idx) {
                        lastLocation = cellMatrix.getLocation(rowIdx, colIdx)
                        cellMatrix.getCell(lastLocation).trySetValue(pasteValue ? pasteValue : undefined)
                    }
                })
            })
            this.gridContext.setState({ selectedRanges: [cellMatrix.getRange(activeSelectedRange.first, lastLocation)] })
        }
        event.preventDefault()
        this.gridContext.commitChanges()
    }

    private copySelectedRangeToClipboard(removeValues = false) {
        const div = document.createElement('div')
        const table = document.createElement('table')
        table.setAttribute('empty-cells', 'show')
        const activeSelectedRange = Utilities.getActiveSelectionRange(this.gridContext.state.selectedRanges, this.gridContext.state.focusedLocation)
        activeSelectedRange.rows.forEach((row: Row) => {
            const tableRow = table.insertRow()
            activeSelectedRange.cols.forEach((col: Column) => {
                const tableCell = tableRow.insertCell()
                const gridCell = this.gridContext.cellMatrix.getCell({ row, col })
                tableCell.textContent = (gridCell.value ? gridCell.value : '')  // for undefined values
                if (!gridCell.value) {
                    tableCell.innerHTML = '<img>';
                }
                tableCell.style.border = '1px solid #D3D3D3'
                if (removeValues) { gridCell.trySetValue(undefined) }
            })
        })

        div.setAttribute('contenteditable', 'true')
        div.appendChild(table)
        document.body.appendChild(div)
        div.focus()
        document.execCommand('selectAll', false, undefined)
        document.execCommand('copy')
        document.body.removeChild(div)
    }

}