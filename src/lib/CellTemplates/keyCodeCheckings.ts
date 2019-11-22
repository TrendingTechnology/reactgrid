import { keyCodes } from '../Functions/keyCodes';

export const isAlphaNumericKey = (keyCode: number) =>
    (keyCode >= keyCodes.KEY_0 && keyCode <= keyCodes.KEY_Z) || 
    isNumpadNumericKey(keyCode) ||
    (keyCode >= keyCodes.MULTIPLY && keyCode <= keyCodes.DIVIDE) ||
    (keyCode >= keyCodes.SEMICOLON && keyCode <= keyCodes.SINGLE_QUOTE) ||
    (keyCode == keyCodes.SPACE);

export const inNumericKey = (keyCode: number) =>
    (keyCode >= keyCodes.KEY_0 && keyCode <= keyCodes.KEY_9) || isNumpadNumericKey(keyCode);

export const isNumpadNumericKey = (keyCode: number) => (keyCode >= keyCodes.NUMPAD_0 && keyCode <= keyCodes.NUMPAD_9);

// ... TODO find better name
export const isAllowedOnNumberTypingKey = (keyCode: number) => 
    (keyCode >= keyCodes.COMMA && keyCode <= keyCodes.PERIOD || 
    keyCode === keyCodes.DECIMAL);

export const isNavigationKey = (keyCode: number) =>
    (keyCode == keyCodes.LEFT_ARROW) ||
    (keyCode == keyCodes.RIGHT_ARROW) ||
    keyCode == keyCodes.UP_ARROW || keyCode == keyCodes.DOWN_ARROW ||
    keyCode == keyCodes.END || keyCode == keyCodes.HOME ||
    keyCode == keyCodes.BACKSPACE || keyCode == keyCodes.DELETE;
