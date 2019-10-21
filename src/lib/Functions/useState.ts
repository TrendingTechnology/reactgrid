import React from 'react';
import { ReactGridProps } from '../..';
import { State } from '../Model';
import { handleStateUpdate } from './handleStateUpdate';
import { getDerivedStateFromProps } from './getDerivedStateFromProps';

export function useState(props: ReactGridProps): State {
    const [state, setState] = React.useState(() => new State());
    state.update = modifier => setState(handleStateUpdate(props, state, modifier(state)));
    return React.useMemo(() => getDerivedStateFromProps(props, state), [props, state]);
}
