import React from 'react';
import { State, ReactGridProps } from '../Model';
import { handleStateUpdate } from './handleStateUpdate';
import { getDerivedStateFromProps } from './getDerivedStateFromProps';

export function useState(props: ReactGridProps): State {
    const [state, setState] = React.useState(() => new State());
    const derivedState = React.useMemo(() => getDerivedStateFromProps(props, state), [props, state]);
    derivedState.update = modifier => { console.log('update state'); console.log(derivedState); setState(handleStateUpdate(props, derivedState, modifier(derivedState))) };
    return derivedState;
}