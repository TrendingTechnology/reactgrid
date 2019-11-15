import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
import { isNumberInput, isNavigationKey } from './keyCodeCheckings'

export interface NumberCell extends Cell {
    type: 'number',
    value: number
    format?: Intl.NumberFormat;
    hideZero?: boolean
    isValid: boolean | undefined
}

export class NumberCellTemplate implements CellTemplate<NumberCell> {

    validate(cell: any): CompatibleCell<NumberCell> {
        const number_regex = /^[0-9,.]+$/
        if (!number_regex.test(cell.value) || cell.value === undefined || cell.value === NaN) {
            return { ...cell, value: 0, text: '', isValid: false }
        } else {
            return { ...cell, isValid: true, text: cell.value }
        }
    }

    handleKeyDown(cell: NumberCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
        if (!ctrl && !alt && !shift && (isNumberInput(keyCode) || keyCode == 188))
            return { cell: { ...cell }, enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    parseNumber(strg: string): number {
        var decimal = '.';
        if (strg.indexOf(',') > strg.indexOf('.')) decimal = ',';
        strg = strg.replace(new RegExp("[^0-9$" + decimal + "]", "g"), "");
        strg = this.replaceCommasToDots(strg)
        return parseFloat(strg);
    }

    update(cell: NumberCell, newCell: NumberCell | CompatibleCell): NumberCell {
        const cellValidated = this.validate(newCell)
        const isCurrnetValueFormat = isNaN(this.replaceCommasToDots(cellValidated.text))
        if (isCurrnetValueFormat) {
            return { ...cell, value: 0 } as NumberCell;
        }
        if (newCell.value !== undefined && newCell.value !== NaN && (newCell as NumberCell).isValid) {
            return { ...cell, value: this.parseNumber(newCell.value.toString()) } as NumberCell;
        }
        const parsed = this.parseNumber((newCell as CompatibleCell).text)
        return { ...cell, value: (parsed! > 0 || parsed! < 0) || (!cellValidated.isValid) ? parsed : 0 }
    }

    replaceDotsToCommas(value: number) {
        return value.toString().replace(".", ",")
    }

    replaceCommasToDots(value: any) {
        return value.toString().replace(",", ".")
    }


    isValidPrecisonFormat(format: string | undefined): boolean {
        if (format && format.substring(0, 2) == '#.' && new RegExp("^[#\#]+$").test(format.substring(2, format.length))) return true
        return false
    }

    render(cell: NumberCell, isInEditMode: boolean, onCellChanged: (cell: NumberCell, commit: boolean) => void): React.ReactNode {

        if (!isInEditMode) {
            return <span className='number-is-valid'>{cell.format ? cell.format.format(cell.value) : cell.value.toString()}</span>
        }

        return <input
            className="rg-number-cell-template"
            style={{ textAlign: "right" }}
            ref={input => {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            defaultValue={cell.format ? new Intl.NumberFormat(cell.format.resolvedOptions().locale, { useGrouping: false, maximumFractionDigits: 20 }).format(cell.value) : cell.value.toString()}
            onChange={e => {

                onCellChanged({ ...cell, value: parseFloat(e.currentTarget.value.replace(',', '.')) }, false)
            }}

            onKeyDown={e => {
                if (isNumberInput(e.keyCode) || isNavigationKey(e) || e.keyCode == 188) e.stopPropagation()
                if (!isNumberInput(e.keyCode) && !isNavigationKey(e) && e.keyCode != 188) e.preventDefault()

            }}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}