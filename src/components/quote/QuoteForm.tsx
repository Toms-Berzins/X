import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { useQuoteForm } from '../../hooks/useQuoteForm';
import type { QuoteData } from '../../types/Quote';
import { QuoteStep1 } from './QuoteStep1';
import { QuoteStep2 } from './QuoteStep2';
import { QuoteStep3 } from './QuoteStep3';
import { QuoteStep4 } from './QuoteStep4';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, Award, Users } from 'lucide-react';
import { QuoteSummary } from './QuoteSummary';

// Create reusable motion components
const MotionDiv = motion.create('div');
const MotionCard = motion.create(Card);

interface QuoteFormProps {
  initialData?: Partial<QuoteData>;
  onSubmit?: (data: QuoteData) => void;
  submitLabel?: string;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  initialData,
  onSubmit,
  submitLabel = 'Submit Quote'
}) => {
  const navigate = useNavigate();
  const { 
    quoteData, 
    currentStep,
    updateQuoteData,
    nextStep,
    prevStep,
    submitQuote
  } = useQuoteForm(initialData);

  const [showWelcome, setShowWelcome] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);

  const stepsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    stepsContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStep]);

  const steps = [
    { 
      number: 1, 
      title: 'Items', 
      description: 'Add items to quote',
      estimate: '2-3 min'
    },
    { 
      number: 2, 
      title: 'Coating', 
      description: 'Choose coating options',
      estimate: '1-2 min'
    },
    { 
      number: 3, 
      title: 'Services', 
      description: 'Additional services',
      estimate: '1-2 min'
    },
    { 
      number: 4, 
      title: 'Contact', 
      description: 'Your contact information',
      estimate: '1 min'
    }
  ];

  const handleSubmit = async () => {
    try {
      if (onSubmit) {
        await onSubmit(quoteData);
      } else {
        await submitQuote();
      }
      navigate('/quotes');
    } catch (error) {
      console.error('Error submitting quote:', error);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!quoteData.items || quoteData.items.length === 0)) {
      updateQuoteData({ showNoItemsError: true });
      return;
    }
    updateQuoteData({ showNoItemsError: false });
    nextStep();
  };

  if (showWelcome) {
    return (
      <MotionDiv 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <MotionCard 
          className="text-center p-8"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Get Your Custom Powder Coating Quote
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center p-6 bg-primary-50/50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group">
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">Quick & Easy</h3>
                <p className="text-gray-600 dark:text-gray-400">Takes only 5-8 minutes</p>
              </div>
            </div>
            
            <div className="flex items-center p-6 bg-primary-50/50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group">
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">Best Rates</h3>
                <p className="text-gray-600 dark:text-gray-400">Competitive pricing</p>
              </div>
            </div>
            
            <div className="flex items-center p-6 bg-primary-50/50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group">
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">Quality Service</h3>
                <p className="text-gray-600 dark:text-gray-400">Professional finish</p>
              </div>
            </div>
            
            <div className="flex items-center p-6 bg-primary-50/50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group">
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">Happy Customers</h3>
                <p className="text-gray-600 dark:text-gray-400">500+ satisfied clients</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mb-12 bg-white/50 dark:bg-white/5 rounded-xl p-8 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-8 h-8 text-yellow-400 dark:text-yellow-300 filter drop-shadow"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">4.9/5 Average Rating</p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Based on 500+ customer reviews</p>

            {/* Live Stats */}
            <div className="flex justify-center space-x-12 text-base">
              <div className="flex items-center">
                <span className="font-semibold text-primary-600 dark:text-primary-400 mr-2">12</span>
                <span className="text-gray-600 dark:text-gray-400">people got a quote today</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-primary-600 dark:text-primary-400 mr-2">3</span>
                <span className="text-gray-600 dark:text-gray-400">people viewing now</span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => setShowWelcome(false)}
            className="w-full md:w-auto px-8 py-4 text-lg bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            Start Your Quote
            <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Button>

          <p className="mt-6 text-base text-secondary-500 dark:text-secondary-400">
            No commitment required • Instant online quote
          </p>
        </MotionCard>
      </MotionDiv>
    );
  }

  return (
    <MotionCard 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col xl:flex-row xl:space-x-8">
        {/* Main Form Content */}
        <div className="flex-1 min-w-0">
          {/* Progress Steps */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {steps[currentStep - 1].description}
                </p>
              </div>
              <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Time spent: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="relative flex justify-between">
              {/* Progress Bar Background */}
              <div className="absolute top-[1.75rem] left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
              
              {/* Active Progress Bar */}
              <div 
                className="absolute top-[1.75rem] left-0 h-1 bg-primary-500 dark:bg-primary-400 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step) => (
                <div key={step.number} className="relative flex-1 flex flex-col items-center">
                  <div 
                    className={`
                      w-14 h-14 rounded-full flex items-center justify-center relative z-10
                      transition-all duration-200 
                      ${currentStep === step.number 
                        ? 'bg-primary-500 dark:bg-primary-400 text-white shadow-lg shadow-primary-500/30 dark:shadow-primary-400/30 scale-110' 
                        : currentStep > step.number
                          ? 'bg-primary-500 dark:bg-primary-400 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700'
                      }
                      sm:hover:scale-105 cursor-pointer
                    `}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className={`text-lg font-semibold ${
                        currentStep === step.number ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.number}
                      </span>
                    )}
                  </div>

                  <div className={`
                    mt-4 text-center transition-all duration-200
                    ${currentStep === step.number ? 'transform scale-105' : 'transform scale-100'}
                  `}>
                    <div className={`
                      text-sm sm:text-base font-semibold mb-1
                      ${currentStep === step.number 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-900 dark:text-gray-100'
                      }
                    `}>
                      {step.title}
                    </div>
                    <div className={`
                      text-xs sm:text-sm
                      ${currentStep === step.number 
                        ? 'text-primary-500 dark:text-primary-400' 
                        : 'text-gray-500 dark:text-gray-400'
                      }
                    `}>
                      {step.estimate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <div ref={stepsContainerRef}>
            <AnimatePresence mode="wait">
              <MotionDiv
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="mt-8"
              >
                {currentStep === 1 && (
                  <QuoteStep1
                    quoteData={quoteData}
                    onUpdate={updateQuoteData}
                  />
                )}

                {currentStep === 2 && (
                  <QuoteStep2
                    quoteData={quoteData}
                    onUpdate={updateQuoteData}
                  />
                )}

                {currentStep === 3 && (
                  <QuoteStep3
                    quoteData={quoteData}
                    onUpdate={updateQuoteData}
                  />
                )}

                {currentStep === 4 && (
                  <QuoteStep4
                    updateQuoteData={updateQuoteData}
                    onSubmit={handleSubmit}
                  />
                )}
              </MotionDiv>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <MotionDiv 
            className="mt-8 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="secondary"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Back
            </Button>
            
            {currentStep < steps.length ? (
              <Button 
                variant="primary" 
                onClick={handleNextStep}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                Next Step
                <span className="ml-1">→</span>
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {submitLabel}
              </Button>
            )}
          </MotionDiv>

          {/* Save Progress Reminder */}
          {currentStep > 1 && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              Your progress is automatically saved
            </p>
          )}
        </div>

        {/* Quote Summary */}
        <div className="w-full xl:w-[400px] mt-8 xl:mt-0">
          <div className="sticky top-6">
            <QuoteSummary 
              quoteData={quoteData} 
              currentStep={currentStep} 
              onUpdateItems={(items) => updateQuoteData({ items })}
              onEditItem={(index) => {
                updateQuoteData({ editingItemIndex: index });
                while (currentStep > 1) {
                  prevStep();
                }
              }}
            />
          </div>
        </div>
      </div>
    </MotionCard>
  );
}; 