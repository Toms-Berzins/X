import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[600px] bg-gray-900">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/assets/hero-image.jpg')" }}
      />
      <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-5xl font-bold mb-6">Premium Powder Coating Solutions</h2>
          <p className="text-xl mb-8">Transforming metal surfaces with durability and style.</p>
          <Link 
            to="/quote"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 