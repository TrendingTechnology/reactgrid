import * as React from "react";
import { Pane } from "./Pane";
import { State, Borders, Range } from "../Common";

export interface PaneRowProps {
    id: string,
    class?: string,
    state: State,
    style: React.CSSProperties,
    range: Range,
    borders: Borders,
    zIndex: number,
}

export const PaneRow: React.FunctionComponent<PaneRowProps> = (props) => {
    const matrix = props.state.cellMatrix;
    const state = props.state;
    return (
        <div
            className={`dg-pane-row ${props.class ? props.class : ''}`}
            style={{
                height: props.range.height,
                zIndex: props.zIndex,
                ...props.style,
            }}
        >
            {matrix.frozenLeftRange.width > 0 &&
                <Pane
                    id={props.id + 'L'}
                    class="rg-pane-l"
                    state={props.state}
                    style={{ left: 0, position: 'sticky', zIndex: props.zIndex + 1 }}
                    range={matrix.frozenLeftRange.slice(props.range, 'rows')}
                    borders={{ ...props.borders, right: true }}
                />
            }
            {state.visibleRange && state.visibleRange.width > 0 &&
                <Pane
                    id={props.id + 'C'}
                    class="rg-pane-c"
                    state={props.state}
                    style={{ width: matrix.scrollableRange.width }}
                    range={props.range.slice(state.visibleRange, 'columns')}
                    borders={{ ...props.borders, right: false, bottom: false }}
                />
            }
            {matrix.frozenRightRange.width > 0 &&
                <Pane
                    id={props.id + 'R'}
                    class="rg-pane-r"
                    state={props.state}
                    style={{ right: 0, position: 'sticky', zIndex: props.zIndex + 1 }}
                    range={matrix.frozenRightRange.slice(props.range, 'rows')}
                    borders={{ ...props.borders, left: true }}
                />
            }
        </div>
    );

}
