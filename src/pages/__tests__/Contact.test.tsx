import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Contact } from '../Contact';
import { BrowserRouter } from 'react-router-dom';

// Mock the fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Contact Component', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  const renderContact = () => {
    return render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );
  };

  it('renders contact form with all required fields', () => {
    renderContact();
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('displays validation errors for empty required fields', async () => {
    renderContact();
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/service selection is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it('successfully submits form with valid data', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Message sent successfully' }),
      })
    );

    renderContact();

    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
    await userEvent.selectOptions(screen.getByLabelText(/service/i), 'residential');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test message content');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        service: 'residential',
        message: 'Test message content',
      }),
    });
  });

  it('handles API errors gracefully', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error('API Error'))
    );

    renderContact();

    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
    await userEvent.selectOptions(screen.getByLabelText(/service/i), 'residential');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test message content');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to submit form/i)).toBeInTheDocument();
    });
  });
}); 