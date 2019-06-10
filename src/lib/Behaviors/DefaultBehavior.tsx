import { GridContext, Behavior, KeyboardEvent, ClipboardEvent, PointerEvent, Location, keyCodes, CellData, DataChange } from "../Common";
import { handleKeyDown as handleKeyDown } from "./DefaultBehavior/handleKeyDown";
import { changeBehavior } from "../Functions";
import { CellSelectionBehavior } from "./CellSelectionBehavior";
import { getActiveSelectedRange } from "../Functions/getActiveSelectedRange";
import { trySetDataAndAppendChange } from "../Functions/trySetData";

export class DefaultBehavior extends Behavior {

    constructor(private gridContext: GridContext) { super(); }

    handlePointerDown(event: PointerEvent, location: Location) {
        // changing behavior will disable all keyboard event handlers
        const cellSelectionBehavior = new CellSelectionBehavior(this.gridContext);
        changeBehavior(this.gridContext, cellSelectionBehavior);
        cellSelectionBehavior.handlePointerDown(event, location);
    }

    handleContextMenu(event: PointerEvent): void {
        event.preventDefault();
        //changeBehavior(this.gridContext, new DrawContextMenuBehavior(this.gridContext, event))
        //event.persist();
    }

    handlePointerMove(event: PointerEvent, location: Location): void {
    }

    handlePointerUp(event: PointerEvent, location: Location): void {
    }

    handleDoubleClick(event: PointerEvent, location: Location): void {
        if (this.gridContext.state.isFocusedCellInEditMode /*|| this.grid.state.isFocusedCellReadOnly*/) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            if (
                this.gridContext.state.focusedLocation &&
                this.gridContext.state.focusedLocation.col.idx === location.col.idx &&
                this.gridContext.state.focusedLocation.row.idx === location.row.idx
            ) {
                this.gridContext.lastKeyCode = 0;
                setTimeout(() => this.gridContext.setState({ isFocusedCellInEditMode: true }));
            }
        }
    }

    handleKeyDown(event: KeyboardEvent) {
        handleKeyDown(this.gridContext, event)
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (event.keyCode === keyCodes.TAB || event.keyCode === keyCodes.ENTER) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

    }

    handleCopy(event: ClipboardEvent): void {
        // this.grid.preventFocusChange = true;
        this.copySelectedRangeToClipboard()
        // this.grid.hiddenFocusElement.focus()
        // this.grid.preventFocusChange = false;
        event.preventDefault()
    }

    handlePaste(event: ClipboardEvent): void {
        const activeSelectedRange = getActiveSelectedRange(this.gridContext)
        if (!activeSelectedRange) {
            return
        }
        let pasteContent: CellData[][] = [];
        const htmlData = event.clipboardData.getData('text/html');
        const parsedData = new DOMParser().parseFromString(htmlData, 'text/html')
        if (htmlData && parsedData.body.firstElementChild!.getAttribute('data-key') === 'dynagrid') {
            const cells = parsedData.body.firstElementChild!.firstElementChild!.children
            for (let i = 0; i < cells.length; i++) {
                const row: CellData[] = [];
                for (let j = 0; j < cells[i].children.length; j++) {
                    const data = JSON.parse(cells[i].children[j].getAttribute('data-data')!)
                    const type = cells[i].children[j].getAttribute('data-type')
                    const textValue = cells[i].children[j].innerHTML
                    row.push({ text: textValue, data: data, type: type! })
                }
                pasteContent.push(row)
            }
        } else {
            pasteContent = event.clipboardData.getData('text/plain').split('\n').map(line => line.split('\t').map(t => ({ text: t, data: t, type: 'string' })))
        }
        const dataChanges: DataChange[] = [];

        if (pasteContent.length === 1 && pasteContent[0].length === 1) {
            activeSelectedRange.rows.forEach(row =>
                activeSelectedRange.cols.forEach(col => {
                    trySetDataAndAppendChange(new Location(row, col), pasteContent[0][0], dataChanges)
                })
            )
        } else {
            let lastLocation: Location
            const cellMatrix = this.gridContext.cellMatrix
            pasteContent.forEach((row, pasteRowIdx) =>
                row.forEach((pasteValue: CellData, pasteColIdx: number) => {
                    const rowIdx = activeSelectedRange.rows[0].idx + pasteRowIdx
                    const colIdx = activeSelectedRange.cols[0].idx + pasteColIdx
                    if (rowIdx <= cellMatrix.last.row.idx && colIdx <= cellMatrix.last.col.idx) {
                        lastLocation = cellMatrix.getLocation(rowIdx, colIdx)
                        trySetDataAndAppendChange(lastLocation, pasteValue, dataChanges)
                    }
                })
            )
            this.gridContext.setState({ selectedRanges: [cellMatrix.getRange(activeSelectedRange.first, lastLocation!)] })
        }
        event.preventDefault()
        this.gridContext.commitChanges(dataChanges);
    }

    handleCut(event: ClipboardEvent): void {
        // this.grid.preventFocusChange = true;
        this.copySelectedRangeToClipboard(true)
        // this.grid.preventFocusChange = false;
        event.preventDefault()
        //this.gridContext.hiddenFocusElement.focus();
    }

    private copySelectedRangeToClipboard(removeValues = false) {

        const dataChanges: DataChange[] = [];
        const div = document.createElement('div')
        const table = document.createElement('table')
        table.setAttribute('empty-cells', 'show')
        table.setAttribute('data-key', 'dynagrid')
        const activeSelectedRange = getActiveSelectedRange(this.gridContext)
        activeSelectedRange.rows.forEach(row => {
            const tableRow = table.insertRow()
            activeSelectedRange.cols.forEach(col => {
                const tableCell = tableRow.insertCell()
                const location = new Location(row, col)
                tableCell.textContent = (location.cell.cellData ? location.cell.cellData.text : '')  // for undefined values
                if (!location.cell.cellData) {
                    tableCell.innerHTML = '<img>';
                }
                tableCell.setAttribute('data-data', JSON.stringify(location.cell.cellData.data))
                tableCell.setAttribute('data-type', location.cell.cellData.type)
                tableCell.style.border = '1px solid #D3D3D3'
                if (removeValues) {
                    trySetDataAndAppendChange(location, { text: '', data: '', type: 'string' }, dataChanges);
                }
            })
        })
        div.setAttribute('contenteditable', 'true')
        div.appendChild(table)
        document.body.appendChild(div)
        div.focus()
        document.execCommand('selectAll', false, undefined)
        document.execCommand('copy')
        document.body.removeChild(div)
        //this.gridContext.hiddenFocusElement.focus();
    }
}
