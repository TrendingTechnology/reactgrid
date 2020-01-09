import * as React from 'react';
import { State } from '../Model';

interface HiddenElementProps {
    state: State;
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
}

// TODO apply similar component on LegacyBrowserGridRenderer
export const HiddenElement: React.FunctionComponent<HiddenElementProps> = (props) => {
    return <input className="rg-hidden-element" readOnly={true} ref={props.hiddenElementRefHandler} />
}