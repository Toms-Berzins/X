import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Head } from '../components/shared/Head';

// Reusable FadeIn component for consistent animations
const FadeIn: React.FC<{
  delay?: number;
  children: React.ReactNode;
  className?: string;
}> = ({ delay = 0, children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const HomePage: React.FC = () => {
  return (
    <>
      {/* SEO & Meta Tags */}
      <Head
        title="Professional Powder Coating Services"
        description="Transform your metal surfaces with our professional powder coating services. We offer durable, beautiful, and environmentally friendly solutions for residential, commercial, and automotive applications."
      />

      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>

      <div className="min-h-screen">
        {/* Hero Section */}
        <header className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 opacity-90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Professional Powder Coating Services
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Transform your metal surfaces with our premium powder coating services.
                Durable, beautiful, and environmentally friendly solutions for your projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/services"
                  aria-label="View Our Services"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors"
                >
                  Our Services
                  <span className="ml-2">
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </Link>
                <Link
                  to="/quotes/new"
                  aria-label="Get a Free Quote"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
                >
                  Get a Free Quote
                </Link>
              </div>
            </FadeIn>
          </div>
        </header>

        {/* Main content with improved structure */}
        <main id="main-content">
          {/* Features Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn delay={0.2} className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Choose Us?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Experience the difference with our professional powder coating services.
                </p>
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <FadeIn key={feature.title} delay={0.1 * (index + 1)} className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
                    <div className="text-primary-600 dark:text-primary-400 mb-4" aria-hidden="true">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn delay={0.4} className="bg-primary-600 rounded-2xl text-center py-12 px-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Start Your Project?
                </h2>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                  Get started with your powder coating project today.
                </p>
                <Link
                  to="/quotes/new"
                  aria-label="Get Started with Your Project"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors"
                >
                  Get Started
                  <span className="ml-2">
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </Link>
              </FadeIn>
            </div>
          </section>
        </main>

      </div>
    </>
  );
};

const features = [
  {
    title: 'Quality Finish',
    description: 'Superior durability and aesthetic appeal with our professional powder coating process.',
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  },
  {
    title: 'Fast Turnaround',
    description: 'Quick and efficient service without compromising on quality.',
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    title: 'Expert Team',
    description: 'Experienced professionals dedicated to delivering exceptional results.',
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  },
];

export default HomePage; 