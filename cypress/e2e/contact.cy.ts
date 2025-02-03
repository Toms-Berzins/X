describe('Contact Form', () => {
  beforeEach(() => {
    cy.visit('/contact');
  });

  it('should display validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();

    cy.contains('Name must be at least 2 characters long').should('be.visible');
    cy.contains('Invalid email address').should('be.visible');
    cy.contains('Service selection is required').should('be.visible');
    cy.contains('Message must be at least 10 characters long').should('be.visible');
  });

  it('should successfully submit the form with valid data', () => {
    // Intercept API call
    cy.intercept('POST', '/api/contact', {
      statusCode: 200,
      body: { message: 'Message sent successfully' },
    }).as('submitForm');

    // Fill out the form
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="phone"]').type('1234567890');
    cy.get('select[name="service"]').select('residential');
    cy.get('textarea[name="message"]').type('This is a test message for the powder coating service.');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for API call
    cy.wait('@submitForm');

    // Check success message
    cy.contains('Thank you for your message').should('be.visible');

    // Verify form is reset
    cy.get('input[name="name"]').should('have.value', '');
    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="phone"]').should('have.value', '');
    cy.get('select[name="service"]').should('have.value', '');
    cy.get('textarea[name="message"]').should('have.value', '');
  });

  it('should handle API errors gracefully', () => {
    // Intercept API call with error
    cy.intercept('POST', '/api/contact', {
      statusCode: 500,
      body: { message: 'Failed to send message' },
    }).as('submitFormError');

    // Fill out the form
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="phone"]').type('1234567890');
    cy.get('select[name="service"]').select('residential');
    cy.get('textarea[name="message"]').type('This is a test message for the powder coating service.');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for API call
    cy.wait('@submitFormError');

    // Check error message
    cy.contains('Failed to submit form').should('be.visible');
  });

  it('should be accessible', () => {
    // Check for ARIA labels and roles
    cy.get('form').should('have.attr', 'role', 'form');
    cy.get('input[name="name"]').should('have.attr', 'aria-required', 'true');
    cy.get('input[name="email"]').should('have.attr', 'aria-required', 'true');
    cy.get('select[name="service"]').should('have.attr', 'aria-required', 'true');
    cy.get('textarea[name="message"]').should('have.attr', 'aria-required', 'true');

    // Run accessibility audit
    cy.injectAxe();
    cy.checkA11y();
  });
}); 