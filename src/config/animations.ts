import type { Transition, Variants } from 'framer-motion';

// Shared transition configurations
export const transitions: Record<string, Transition> = {
  // Spring transition for natural-feeling animations
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
  
  // Smooth transition for subtle animations
  smooth: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  },
  
  // Quick transition for micro-interactions
  quick: {
    type: "tween",
    ease: "easeOut",
    duration: 0.2,
  },
};

// Fade animations
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Scale and fade animations
export const scaleFadeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.spring,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: transitions.quick,
  },
};

// Slide up and fade animations
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.spring,
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: transitions.quick,
  },
};

// Stagger children animations
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

// Hover and tap animations
export const interactiveHoverVariants: Variants = {
  initial: {},
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// List item animations (for use with staggerContainerVariants)
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.spring,
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: transitions.quick,
  },
};

// Modal animations
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: transitions.quick,
  },
};

// Modal overlay animations
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 0.5,
    transition: transitions.smooth,
  },
  exit: { 
    opacity: 0,
    transition: transitions.quick,
  },
}; 