import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { QuoteData } from '../../pages/Quote';
import { useAuth } from '../../contexts/AuthContext';
import { useQuoteOperations } from '../../hooks/useQuoteOperations';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image as ImageIcon, FileText, PenTool, Loader2 } from 'lucide-react';

interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'document' | 'drawing';
  progress: number;
}

interface QuoteStep4Props {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onBack: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_DOC_TYPES = ['application/pdf', '.dwg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const QuoteStep4: React.FC<QuoteStep4Props> = ({
  quoteData,
  onUpdate,
  onBack,
}) => {
  const { currentUser } = useAuth();
  const { createQuote, loading: saveLoading, error: saveError } = useQuoteOperations();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        setError('File size should not exceed 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const fileType = ACCEPTED_IMAGE_TYPES.includes(file.type) 
          ? 'image' 
          : ACCEPTED_DOC_TYPES.includes(file.type)
          ? 'document'
          : 'drawing';

        setUploadedFiles(prev => [...prev, {
          file,
          preview: fileType === 'image' ? reader.result as string : '',
          type: fileType,
          progress: 0
        }]);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadedFiles(prev => 
            prev.map(f => 
              f.file === file 
                ? { ...f, progress: Math.min(progress, 100) }
                : f
            )
          );
          if (progress >= 100) clearInterval(interval);
        }, 200);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ACCEPTED_IMAGE_TYPES,
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/x-autocad': ['.dwg'],
    },
    multiple: true
  });

  const removeFile = (file: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create the quote in Firebase
      const quoteId = await createQuote({
        ...quoteData,
        status: 'pending',
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes,
        },
      });

      if (quoteId) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          notes: '',
        });
      }
    } catch (err: any) {
      console.error('Failed to submit quote:', err);
      setError(err.message || 'Failed to submit quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Drawing canvas functionality
  const startDrawing = () => {
    setCurrentDrawing('');
    // Initialize canvas drawing here
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in or create an account to submit your quote request.
            Your quote details will be saved.
          </p>
          <div className="space-y-4">
            <Link
              to="/login"
              state={{ from: '/quote' }}
              className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              state={{ from: '/quote' }}
              className="block w-full bg-white text-gray-900 px-6 py-3 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Your quote details will be preserved when you return after signing in.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 48 48"
        >
          <circle
            className="opacity-25"
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M16.707 22.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l12-12a1 1 0 10-1.414-1.414L22 27.586l-5.293-5.293z"
          />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Quote Submitted!</h2>
        <p className="mt-2 text-gray-600">
          We'll review your quote and get back to you within 24 hours.
        </p>
        <p className="mt-1 text-gray-600">
          A confirmation email has been sent to {formData.email}
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            View Quote in Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review & Submit</h2>
        <p className="text-gray-600 mb-6">
          Please review your quote details and provide your contact information.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Any special requirements or questions?"
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Supporting Files</h3>
            <p className="text-gray-600">
              Help us better understand your project by uploading relevant files:
            </p>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              <li>Photos of your space or inspiration images</li>
              <li>Existing floor plans or measurements (PDF, DOCX)</li>
              <li>Technical drawings or CAD files (DWG)</li>
            </ul>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6" {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">
                {isDragActive
                  ? "Drop the files here..."
                  : "Drag 'n' drop files here, or click to select files"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports images (JPG, PNG), documents (PDF, DOCX), and CAD files (DWG)
              </p>
            </div>
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="border rounded-lg p-4 bg-white">
                    <button
                      type="button"
                      onClick={() => removeFile(file.file)}
                      className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    {file.type === 'image' ? (
                      <img
                        src={file.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded">
                        {file.type === 'document' ? (
                          <FileText className="h-8 w-8 text-gray-400" />
                        ) : (
                          <PenTool className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 truncate">{file.file.name}</p>
                      {file.progress < 100 ? (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      ) : (
                        <p className="text-xs text-green-600 mt-1">Upload complete</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              I agree to the terms and conditions
            </label>
            <p className="text-gray-500">
              By submitting this quote, you agree to our{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="bg-white text-gray-700 px-6 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading || saveLoading}
            className="bg-indigo-600 text-white px-8 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
          >
            {loading || saveLoading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Submitting...
              </span>
            ) : (
              'Submit Quote'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}; 