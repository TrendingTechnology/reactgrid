import * as React from "react";
import { Range } from "../Common";
export interface PartialRangeProps {
    range: Range;
    pane: Range;
    style: React.CSSProperties;
    class?: string;
}
export declare const PartialArea: React.FunctionComponent<PartialRangeProps>;
