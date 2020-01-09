import * as React from 'react';
import { State } from '../Model';
import { isBrowserSafari } from '../Functions/safari';

interface HiddenElementProps {
    state: State;
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
}

// TODO apply similar component on LegacyBrowserGridRenderer
export const HiddenElement: React.FunctionComponent<HiddenElementProps> = (props) => {

    let styles = {};
    if (isBrowserSafari()) {
        const { focusedLocation, cellMatrix } = props.state;
        styles = {
            position: 'absolute',
            ...(focusedLocation && { top: focusedLocation.row.top }),
            ...(focusedLocation && { left: cellMatrix.last.column.right })
        }
    }
    return <input className="rg-hidden-element" style={styles} readOnly={true} ref={props.hiddenElementRefHandler} />
}