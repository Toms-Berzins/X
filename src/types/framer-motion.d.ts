import { ForwardRefComponent, HTMLMotionProps } from 'framer-motion';

declare module 'framer-motion' {
  export interface MotionProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
  }

  export interface HTMLMotionProps<T> extends React.HTMLAttributes<T> {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<T, MouseEvent>) => void;
  }

  export interface ForwardRefComponent<T> {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<T, MouseEvent>) => void;
  }
} 