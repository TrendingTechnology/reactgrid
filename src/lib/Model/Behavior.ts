import * as React from 'react';
import { PointerLocation, State, Direction } from '.';
import { KeyboardEvent, ClipboardEvent, PointerEvent, FocusEvent } from '../Functions/domEvents';
import { Range } from './Range';

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export abstract class Behavior {
    handleKeyDown(event: KeyboardEvent, state: State): State {
        return state;
    }
    handleKeyUp(event: KeyboardEvent, state: State): State {
        return state;
    }
    handleCopy(event: ClipboardEvent, state: State): State {
        return state;
    }
    handlePaste(event: ClipboardEvent, state: State): State {
        return state;
    }
    handleCut(event: ClipboardEvent, state: State): State {
        return state;
    }
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State {
        return state;
    }
    handlePointerEnter(event: PointerEvent, location: PointerLocation, state: State): State {
        return state;
    }
    handlePointerMove(event: PointerEvent, location: PointerLocation, state: State): State {
        return state;
    }
    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State {
        return state;
    }
    handleDoubleClick(event: PointerEvent, location: PointerLocation, state: State): State {
        return state;
    }
    handleContextMenu(event: PointerEvent, state: State): State {
        return state;
    }
    renderPanePart(state: State, pane: Range): React.ReactNode {
        return undefined;
    }
    handleBlur(event: FocusEvent, state: State): State {
        return state;
    }
    autoScrollDirection: Direction = 'both';
}
