import { Location, State } from "../Common";
export declare function trySetDataAndAppendChange(state: State, location: Location, cell: {
    data?: any;
    type?: string | null;
    text?: string;
}): State;
