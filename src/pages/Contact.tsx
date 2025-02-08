import React, { memo } from 'react';
import { motion, Variants } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactDetailProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const ContactDetail: React.FC<ContactDetailProps> = memo(({ icon, title, content }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0">
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-lg font-medium text-gray-900 dark:text-white">{title}</p>
      <p className="text-gray-600 dark:text-gray-400">{content}</p>
    </div>
  </div>
));
ContactDetail.displayName = 'ContactDetail';

const leftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const rightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

const ContactInfo: React.FC = () => (
  <motion.div
    variants={leftVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: 0.2 }}
    className="space-y-8"
  >
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Get in Touch
      </h2>
      <div className="space-y-6">
        <ContactDetail
          icon={<Phone className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />}
          title="Phone"
          content="(555) 123-4567"
        />
        <ContactDetail
          icon={<Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />}
          title="Email"
          content="info@powderpro.com"
        />
        <ContactDetail
          icon={<MapPin className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />}
          title="Address"
          content={
            <>
              123 Powder Street
              <br />
              Coating City, ST 12345
            </>
          }
        />
        <ContactDetail
          icon={<Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />}
          title="Business Hours"
          content={
            <>
              Monday - Friday: 8:00 AM - 6:00 PM
              <br />
              Saturday: 9:00 AM - 2:00 PM
              <br />
              Sunday: Closed
            </>
          }
        />
      </div>
    </div>
  </motion.div>
);

const ContactForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <motion.div
      variants={rightVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Send Message
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get in touch with us for any questions about our powder coating services
            or to request a quote.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
