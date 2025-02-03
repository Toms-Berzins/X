import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../Layout';

const renderLayout = (children: React.ReactNode = null) => {
  return render(
    <BrowserRouter>
      <Layout>{children}</Layout>
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  it('renders header with navigation links', () => {
    renderLayout();

    // Check for logo and navigation links
    expect(screen.getByText(/powderpro/i)).toBeInTheDocument();
    expect(screen.getByText(/services/i)).toBeInTheDocument();
    expect(screen.getByText(/gallery/i)).toBeInTheDocument();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  it('renders footer with company information', () => {
    renderLayout();

    // Check for footer sections
    expect(screen.getByText(/professional powder coating services/i)).toBeInTheDocument();
    expect(screen.getByText(/quick links/i)).toBeInTheDocument();
    expect(screen.getByText(/contact us/i)).toBeInTheDocument();

    // Check for contact information
    expect(screen.getByText(/123 powder street/i)).toBeInTheDocument();
    expect(screen.getByText(/coating city, st 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/\(555\) 123-4567/i)).toBeInTheDocument();
    expect(screen.getByText(/info@powderpro\.com/i)).toBeInTheDocument();
  });

  it('renders children content', () => {
    const testContent = 'Test Content';
    renderLayout(<div>{testContent}</div>);

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('renders mobile menu button on small screens', () => {
    renderLayout();

    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });
}); 