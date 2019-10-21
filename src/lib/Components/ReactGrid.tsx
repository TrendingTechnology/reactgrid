import * as React from 'react';
import { ReactGridProps } from '../Model';
import { DefaultGridRenderer } from './DefaultGridRenderer';
import { LegacyBrowserGridRenderer } from './LegacyBrowserGridRenderer';
import { useState } from '../Functions/useState';
import { EventHandlers } from '../Helper/EventHandlers';
import { isBrowserIE, isBrowserEdge } from '../Functions';

export const ReactGrid: React.FunctionComponent<ReactGridProps> = props => {
    const state = useState(props);
    const eventHandlers = React.useMemo(() => new EventHandlers(state.update), [0]);
    React.useEffect(() => {
        window.addEventListener('resize', eventHandlers.windowResizeHandler);
        return () => window.removeEventListener('resize', eventHandlers.windowResizeHandler);
    }, [0]);

    const grid = isBrowserIE() || isBrowserEdge() ? LegacyBrowserGridRenderer : DefaultGridRenderer;
    return React.createElement(grid as any, {
        state: state,
        eventHandlers: EventHandlers
    });
};
