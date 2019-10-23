// <reference types="Cypress" />
const Utils = require('../../common/utils');
const Constants = require('../../common/constants');
context('Selection', () => {
    beforeEach(() => {
        Utils.visit();
    });

    it('Select one cell in click (without ctrl key)', () => {
        Utils.selectCell(150, 150);
        cy.matchImageSnapshot('selection-01');
        Utils.selectCell(150, 250);
        cy.matchImageSnapshot('selection-02');
        Utils.selectCell(250, 150);
        cy.matchImageSnapshot('selection-03');
        Utils.selectCell(350, 350);
        cy.matchImageSnapshot('selection-04');
        Utils.selectCell(500, 150);
        cy.matchImageSnapshot('selection-05');
        Utils.selectCell(150, 150);
        cy.matchImageSnapshot('selection-06');
    });

    it('Select many cell in many direction by pointermove move (up/down/right/left)', () => {
        Utils.selectRange(150, 300, 550, 100);
        cy.matchImageSnapshot('selection-07');
        Utils.selectRange(300, 300, 550, 500);
        cy.matchImageSnapshot('selection-08');
        Utils.selectRange(350, 300, 150, 500);
        cy.matchImageSnapshot('selection-09');
        Utils.selectRange(350, 300, 150, 100);
        cy.matchImageSnapshot('selection-10');
    });

    it('Select many ranges with ctrl', () => {
        Utils.selectRange(350, 300, 550, 100, { ctrlKey: true });
        cy.matchImageSnapshot('selection-11');
        Utils.selectRange(450, 400, 650, 500, { ctrlKey: true });
        cy.matchImageSnapshot('selection-12');
        Utils.selectRange(250, 400, 150, 100, { ctrlKey: true });
        cy.matchImageSnapshot('selection-13');
    });

    it('Select one column', () => {
        Utils.selectCell(100, 10);
        cy.matchImageSnapshot('selection-14');
        Utils.selectCell(450, 10);
        cy.matchImageSnapshot('selection-15');
        Utils.selectCell(700, 10);
        cy.matchImageSnapshot('selection-16');
    });

    it('Select columns with ctrl', () => {
        Utils.selectCell(100, 10);
        cy.matchImageSnapshot('selection-17');
        Utils.selectCell(450, 10, { ctrlKey: true });
        cy.matchImageSnapshot('selection-18');
        Utils.selectCell(700, 10, { ctrlKey: true });
        cy.matchImageSnapshot('selection-19');
    });

    it('Select many colums', () => {
        Utils.selectRange(100, 10, 500, 10);
        cy.matchImageSnapshot('selection-20');
    });

    it('Select one row', () => {
        Utils.selectCell(10, 50);
        cy.matchImageSnapshot('selection-21');
        Utils.selectCell(10, 200);
        cy.matchImageSnapshot('selection-22');
        Utils.selectCell(10, 500);
        cy.matchImageSnapshot('selection-23');
    });

    it('Select rows with ctrl', () => {
        Utils.selectCell(10, 50);
        cy.matchImageSnapshot('selection-24');
        Utils.selectCell(10, 200, { ctrlKey: true });
        cy.matchImageSnapshot('selection-25');
        Utils.selectCell(10, 500, { ctrlKey: true });
        cy.matchImageSnapshot('selection-26');
    });

    it('Select many rows', () => {
        Utils.selectRange(10, 50, 10, 500);
        cy.matchImageSnapshot('selection-27')
    });

    it('Select many one cell ranges, ctrl key pressed', () => {
        Utils.selectCell(500, 100);
        cy.matchImageSnapshot('selection-28');
        Utils.selectCell(500, 200, { ctrlKey: true });
        cy.matchImageSnapshot('selection-29');
        Utils.selectCell(200, 140, { ctrlKey: true });
        cy.matchImageSnapshot('selection-30');
        Utils.selectCell(600, 350, { ctrlKey: true });
        cy.matchImageSnapshot('selection-31');
    });

    it('Select one range, selection range should be changed, shift key pressed', () => {
        Utils.selectCell(500, 100);
        cy.matchImageSnapshot('selection-32');
        Utils.selectCell(200, 140, { shiftKey: true });
        cy.matchImageSnapshot('selection-33');
        Utils.selectCell(500, 300, { shiftKey: true });
        cy.matchImageSnapshot('selection-34');
        Utils.selectCell(800, 140, { shiftKey: true });
        cy.matchImageSnapshot('selection-35');
        Utils.selectCell(500, 40, { shiftKey: true });
        cy.matchImageSnapshot('selection-36');
    });

    it('Shift key pressed + arrows should resize selection range', () => {
        Utils.selectCell(300, 250);
        cy.matchImageSnapshot('selection-37');
        for (var i = 0; i < 3; i++) Utils.keyDown(Constants.keyCodes.ArrowUp, { shiftKey: true, force: true });
        cy.matchImageSnapshot('selection-38');
        for (var i = 0; i < 2; i++) Utils.keyDown(Constants.keyCodes.ArrowRight, { shiftKey: true, force: true });
        cy.matchImageSnapshot('selection-39');
        for (var i = 0; i < 4; i++) Utils.keyDown(Constants.keyCodes.ArrowLeft, { shiftKey: true, force: true });
        cy.matchImageSnapshot('selection-40');
        for (var i = 0; i < 6; i++) Utils.keyDown(Constants.keyCodes.ArrowDown, { shiftKey: true, force: true });
        cy.matchImageSnapshot('selection-41');
    });
});
