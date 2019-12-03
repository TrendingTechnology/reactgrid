import React, { useRef, useLayoutEffect, useState } from 'react';
import { Location, State } from '../Model';
import { FillHandleBehavior } from '../Behaviors/FillHandleBehavior';

interface FillHandleProps {
    state: State;
    location: Location;
}

export const FillHandle: React.FunctionComponent<FillHandleProps> = (props) => {
    const targetRef: any = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    useLayoutEffect(() => {
        if (targetRef.current) {
            setDimensions({
                width: targetRef.current.offsetWidth,
                height: targetRef.current.offsetHeight
            });
        }
    }, []);
    return (
        <div
            className="rg-touch-fill-handle"
            ref={targetRef}
            style={{
                top: props.location.row.bottom - (dimensions.width / 2),
                left: props.location.column.right - (dimensions.height / 2),
            }}
            data-cy="rg-touch-fill-handle"
            onPointerDown={event => {
                if (event.pointerType !== 'mouse' && event.pointerType !== undefined) { // !== undefined (disabled this event for cypress tests)
                    props.state.update(state => ({ ...state, currentBehavior: new FillHandleBehavior() }));
                }
            }}
        >
            <div
                className="rg-fill-handle"
                data-cy="rg-fill-handle"
            />
        </div>
    )

}
