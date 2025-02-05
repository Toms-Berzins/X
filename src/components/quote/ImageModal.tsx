import { Dialog } from '@headlessui/react';
import type { QuoteImage } from '@/types/Quote';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: QuoteImage[];
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  images,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Quote Images
            </Dialog.Title>
          </div>
          <div className="p-6">
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="aspect-square relative group">
                    <img
                      src={image.url}
                      alt={image.caption || `Quote image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {image.caption && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <p className="text-white text-sm">{image.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No images available
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 