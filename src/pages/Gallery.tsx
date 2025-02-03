import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Work
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our portfolio of completed powder coating projects.
            From automotive parts to architectural elements, discover the
            possibilities of powder coating.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImage(null)}
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
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-auto"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedImage.title}
                  </h3>
                  <p className="text-gray-600">{selectedImage.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const categories = [
  { value: 'all', label: 'All Projects' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
];

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Custom Wheel Refinishing',
    category: 'automotive',
    image: '/images/gallery/wheels.jpg',
    description: 'Custom powder coated wheels with a metallic finish.',
  },
  {
    id: 2,
    title: 'Outdoor Furniture Set',
    category: 'residential',
    image: '/images/gallery/furniture.jpg',
    description: 'Restored patio furniture with weather-resistant coating.',
  },
  {
    id: 3,
    title: 'Store Display Units',
    category: 'commercial',
    image: '/images/gallery/retail.jpg',
    description: 'Custom retail display fixtures with durable finish.',
  },
  {
    id: 4,
    title: 'Industrial Equipment',
    category: 'industrial',
    image: '/images/gallery/equipment.jpg',
    description: 'Heavy machinery components with protective coating.',
  },
  {
    id: 5,
    title: 'Architectural Railings',
    category: 'commercial',
    image: '/images/gallery/railings.jpg',
    description: 'Custom powder coated railings for commercial building.',
  },
  {
    id: 6,
    title: 'Engine Components',
    category: 'automotive',
    image: '/images/gallery/engine.jpg',
    description: 'High-temperature resistant coating for engine parts.',
  },
  {
    id: 7,
    title: 'Garden Gates',
    category: 'residential',
    image: '/images/gallery/gates.jpg',
    description: 'Decorative garden gates with weather-resistant finish.',
  },
  {
    id: 8,
    title: 'Manufacturing Equipment',
    category: 'industrial',
    image: '/images/gallery/manufacturing.jpg',
    description: 'Industrial machinery with protective coating.',
  },
  {
    id: 9,
    title: 'Custom Motorcycle Parts',
    category: 'automotive',
    image: '/images/gallery/motorcycle.jpg',
    description: 'Custom powder coated motorcycle components.',
  },
]; 