import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  className?: string;
  maxWidth?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  className,
  maxWidth = '200px',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (placement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Ensure tooltip stays within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));

    setPosition({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);

      return () => {
        window.removeEventListener('scroll', calculatePosition);
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isVisible]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const variants = {
    top: {
      initial: { opacity: 0, y: 4 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 4 },
    },
    right: {
      initial: { opacity: 0, x: -4 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -4 },
    },
    bottom: {
      initial: { opacity: 0, y: -4 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -4 },
    },
    left: {
      initial: { opacity: 0, x: 4 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 4 },
    },
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={clsx(
              'fixed z-50 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg dark:bg-gray-700',
              className
            )}
            style={{
              left: position.x,
              top: position.y,
              maxWidth,
            }}
            initial={variants[placement].initial}
            animate={variants[placement].animate}
            exit={variants[placement].exit}
            transition={{ duration: 0.2 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 