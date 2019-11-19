import { keyCodes } from '../Functions/keyCodes';

export const isAlphaNumericKey = (keyCode: number) =>
    (keyCode >= keyCodes.KEY_0 && keyCode <= keyCodes.KEY_Z) ||
    (keyCode >= keyCodes.NUMPAD_0 && keyCode <= keyCodes.DIVIDE) ||
    (keyCode >= keyCodes.SEMICOLON && keyCode <= keyCodes.SINGLE_QUOTE) ||
    (keyCode == keyCodes.SPACE);

export const inNumericKey = (keyCode: number) =>
    (keyCode >= keyCodes.KEY_0 && keyCode <= keyCodes.KEY_9) ||
    (keyCode >= keyCodes.NUMPAD_0 && keyCode <= keyCodes.NUMPAD_0);

export const isNavigationKey = (keyCode: number) =>
    (keyCode == keyCodes.LEFT_ARROW) ||
    (keyCode == keyCodes.RIGHT_ARROW) ||
    keyCode == keyCodes.UP_ARROW || keyCode == keyCodes.DOWN_ARROW ||
    keyCode == keyCodes.END || keyCode == keyCodes.HOME ||
    keyCode == keyCodes.BACKSPACE || keyCode == keyCodes.DELETE;
