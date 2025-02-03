import React from 'react';

interface Service {
  title: string;
  description: string;
  icon: string;
}

const services: Service[] = [
  {
    title: "Industrial Coating",
    description: "High-performance coatings for industrial applications, ensuring maximum durability and protection.",
    icon: "🏭"
  },
  {
    title: "Automotive Coating",
    description: "Durable and attractive finishes for automotive parts, with perfect color matching and superior finish.",
    icon: "🚗"
  },
  {
    title: "Custom Coating",
    description: "Tailored solutions for unique design requirements, with a wide range of colors and textures.",
    icon: "🎨"
  },
];

const Services: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h4 className="text-2xl font-semibold mb-4">{service.title}</h4>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services; 