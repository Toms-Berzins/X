import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

interface TooltipProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  delay = 200,
  className = '',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let left = 0;
    let top = 0;

    switch (placement) {
      case 'top':
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        top = triggerRect.top + scrollY - tooltipRect.height - 8;
        break;
      case 'right':
        left = triggerRect.right + scrollX + 8;
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case 'bottom':
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        top = triggerRect.bottom + scrollY + 8;
        break;
      case 'left':
        left = triggerRect.left + scrollX - tooltipRect.width - 8;
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        break;
    }

    setPosition({ left, top });
  }, [placement]);

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, calculatePosition]);

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

  const getMotionVariants = () => {
    const variants = {
      top: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
      },
      right: {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -10 },
      },
      bottom: {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
      },
      left: {
        initial: { opacity: 0, x: 10 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 10 },
      },
    };

    return variants[placement];
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={classNames(
              'fixed z-50 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg dark:bg-gray-700',
              className
            )}
            style={{
              left: position.left,
              top: position.top,
              maxWidth: '200px',
            }}
            {...getMotionVariants()}
            transition={{ duration: 0.2 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 
