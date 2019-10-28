import * as React from 'react';
import { ReactGridProps, GridRendererProps, State, StateUpdater } from '../Model';
import { DefaultGridRenderer } from './DefaultGridRenderer';
import { LegacyBrowserGridRenderer } from './LegacyBrowserGridRenderer';
import { EventHandlers } from '../Functions/EventHandlers';
import { getDerivedStateFromProps } from '../Functions/getDerivedStateFromProps';

export class ReactGrid extends React.Component<ReactGridProps, State> {
    private stateUpdater: StateUpdater = modifier => this.handleStateUpdate(modifier(this.state));
    private eventHandlers = new EventHandlers(this.stateUpdater);
    state = new State(this.stateUpdater);

    static getDerivedStateFromProps(props: ReactGridProps, state: State) {
        return getDerivedStateFromProps(props, state)
    }

    componentDidMount() {
        window.addEventListener('resize', this.eventHandlers.windowResizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.eventHandlers.windowResizeHandler);
    }

    render() {
        const grid = this.state.legacyBrowserMode ? LegacyBrowserGridRenderer : DefaultGridRenderer;
        return React.createElement(grid as any, { state: this.state, eventHandlers: this.eventHandlers } as GridRendererProps);
    }

    private handleStateUpdate(state: State) {
        console.log('handle state update');
        const changes = [...state.queuedCellChanges];
        if (changes.length > 0) {
            if (this.props.onCellsChanged) {
                this.props.onCellsChanged([...changes])
            };
            changes.forEach(() => state.queuedCellChanges.pop())
        }
        if (state !== this.state) {
            this.setState(state);
        }
    }
};
