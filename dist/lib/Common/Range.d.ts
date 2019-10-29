import { Column, Row, Location } from ".";
export declare class Range {
    readonly cols: Column[];
    readonly rows: Row[];
    readonly width: number;
    readonly height: number;
    readonly first: Location;
    readonly last: Location;
    constructor(cols: Column[], rows: Row[]);
    contains(location: Location): boolean;
    containsRange(range: Range): boolean;
    intersectsWith(range: Range): boolean;
    slice(range: Range, direction: 'columns' | 'rows' | 'both'): Range;
}
