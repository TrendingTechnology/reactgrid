var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { getLocationFromClient, scrollIntoView } from '.';
import { DefaultBehavior } from '../Behaviors/DefaultBehavior';
import { areLocationsEqual } from './areLocationsEqual';
var PointerEventsController = (function () {
    function PointerEventsController(updateState) {
        var _this = this;
        this.updateState = updateState;
        this.eventTimestamps = [0, 0];
        this.eventLocations = [undefined, undefined];
        this.currentIndex = 0;
        this.handlePointerDown = function (event, state) {
            state.props.onContextMenu && window.addEventListener('contextmenu', _this.handleContextMenu);
            if (event.button !== 0 && event.button !== undefined) {
                return state;
            }
            window.addEventListener('pointermove', _this.handlePointerMove);
            window.addEventListener('pointerup', _this.handlePointerUp);
            window.addEventListener('pointerup', _this.handlePointerUp);
            var previousLocation = _this.eventLocations[_this.currentIndex];
            var currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
            _this.pointerDownLocation = currentLocation;
            _this.currentIndex = 1 - _this.currentIndex;
            _this.eventTimestamps[_this.currentIndex] = new Date().valueOf();
            _this.eventLocations[_this.currentIndex] = currentLocation;
            if (event.pointerType === 'mouse' || (currentLocation.row.idx === 0 || currentLocation.column.idx === 0) || areLocationsEqual(currentLocation, previousLocation) || event.pointerType === undefined) {
                state = state.currentBehavior.handlePointerDown(event, currentLocation, state);
            }
            return state;
        };
        this.handleContextMenu = function (event) {
            _this.updateState(function (state) {
                window.removeEventListener('pointerup', _this.handlePointerUp);
                window.removeEventListener('pointermove', _this.handlePointerMove);
                state.props.onContextMenu && window.removeEventListener('contextmenu', _this.handleContextMenu);
                var currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
                state = state.currentBehavior.handlePointerUp(event, currentLocation, state);
                state = state.currentBehavior.handleContextMenu(event, state);
                state.hiddenFocusElement.focus();
                return state;
            });
        };
        this.handlePointerMove = function (event) {
            _this.updateState(function (state) {
                var autoScrollDirection = state.currentBehavior.autoScrollDirection;
                var currentLocation = getLocationFromClient(state, event.clientX, event.clientY, autoScrollDirection);
                scrollIntoView(state, currentLocation, autoScrollDirection);
                state = state.currentBehavior.handlePointerMove(event, currentLocation, state);
                var previousLocation = _this.eventLocations[_this.currentIndex];
                _this.eventLocations[_this.currentIndex] = currentLocation;
                if (!areLocationsEqual(currentLocation, previousLocation)) {
                    state = state.currentBehavior.handlePointerEnter(event, currentLocation, state);
                }
                return state;
            });
        };
        this.handlePointerUp = function (event) {
            if (event.button !== 0 && event.button !== undefined)
                return;
            _this.updateState(function (state) {
                window.removeEventListener('pointerup', _this.handlePointerUp);
                window.removeEventListener('pointermove', _this.handlePointerMove);
                state.props.onContextMenu && window.removeEventListener('contextmenu', _this.handleContextMenu);
                var currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
                var currentTimestamp = new Date().valueOf();
                var secondLastTimestamp = _this.eventTimestamps[1 - _this.currentIndex];
                state = state.currentBehavior.handlePointerUp(event, currentLocation, state);
                if (event.pointerType !== 'mouse' &&
                    areLocationsEqual(currentLocation, _this.pointerDownLocation) &&
                    event.pointerType !== undefined &&
                    currentTimestamp - _this.eventTimestamps[_this.currentIndex] < 500 &&
                    (currentLocation.row.idx > 0 && currentLocation.column.idx > 0)) {
                    state = state.currentBehavior.handlePointerDown(event, currentLocation, state);
                }
                state = __assign({}, state, { currentBehavior: new DefaultBehavior() });
                if (currentTimestamp - secondLastTimestamp < 500 &&
                    areLocationsEqual(currentLocation, _this.eventLocations[0]) &&
                    areLocationsEqual(currentLocation, _this.eventLocations[1])) {
                    state = state.currentBehavior.handleDoubleClick(event, currentLocation, state);
                }
                if (event.pointerType !== 'mouse' &&
                    currentTimestamp - _this.eventTimestamps[_this.currentIndex] >= 500 &&
                    areLocationsEqual(currentLocation, _this.eventLocations[0]) &&
                    areLocationsEqual(currentLocation, _this.eventLocations[1])) {
                }
                state.hiddenFocusElement.focus();
                return state;
            });
        };
    }
    return PointerEventsController;
}());
export { PointerEventsController };