// <reference types="Cypress" />
const Utils = require('../../common/utils');

context('Filling', () => {
    beforeEach(() => {
        Utils.visit();
    });

    it('Fill handle by one cell should duplicate last record value', () => {
        Utils.selectCell(400, 200);
        cy.matchImageSnapshot('fillHandle-01');
        Utils.fillCells(400, 100);
        cy.matchImageSnapshot('fillHandle-02');
        Utils.fillCells(600, 200);
        cy.matchImageSnapshot('fillHandle-03');
        Utils.fillCells(400, 300);
        cy.matchImageSnapshot('fillHandle-04');
        Utils.fillCells(200, 200);
        cy.matchImageSnapshot('fillHandle-05');
    });

    it('Fill handle by range should duplicate last record value', () => {
        Utils.selectRange(400, 200, 500, 300);
        cy.matchImageSnapshot('fillHandle-06');
        Utils.fillCells(500, 100);
        cy.matchImageSnapshot('fillHandle-07');
        Utils.fillCells(700, 300);
        cy.matchImageSnapshot('fillHandle-08');
        Utils.fillCells(500, 500);
        cy.matchImageSnapshot('fillHandle-09');
        Utils.fillCells(200, 300);
        cy.matchImageSnapshot('fillHandle-10');
    });
});
