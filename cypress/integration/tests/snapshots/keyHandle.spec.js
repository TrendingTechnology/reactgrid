// <reference types="Cypress" />
const Utils = require('../../common/utils');
const Constants = require('../../common/constants');

context('Keyboard', () => {
    beforeEach(() => {
        Utils.visit();
    });

    it('Arrows should navigate up/down/left/right', () => {
        Utils.selectCell(300, 100);
        cy.matchImageSnapshot('keyHandle-01');
        for (var i = 0; i < 4; i++) Utils.keyDown(Constants.keyCodes.ArrowUp, { force: true });
        cy.matchImageSnapshot('keyHandle-02');
        for (var i = 0; i < 4; i++) Utils.keyDown(Constants.keyCodes.ArrowDown, { force: true });
        cy.matchImageSnapshot('keyHandle-03');
        for (var i = 0; i < 2; i++) Utils.keyDown(Constants.keyCodes.ArrowLeft, { force: true });
        cy.matchImageSnapshot('keyHandle-04');
        for (var i = 0; i < 4; i++) Utils.keyDown(Constants.keyCodes.ArrowRight, { force: true });
        cy.matchImageSnapshot('keyHandle-05');
    });

    it('TAB navigate to next cell, Shift + TAB navigate to previous cell', () => {
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-06');
        for (var i = 0; i < 7; i++) Utils.keyDown(Constants.keyCodes.Tab, { force: true });
        cy.matchImageSnapshot('keyHandle-07');
        for (var i = 0; i < 8; i++) Utils.keyDown(Constants.keyCodes.Tab, { shiftKey: true, force: true });
        cy.matchImageSnapshot('keyHandle-08');
    });

    it('Navigate inside selected range shift tab/enter or only tab/enter', () => {
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-09');
        for (var i = 0; i < 2; i++) Utils.keyDown(Constants.keyCodes.ArrowDown, { shiftKey: true, force: true });
        cy.matchImageSnapshot('keyHandle-10');
        Utils.keyDown(Constants.keyCodes.ArrowRight, { shiftKey: true, force: true }, 50);
        cy.matchImageSnapshot('keyHandle-11');
        Utils.selectCell(500, 200, { ctrlKey: true });
        cy.matchImageSnapshot('keyHandle-12');
        for (var i = 0; i < 2; i++) Utils.keyDown(Constants.keyCodes.ArrowDown, { shiftKey: true, force: true }, 50);
        cy.matchImageSnapshot('keyHandle-13');
        Utils.keyDown(Constants.keyCodes.ArrowRight, { shiftKey: true, force: true }, 50);
        cy.matchImageSnapshot('keyHandle-14');
        Utils.selectCell(200, 500, { ctrlKey: true });
        cy.matchImageSnapshot('keyHandle-15');
        for (var i = 0; i < 2; i++) Utils.keyDown(Constants.keyCodes.ArrowDown, { shiftKey: true, force: true }, 50);
        cy.matchImageSnapshot('keyHandle-16');
        Utils.keyDown(Constants.keyCodes.ArrowRight, { shiftKey: true, force: true }, 50);
        cy.matchImageSnapshot('keyHandle-17');
        for (var i = 0; i < 18; i++) Utils.keyDown(Constants.keyCodes.Tab, { force: true }, 50);
        cy.matchImageSnapshot('keyHandle-18');
        for (var i = 0; i < 18; i++) Utils.keyDown(Constants.keyCodes.Tab, { shiftKey: true, force: true }, 50);
        cy.matchImageSnapshot('keyHandle-19');
        for (var i = 0; i < 18; i++) Utils.keyDown(Constants.keyCodes.Enter, { force: true }, 50);
        cy.matchImageSnapshot('keyHandle-20');
        for (var i = 0; i < 18; i++) Utils.keyDown(Constants.keyCodes.Enter, { shiftKey: true, force: true }, 50);
        cy.matchImageSnapshot('keyHandle-21');
    });

    it('Enter key pressed should activate cell edit mode', () => {
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-22');
        cy.wait(500);
        Utils.keyDown(Constants.keyCodes.Enter, { force: true });
        cy.matchImageSnapshot('keyHandle-23');
        cy.focused().type(Utils.randomText(), { force: true });
        cy.matchImageSnapshot('keyHandle-24');
    });

    it('Escape key pressed should exit from edit mode without changes', () => {
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-25');
        cy.wait(500);
        Utils.keyDown(Constants.keyCodes.Enter, { force: true });
        cy.matchImageSnapshot('keyHandle-26');
        cy.focused().type(Utils.randomText(), { force: true });
        cy.matchImageSnapshot('keyHandle-27');
        cy.wait(500);
        Utils.keyDown(Constants.keyCodes.Esc, { force: true });
        cy.matchImageSnapshot('keyHandle-28');
    });

    it('Delete key pressed should delete data from the cell ', () => {
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-29');
        Utils.keyDown(Constants.keyCodes.Enter, { force: true });
        cy.matchImageSnapshot('keyHandle-30');
        cy.focused().type(Utils.randomText(), { force: true });
        cy.matchImageSnapshot('keyHandle-31');
        Utils.selectCell(200, 200);
        cy.matchImageSnapshot('keyHandle-32');
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-33');
        Utils.keyDown(Constants.keyCodes.Delete, { force: true });
        cy.matchImageSnapshot('keyHandle-34');
    });

    it('Backspace key pressed should delete data from the cell', () => {
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-35');
        Utils.keyDown(Constants.keyCodes.Enter, { force: true });
        cy.matchImageSnapshot('keyHandle-36');
        cy.focused().type(Utils.randomText(), { force: true });
        cy.matchImageSnapshot('keyHandle-37');
        Utils.selectCell(200, 200);
        cy.matchImageSnapshot('keyHandle-38');
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-39');
        Utils.keyDown(Constants.keyCodes.Backspace, { force: true });
        cy.matchImageSnapshot('keyHandle-40');
    });

    it('Tab key pressed should exit from cell edit mode and move to next column ', () => {
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-41');
        Utils.keyDown(Constants.keyCodes.Enter, { force: true });
        cy.matchImageSnapshot('keyHandle-42');
        cy.focused().type(Utils.randomText(), { force: true });
        cy.matchImageSnapshot('keyHandle-43');
        Utils.keyDown(Constants.keyCodes.Tab, { force: true });
        cy.matchImageSnapshot('keyHandle-44');
    });

    it('Shift + Tab key pressed should exit from cell edit mode and move to previous column ', () => {
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-45');
        Utils.keyDown(Constants.keyCodes.Enter, { force: true });
        cy.matchImageSnapshot('keyHandle-46');
        cy.focused().type(Utils.randomText(), { force: true });
        cy.matchImageSnapshot('keyHandle-47');
        Utils.keyDown(Constants.keyCodes.Tab, { shiftKey: true, force: true });
        cy.matchImageSnapshot('keyHandle-48');
    });

    it('Enter key pressed should exit from cell edit mode and move to next row', () => {
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-49');
        Utils.keyDown(Constants.keyCodes.Enter, { force: true });
        cy.matchImageSnapshot('keyHandle-50');
        cy.focused().type(Utils.randomText(), { force: true });
        cy.matchImageSnapshot('keyHandle-51');
        Utils.keyDown(Constants.keyCodes.Enter, { force: true });
        cy.matchImageSnapshot('keyHandle-52');
    });

    it('Shift + Enter key pressed should exit from cell edit mode and move to previous row', () => {
        Utils.selectCell(200, 100);
        cy.matchImageSnapshot('keyHandle-53');
        Utils.keyDown(Constants.keyCodes.Enter, { force: true });
        cy.matchImageSnapshot('keyHandle-54');
        cy.focused().type(Utils.randomText(), { force: true });
        cy.matchImageSnapshot('keyHandle-55');
        Utils.keyDown(Constants.keyCodes.Enter, { shiftKey: true, force: true });
        cy.matchImageSnapshot('keyHandle-56');
    });
});
