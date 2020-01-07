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
        const { focusedLocation } = props.state;
        styles = {
            position: 'absolute',
            ...(focusedLocation && { top: focusedLocation && focusedLocation.row.top }),
            ...(focusedLocation && { left: focusedLocation && focusedLocation.column.left })
        }
    }
    return (
        <input className="rg-hidden-element"
            style={styles}
            readOnly={true} ref={props.hiddenElementRefHandler} />
    )
}