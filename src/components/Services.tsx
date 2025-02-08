import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useServices } from '@/hooks/useServices';
import type { Service } from '@/types/Service';
import { staggerContainerVariants, listItemVariants } from '@/config/animations';
import { MotionDiv, useAnimationConfig } from './providers/AnimationProvider';
import type { TargetAndTransition } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './shared/Button';

const Services: React.FC = () => {
  const { services, loading, error } = useServices();
  const { isEnabled, defaultTransition } = useAnimationConfig();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const navigate = useNavigate();

  const hoverAnimation: TargetAndTransition = {
    scale: 1.05,
    transition: defaultTransition
  };

  const tapAnimation: TargetAndTransition = {
    scale: 0.95,
    transition: defaultTransition
  };

  const handleGetStartedClick = () => {
    navigate('/quotes/new');
  };

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
    <section className="py-16 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        <MotionDiv
          className="text-3xl font-bold text-center mb-12"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView && isEnabled ? "visible" : "hidden"}
        >
          <h2 className="mb-4">Our Services</h2>
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGetStartedClick}
              className="animate-pulse"
            >
              Get a Free Quote Now
            </Button>
          </div>
        </MotionDiv>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <MotionDiv
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainerVariants}
            initial={isEnabled ? "hidden" : false}
            animate={isEnabled && inView ? "visible" : false}
            exit="exit"
            layout
          >
            {services.map((service: Service, index) => (
              <MotionDiv
                key={service.id}
                layoutId={`service-${service.id}`}
                className="bg-white p-8 rounded-lg shadow-lg transition-shadow hover:shadow-xl"
                variants={listItemVariants}
                whileHover={isEnabled ? hoverAnimation : undefined}
                whileTap={isEnabled ? tapAnimation : undefined}
                transition={{
                  layout: { duration: 0.3 },
                  ...defaultTransition,
                  delay: isEnabled ? 0.1 * index : 0
                }}
                role="article"
                aria-label={service.title}
              >
                <div 
                  className="text-4xl mb-4 flex justify-center" 
                  role="img" 
                  aria-label={`${service.title} icon`}
                >
                  {service.icon}
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-center">
                  {service.title}
                </h4>
                <p className="text-gray-600 text-center">
                  {service.description}
                </p>
              </MotionDiv>
            ))}
          </MotionDiv>
        )}
      </div>
    </section>
  );
};

export default Services; 