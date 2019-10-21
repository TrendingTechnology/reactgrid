import { State } from '../Model';

export function getActiveSelectedRange(state: State) {
    return state.selectedRanges[state.activeSelectedRangeIdx];
}
