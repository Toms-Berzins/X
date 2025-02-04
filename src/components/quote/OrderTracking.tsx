import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { Quote } from '../../types/User';

const orderSteps = [
  {
    status: 'pending',
    title: 'Quote Submitted',
    description: 'Your quote is being reviewed by our team.',
    icon: Clock
  },
  {
    status: 'approved',
    title: 'Quote Approved',
    description: 'Your quote has been approved and is ready for processing.',
    icon: CheckCircle2
  },
  {
    status: 'in_preparation',
    title: 'Surface Preparation',
    description: 'Items are being prepared for powder coating.',
    icon: Loader2
  },
  {
    status: 'coating',
    title: 'Powder Application',
    description: 'Applying powder coating with precision.',
    icon: Loader2
  },
  {
    status: 'curing',
    title: 'Curing Process',
    description: 'Heat treatment for a durable finish.',
    icon: Loader2
  },
  {
    status: 'quality_check',
    title: 'Quality Inspection',
    description: 'Final quality checks and verification.',
    icon: Loader2
  },
  {
    status: 'completed',
    title: 'Order Completed',
    description: 'Your items are ready for pickup/delivery.',
    icon: CheckCircle2
  }
];

interface OrderTrackingProps {
  quote: Quote;
}

const getStepStatus = (quote: Quote, stepStatus: string) => {
  const statusOrder = {
    pending: 0,
    approved: 1,
    in_preparation: 2,
    coating: 3,
    curing: 4,
    quality_check: 5,
    completed: 6
  };

  const currentStepIndex = statusOrder[quote.status as keyof typeof statusOrder] || 0;
  const stepIndex = statusOrder[stepStatus as keyof typeof statusOrder] || 0;

  if (currentStepIndex > stepIndex) return 'completed';
  if (currentStepIndex === stepIndex) return 'current';
  return 'pending';
};

export function OrderTracking({ quote }: OrderTrackingProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div ref={ref} className="relative max-w-md mx-auto px-4 py-8">
      <div className="absolute left-8 transform -translate-x-px h-full w-0.5 bg-gray-200" />
      
      {orderSteps.map((step, index) => {
        const stepStatus = getStepStatus(quote, step.status);
        const Icon = step.icon;

        return (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.2 }}
            className="relative mb-8 ml-8"
          >
            <div className="flex items-start">
              <div 
                className={`absolute -left-10 flex items-center justify-center w-8 h-8 rounded-full 
                  ${stepStatus === 'completed' ? 'bg-green-500' : 
                    stepStatus === 'current' ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <Icon className={`w-5 h-5 ${stepStatus === 'pending' ? 'text-gray-500' : 'text-white'} 
                  ${stepStatus === 'current' ? 'animate-spin' : ''}`} />
              </div>
              <div className="flex-1">
                <div className="p-4 rounded-lg bg-white shadow-sm">
                  <h3 className={`text-lg font-semibold 
                    ${stepStatus === 'completed' ? 'text-green-600' : 
                      stepStatus === 'current' ? 'text-blue-600' : 'text-gray-600'}`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">{step.description}</p>
                  {stepStatus === 'current' && (
                    <div className="mt-2">
                      <div className="h-1 bg-blue-100 rounded-full">
                        <div className="h-1 bg-blue-500 rounded-full w-1/2 animate-pulse" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 