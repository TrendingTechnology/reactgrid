import * as React from "react";
import { Location, State } from "../Common";
import { FillHandleBehavior } from "../Behaviors/FillHandleBehavior";

interface FillHandleProps {
    state: State,
    location: Location
}

export const FillHandle: React.FunctionComponent<FillHandleProps> = (props) => {
    const targetRef: any = React.useRef();
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

    React.useLayoutEffect(() => {
        if (targetRef.current) {
            setDimensions({
                width: targetRef.current.offsetWidth,
                height: targetRef.current.offsetHeight
            });
        }
    }, []);
    return (
        <div
            className="dg-touch-fill-handle"
            ref={targetRef}
            style={{
                top: props.location.row.bottom - (dimensions.width / 2),
                left: props.location.col.right - (dimensions.height / 2),
            }}
            data-cy="dg-touch-fill-handle"
            onPointerDown={event => {
                if (event.pointerType !== 'mouse' && event.pointerType !== undefined) { // !== undefined (disabled this event for cypress tests)
                    props.state.updateState(state => ({ ...state, currentBehavior: new FillHandleBehavior() }));
                }
            }}
        >
            <div
                className="dg-fill-handle"
                data-cy="dg-fill-handle"
            />
        </div>
    )
    
}