import React from 'react';

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
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 