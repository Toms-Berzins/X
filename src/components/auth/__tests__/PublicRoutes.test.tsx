import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// For demonstration purposes, using dummy components.
// Replace with your actual Home and About page components if available.
const Home = () => (
  <div>
    <h1>Home</h1>
    <p>Welcome to the homepage.</p>
  </div>
);

const About = () => (
  <div>
    <h1>About</h1>
    <p>Learn more about us.</p>
  </div>
);


describe('Public Routes', () => {
  test('renders Home page for route "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
  });

  test('renders About page for route "/about"', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route path="/about" element={<About />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
  });
}); 