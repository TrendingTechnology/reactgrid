import * as React from 'react';
// import { keyCodes } from '../Functions/keyCodes';
// import { CellRenderProps as CellRenderProps, CellTemplate } from '../Model';

// type CheckboxCell = Cell<'checkbox', boolean, {}>

// export class CheckboxCellTemplate implements CellTemplate<CheckboxCell> {

//     isValid(cell: CheckboxCell): boolean {
//         return typeof (cell.data) === 'boolean';
//     }

//     toText(cell: CheckboxCell) {
//         return cell ? 'true' : '';
//     }

//     handleKeyDown(cell: CheckboxCell, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean) {
//         if (keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER)
//             cell.data = !cell.data
//         return { cell, enableEditMode: false }
//     }

//     renderContent: (props: CellRenderProps<CheckboxCell>) => React.ReactNode = (props) => {
//         return <input
//             type="checkbox"
//             style={{
//                 width: '20px',
//                 height: '20px',
//                 marginLeft: 'auto',
//                 marginRight: 'auto',
//                 padding: 0,
//                 border: 0,
//                 background: 'transparent',
//                 pointerEvents: 'auto',
//                 zIndex: 1
//             }}
//             checked={props.cell.data}
//             onChange={() => props.onCellChanged({ ...props.cell, data: !props.cell.data }, true)}
//         />
//     }
// }
