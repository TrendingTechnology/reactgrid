import { Grid, GridState } from "../Components/Grid";
import { CellMatrix } from "./CellMatrix";
import { Location } from "./Model";
import { DefaultGridBehavior } from "../Behaviors/DefaultGridBehavior";
import { Behavior } from ".";

// INTERNAL
export class GridContext {
    constructor(private grid: Grid) { }
    get state(): GridState { return this.grid.state; }
    get cellMatrix(): CellMatrix { return this.grid.props.cellMatrix }
    setState(state: Partial<GridState>) { this.grid.setState(state as GridState, () => console.log('state updated')); };
    forceUpdate() { this.grid.forceUpdate(); }
    commitChanges() { this.grid.props.onValuesChanged && this.grid.props.onValuesChanged(); }
    hiddenFocusElement!: HTMLDivElement;
    gridElement!: HTMLDivElement;
    // currentBehavior cannot be in state, because setState() updates state asyncronously
    currentBehavior: Behavior = new DefaultGridBehavior(this);

}
