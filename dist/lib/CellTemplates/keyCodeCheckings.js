import { keyCodes } from '../Common/Constants';
export var isTextInput = function (keyCode) {
    return (keyCode >= keyCodes.ZERO && keyCode <= keyCodes.Z) ||
        (keyCode >= keyCodes.NUM_PAD_0 && keyCode <= keyCodes.DIVIDE) ||
        (keyCode >= keyCodes.SEMI_COLON && keyCode <= keyCodes.SINGLE_QUOTE) ||
        (keyCode == keyCodes.SPACE);
};
export var isNumberInput = function (keyCode) {
    return (keyCode >= keyCodes.ZERO && keyCode <= keyCodes.NINE) ||
        (keyCode >= keyCodes.NUM_PAD_0 && keyCode <= keyCodes.NUM_PAD_9);
};
export var isNavigationKey = function (e) {
    var currentTarget = e.currentTarget;
    return (e.keyCode == keyCodes.LEFT_ARROW && currentTarget.selectionStart > 0) ||
        (e.keyCode == keyCodes.RIGHT_ARROW && currentTarget.selectionStart < currentTarget.value.length) ||
        e.keyCode == keyCodes.END || e.keyCode == keyCodes.HOME ||
        e.keyCode == keyCodes.BACKSPACE || e.keyCode == keyCodes.DELETE;
};