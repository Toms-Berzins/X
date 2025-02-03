import '@testing-library/cypress/add-commands';
import 'cypress-axe';

// Add custom commands here if needed
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
}); 