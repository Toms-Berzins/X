import React from 'react';
import { LazyMotion, domAnimation, AnimatePresence, m } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface AnimationProviderProps {
  children: React.ReactNode;
}

export const useAnimationConfig = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return {
    isEnabled: !prefersReducedMotion,
    defaultTransition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: prefersReducedMotion ? 0 : undefined,
    },
  };
};

export const MotionDiv = m.div;
export const MotionButton = m.button;
export const MotionSpan = m.span;

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </LazyMotion>
  );
}; 