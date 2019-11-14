import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, CompatibleCell } from '../Model';
import { isNumberInput, isNavigationKey } from './keyCodeCheckings'

export interface NumberCell extends Cell {
    type: 'number',
    value: any
    format?: string
    hideZero?: boolean
    isValid: boolean | undefined
}

export class NumberCellTemplate implements CellTemplate<NumberCell> {

    validate(cell: any): CompatibleCell<NumberCell> {

        const number_regex = /^[0-9,.]+$/
        if (!number_regex.test(cell.value) || cell.value === undefined || cell.value === NaN) {
            return { ...cell, value: 0, isValid: false }
        } else {
            return { ...cell, isValid: true, text: cell.value }
        }
    }

    handleKeyDown(cell: NumberCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
        if (!ctrl && !alt && !shift && keyCode === 188 || keyCode === 190)
            return { cell: { ...cell }, enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    parseNumber(strg: any) {
        // if (strg === NaN || strg) return
        var decimal = '.';
        strg = strg.replace(/[^0-9$.,]/g, '');
        if (strg.indexOf(',') > strg.indexOf('.')) decimal = ',';
        if ((strg.match(new RegExp("\\" + decimal, "g")) || []).length > 1) decimal = "";
        if (decimal != "" && (strg.length - strg.indexOf(decimal) - 1 == strg.length) && strg.indexOf("0" + decimal) !== 0) decimal = "";
        strg = strg.replace(new RegExp("[^0-9$" + decimal + "]", "g"), "");
        strg = strg.replace(',', '.');
        return parseFloat(strg);
    }

    update(cell: NumberCell, newCell: NumberCell | CompatibleCell): NumberCell {

        const cellValidated = this.validate(newCell)
        const isCurrnetValueFormat = isNaN(this.replaceCommasToDots(cellValidated.text))
        if (isCurrnetValueFormat) {
            return { ...cell, value: 0 } as NumberCell;
        }
        if (newCell.value !== undefined && newCell.value !== NaN && (newCell as NumberCell).isValid) {
            return { ...cell, value: newCell.value } as NumberCell;
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

    //FORMAT with commas
    numberWithCommas(n: any) {
        var parts = n.toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    }

    render(cell: NumberCell, isInEditMode: boolean, onCellChanged: (cell: NumberCell, commit: boolean) => void): React.ReactNode {


        if (!isInEditMode) {

            if (cell.format == '#.##') {
                return <span className={`${cell.isValid ? 'number-is-valid' : 'number-is-un-valid'}`}>{(this.replaceDotsToCommas(cell.value))}</span>
            }
            else {
                return <span className={`${cell.isValid ? 'number-is-valid' : 'number-is-un-valid'}`}>{this.replaceDotsToCommas(cell.value)}</span>
            }
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
            value={cell.value.toString().replace(".", ",")}
            onChange={e => {

                onCellChanged({ ...cell, value: e.currentTarget.value }, false)
            }}

            onKeyDown={e => {
                if (isNumberInput(e.keyCode) || isNavigationKey(e) || e.keyCode === 188) e.stopPropagation()
                if (!isNumberInput(e.keyCode) && !isNavigationKey(e) && e.keyCode !== 188) e.preventDefault()

            }}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}