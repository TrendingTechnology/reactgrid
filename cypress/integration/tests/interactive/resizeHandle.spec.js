const Utils = require('../../common/utils');
// TODO to fix in lib
context('Resize', () => {
    beforeEach(() => {
        Utils.visit();
    });

    it('Should resize column', () => {
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 123, 10);
        for (let x = 123; x < 200; x += 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { clientX: 200, clientY: 10, force: true });
        cy.wait(200);
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 200, 10);
        for (let x = 200; x < 300; x += 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { clientX: 300, clientY: 10, force: true });
        cy.wait(200);
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 300, 10);
        for (let x = 300; x > 200; x -= 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { clientX: 200, clientY: 10, force: true });
        cy.wait(200);
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 200, 10);
        for (let x = 200; x > 123; x -= 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { clientX: 123, clientY: 10, force: true });
        cy.wait(200);
    });
})