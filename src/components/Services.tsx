import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useServices } from '@/hooks/useServices.js';
import type { Service } from '@/types/Service.js';

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { services, loading, error } = useServices();

  // Use Intersection Observer to trigger lazy loading
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing once visible
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>Error loading services. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50" ref={containerRef}>
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service: Service) => (
              <motion.article
                key={service.id}
                className="bg-white p-8 rounded-lg shadow-lg transition-transform hover:shadow-xl"
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.3 }}
                aria-label={service.title}
              >
                <div 
                  className="text-4xl mb-4 flex justify-center" 
                  role="img" 
                  aria-label={service.title}
                >
                  {service.icon}
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-center">{service.title}</h4>
                <p className="text-gray-600 text-center">{service.description}</p>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services; 