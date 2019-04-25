import * as React from 'react'
import { DelegateBehavior } from "./DelegateBehavior";
import { keyCodes } from '../Common/Constants';

export class DefaultKeyHandlerBehavior extends DelegateBehavior {
    public handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (!this.grid.state.focusedLocation || event.ctrlKey || this.grid.state.isFocusedCellReadOnly || this.grid.props.cellMatrix.getCell(this.grid.state.focusedLocation).type === FieldTypes.checkbox) {
            return this.innerBehavior.handleKeyDown(event);
        }

        if (!this.grid.state.isFocusedCellInEditMode) {
            const cellMatrix = this.grid.props.cellMatrix
            const cell = cellMatrix.getCell(this.grid.state.focusedLocation)

            if (navigator.userAgent.match(/Android/i)) {
                var keyCode = event.keyCode || event.which;
                if (keyCode === 0 || keyCode === 229) {
                    this.grid.setState({ isFocusedCellInEditMode: true })
                }
            } else {
                if ((event.keyCode >= keyCodes.ZERO && event.keyCode <= keyCodes.Z) || (event.keyCode >= keyCodes.NUM_PAD_0 && event.keyCode <= keyCodes.DIVIDE) || (event.keyCode >= keyCodes.SEMI_COLON && event.keyCode <= keyCodes.SINGLE_QUOTE) || event.keyCode === keyCodes.SPACE) {
                    if (cell.validateValue && !cell.validateValue(event.keyCode)) {
                        event.preventDefault()
                    }
                    this.grid.setState({ isFocusedCellInEditMode: true })
                    return;
                }
            }
        } return this.innerBehavior.handleKeyDown(event);

    }
}