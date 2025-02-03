/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-axe" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getByTestId('submit-button')
     */
    getByTestId(value: string): Chainable<JQuery<HTMLElement>>;
  }
} 