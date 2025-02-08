import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import type { QuoteContactInfo } from '@/types/Quote';
import { AuthContext } from '@/contexts/AuthContext';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileText, PenTool, AlertCircle } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { 
  validateContactInfo, 
  getInputClasses, 
  labelClasses, 
  TouchedFields,
  ValidationError 
} from '@/utils/formValidation';
import type { QuoteData } from '../../types/Quote';

interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'document' | 'drawing';
  progress: number;
}

interface QuoteStep4Props {
  updateQuoteData: (updates: Partial<QuoteData>) => void;
  onSubmit: () => Promise<void>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const QuoteStep4: React.FC<QuoteStep4Props> = ({ updateQuoteData, onSubmit }) => {
  const { currentUser } = useContext(AuthContext);
  const { userProfile } = useUserProfile(currentUser?.uid);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState<Partial<QuoteContactInfo>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });

  // Pre-fill form data when userProfile is loaded
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        company: userProfile.company || '',
        notes: '',
      });
    }
  }, [userProfile]);

  const [errors, setErrors] = useState<ValidationError & { files?: string; auth?: string }>({});
  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    email: false,
    phone: false,
    notes: false,
    company: false,
  });

  const handleChange = (field: keyof QuoteContactInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const validationError = validateContactInfo(field, value);
    setErrors(prev => ({ ...prev, [field]: validationError }));
  };

  const handleBlur = (field: keyof QuoteContactInfo) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validationError = validateContactInfo(field, formData[field] || '');
    setErrors(prev => ({ ...prev, [field]: validationError }));
  };

  const isFormValid = () => {
    const requiredFields: (keyof QuoteContactInfo)[] = ['name', 'email', 'phone'];
    return requiredFields.every(field => {
      const value = formData[field];
      return value && value.trim() !== '' && !validateContactInfo(field, value);
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, files: `File ${file.name} is too large. Maximum size is 5MB.` }));
        return;
      }

      const fileType = file.type.startsWith('image/')
        ? 'image'
        : file.type === 'application/pdf' || file.name.endsWith('.docx')
        ? 'document'
        : file.name.endsWith('.dwg')
        ? 'drawing'
        : null;

      if (!fileType) {
        setErrors(prev => ({ ...prev, files: `File ${file.name} has an unsupported format.` }));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFiles(prevFiles => [
          ...prevFiles,
          {
            file,
            preview: fileType === 'image' ? reader.result as string : '',
            type: fileType,
            progress: 0,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/x-autocad': ['.dwg'],
    },
    maxSize: MAX_FILE_SIZE,
  });

  const removeFile = (file: File) => {
    setFiles(prevFiles => prevFiles.filter(f => f.file !== file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setErrors(prev => ({
        ...prev,
        auth: 'Please sign in or create an account to submit your quote'
      }));
      return;
    }

    if (!isFormValid()) {
      setTouched({
        name: true,
        email: true,
        phone: true,
        notes: false,
        company: false,
      });
      return;
    }

    // Submit the form data
    updateQuoteData({
      contactInfo: {
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        company: formData.company,
        notes: formData.notes,
      }
    });

    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!currentUser && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Authentication Required
              </h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                Please sign in or create an account to submit your quote.
              </p>
              <div className="mt-3 flex gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label className={labelClasses}>
            Name <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={getInputClasses(!!errors.name, touched.name, true)}
            placeholder="Your name"
          />
          {errors.name && touched.name && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className={labelClasses}>
            Email <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={getInputClasses(!!errors.email, touched.email, true)}
            placeholder="you@example.com"
          />
          {errors.email && touched.email && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className={labelClasses}>
            Phone <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            className={getInputClasses(!!errors.phone, touched.phone, true)}
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && touched.phone && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Company Field */}
        <div>
          <label className={labelClasses}>
            Company <span className="text-gray-500 dark:text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            className={getInputClasses(!!errors.company, touched.company, true)}
            placeholder="Your company name"
          />
          {errors.company && touched.company && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              {errors.company}
            </p>
          )}
        </div>

        {/* Notes Field */}
        <div>
          <label className={labelClasses}>
            Notes <span className="text-gray-500 dark:text-gray-400">(Optional)</span>
          </label>
          <textarea
            rows={4}
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            onBlur={() => handleBlur('notes')}
            className={getInputClasses(!!errors.notes, touched.notes, true)}
            placeholder="Any additional details or requirements"
            maxLength={500}
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {(formData.notes?.length || 0)}/500 characters
            </p>
            {errors.notes && touched.notes && (
              <p className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                {errors.notes}
              </p>
            )}
          </div>
        </div>

        {/* File Upload Section */}
        <div>
          <label className={labelClasses}>
            Upload Files <span className="text-gray-500 dark:text-gray-400">(Optional)</span>
          </label>
          <div
            {...getRootProps()}
            className={`
              mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 py-10
              transition-colors duration-200
              ${isDragActive
                ? 'border-primary-400 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-400'
              }
            `}
          >
            <div className="text-center">
              <Upload
                className={`mx-auto h-12 w-12 ${
                  isDragActive ? 'text-primary-500' : 'text-gray-400'
                }`}
              />
              <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                <label className="relative cursor-pointer rounded-md font-semibold text-primary-600 dark:text-primary-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
                  <span>Upload files</span>
                  <input {...getInputProps()} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">
                Images (JPG, PNG, WebP), Documents (PDF, DOCX), or CAD files (DWG) up to 5MB
              </p>
            </div>
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="relative group rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-center gap-3">
                    {file.type === 'image' ? (
                      <img
                        src={file.preview}
                        alt="Preview"
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : file.type === 'document' ? (
                      <FileText className="h-10 w-10 text-blue-500" />
                    ) : (
                      <PenTool className="h-10 w-10 text-purple-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.file)}
                      className="p-1 rounded-full text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {file.progress > 0 && file.progress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
                      <div
                        className="h-full bg-primary-500 dark:bg-primary-400 transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          {errors.files && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              {errors.files}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}; 