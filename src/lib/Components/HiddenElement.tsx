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
    if (isBrowserSafari() && props.state.viewportElement && props.state.viewportElement.clientHeight !== props.state.cellMatrix.height) {
        const { clientHeight, clientWidth, scrollTop, scrollLeft } = props.state.viewportElement;
        const { height: cellMatrixHeight, width: cellMatrixWidth } = props.state.cellMatrix;
        styles = {
            position: 'absolute',
            height: clientHeight,
            width: clientWidth,
            zIndex: -1,
            top: (scrollTop + clientHeight > cellMatrixHeight) ? cellMatrixHeight - clientHeight : scrollTop,
            left: (scrollLeft + clientWidth > cellMatrixWidth) ? cellMatrixWidth - clientWidth : scrollLeft,
        }
    }
    return <input className="rg-hidden-element" style={styles} readOnly={true} ref={props.hiddenElementRefHandler} />
}