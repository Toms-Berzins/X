import React from 'react';
import { motion } from 'framer-motion';

interface ImageModalProps {
  image: {
    title: string;
    image: string;
    description: string;
  } | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const handleModalClick = (e: React.MouseEvent<Element>) => {
    e.stopPropagation();
  };

  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden"
        onClick={handleModalClick}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img
          src={image.image}
          alt={image.title}
          className="w-full h-auto"
        />
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {image.title}
          </h3>
          <p className="text-gray-600">{image.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}; 