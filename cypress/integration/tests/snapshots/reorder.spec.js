const Utils = require('../../common/utils');
context('Reorder', () => {
    beforeEach(() => {
        Utils.visit();
    });

    it('Should reorder column to right', () => {
        Utils.selectCell(100, 10);
        cy.matchImageSnapshot('reorder-01');
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 100, 10);
        for (let x = 100; x < 400; x += 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-02');
        cy.wait(200);
    });

    it('Should reorder column to left', () => {
        Utils.selectCell(450, 10);
        cy.matchImageSnapshot('reorder-03');
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 450, 10);
        for (let x = 450; x > 100; x -= 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-04');
        cy.wait(200);
    });

    it('Should select more columns and reorder to right', () => {
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 100, 10);
        for (let x = 100; x < 300; x += 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-05');

        cy.get('[data-cy=react-grid]').trigger('pointerdown', 100, 10);
        for (let x = 100; x < 700; x += 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-06');
        cy.wait(200);
    });

    it('Should select more columns and reorder to left', () => {
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 700, 10);
        for (let x = 700; x > 400; x -= 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-07');

        cy.get('[data-cy=react-grid]').trigger('pointerdown', 700, 10);
        for (let x = 700; x > 100; x -= 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-08');
        cy.wait(200);
    });

    it('Should select more columns and reorder to right', () => {
        Utils.selectCell(100, 10);
        cy.matchImageSnapshot('reorder-09');
        Utils.selectCell(300, 10, { ctrlKey: true });
        cy.matchImageSnapshot('reorder-10');
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 300, 10);
        for (let x = 300; x < 700; x += 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-11');
        cy.wait(200);
    });

    it('Should select more columns and reorder to left', () => {
        Utils.selectCell(700, 10);
        cy.matchImageSnapshot('reorder-12');
        Utils.selectCell(450, 10, { ctrlKey: true });
        cy.matchImageSnapshot('reorder-13');
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 450, 10);
        for (let x = 450; x > 100; x -= 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', x, 10);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-14');
        cy.wait(200);
    });

    it('Should reorder one row to bottom', () => {
        Utils.selectCell(100, 40);
        cy.matchImageSnapshot('reorder-15');
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 100, 40);
        for (let y = 100; y < 300; y += 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', 10, y);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-16');
        cy.wait(200);
    });

    it('Should reorder one row to top', () => {
        Utils.selectCell(100, 300);
        cy.matchImageSnapshot('reorder-17');
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 100, 300);
        for (let y = 300; y > 100; y -= 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', 10, y);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-18');
        cy.wait(200);
    });

    it('Should select more rows and reorder to bottom', () => {
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 100, 40);
        for (let y = 100; y < 200; y += 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', 10, y);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-19');
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 100, 40);
        for (let y = 100; y < 300; y += 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', 10, y);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-20');
        cy.wait(200);
    });

    it('Should select more rows and reorder to top', () => {
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 100, 500);
        for (let y = 500; y > 400; y -= 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', 10, y);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-21');
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 100, 500);
        for (let y = 500; y > 300; y -= 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', 10, y);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-22');
        cy.wait(200);
    });

    it('Should select more rows and reorder to bottom', () => {
        Utils.selectCell(100, 40);
        cy.matchImageSnapshot('reorder-23');
        Utils.selectCell(100, 200, { ctrlKey: true });
        cy.matchImageSnapshot('reorder-24');
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 100, 200);
        for (let y = 200; y < 400; y += 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', 10, y);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-25');
        cy.wait(200);
    });

    it('Should select more rows and reorder to top', () => {
        Utils.selectCell(100, 500);
        cy.matchImageSnapshot('reorder-26');
        Utils.selectCell(100, 340, { ctrlKey: true });
        cy.matchImageSnapshot('reorder-27');
        cy.get('[data-cy=react-grid]').trigger('pointerdown', 100, 340);
        for (let y = 340; y > 100; y -= 10) {
            cy.get('[data-cy=react-grid]').trigger('pointermove', 10, y);
        }
        cy.get('[data-cy=react-grid]').trigger('pointerup', { force: true });
        cy.matchImageSnapshot('reorder-28');
        cy.wait(200);
    });
})