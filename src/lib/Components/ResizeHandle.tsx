import * as React from "react";

export const ResizeHandle: React.FunctionComponent = () => {
    const [hover, setHover] = React.useState(false)
    // TODO REMOVE USESTATE HOOK IF CSS STYLING IS FINISHED
    return (
        <div
            className="dg-touch-resize-handle"
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
        >
            <div
                className="dg-resize-handle"
                onPointerEnter={() => setHover(true)}
                onPointerLeave={() => setHover(false)}
                style={{
                    cursor: hover ? 'w-resize' : '',
                    background: hover ? '#3498db' : '',
                }}
            />
        </div>
    )
}
