import * as React from "react";
import { Location, State } from "../Common";
import { FillHandleBehavior } from "../Behaviors/FillHandleBehavior";

interface FillHandleProps {
    state: State,
    location: Location
}

export const FillHandle: React.FunctionComponent<FillHandleProps> = (props) =>
    <div
        className="dg-touch-fill-handle"
        style={{
            top: props.location.row.bottom - 13,
            left: props.location.col.right - 11,
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
