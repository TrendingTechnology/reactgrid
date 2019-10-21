import { ReactGridProps } from '..';
import { State } from '../Model';

export function handleStateUpdate(props: ReactGridProps, prevState: State, newState: State): State {
    //checkLicense(props.license);
    const changes = [...newState.queuedChanges];
    if (changes.length > 0) {
        if (props.onCellsChanged && changes.length > 0) {
            props.onCellsChanged(changes);
            return { ...newState, queuedChanges: [] };
        }
    }
    return prevState;
}
