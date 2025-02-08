import React, { memo } from 'react';
import { motion, Variants } from 'framer-motion';
import { Wrench, Paintbrush2, Droplets, Shield, Palette, Award } from 'lucide-react';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: <Paintbrush2 className="w-8 h-8" aria-hidden="true" />,
    title: 'Custom Powder Coating',
    description: 'Professional powder coating services for all types of metal surfaces with a wide range of colors and finishes.',
  },
  {
    icon: <Palette className="w-8 h-8" aria-hidden="true" />,
    title: 'Color Matching',
    description: 'Precise color matching services to ensure your project matches existing colors or specific requirements.',
  },
  {
    icon: <Wrench className="w-8 h-8" aria-hidden="true" />,
    title: 'Surface Preparation',
    description: 'Thorough surface preparation including sandblasting, chemical cleaning, and pretreatment for optimal coating adhesion.',
  },
  {
    icon: <Shield className="w-8 h-8" aria-hidden="true" />,
    title: 'Protective Coatings',
    description: 'Specialized protective coatings for enhanced durability, weather resistance, and corrosion protection.',
  },
  {
    icon: <Droplets className="w-8 h-8" aria-hidden="true" />,
    title: 'Custom Finishes',
    description: 'Various finish options including matte, gloss, textured, and metallic effects to suit your needs.',
  },
  {
    icon: <Award className="w-8 h-8" aria-hidden="true" />,
    title: 'Quality Assurance',
    description: 'Rigorous quality control and testing to ensure long-lasting, durable finishes that meet industry standards.',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = memo(({ service, index }) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
    >
      <div className="text-primary-600 dark:text-primary-400 mb-4">
        {service.icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {service.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {service.description}
      </p>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Professional powder coating services tailored to your needs, with quality and durability guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Contact us today to discuss your powder coating project.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Get a Quote
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ServicesPage;
