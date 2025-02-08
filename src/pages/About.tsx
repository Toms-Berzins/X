import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Clock, Users, Star } from 'lucide-react';

const values = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Quality',
    description: 'We never compromise on quality, using only the finest materials and latest techniques.',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Reliability',
    description: 'On-time delivery and consistent results you can count on, every time.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Customer Focus',
    description: 'Your satisfaction is our priority. We work closely with you to exceed expectations.',
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: 'Experience',
    description: 'Over 15 years of expertise in professional powder coating services.',
  },
];

const team = [
  {
    name: 'John Smith',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Over 20 years of experience in powder coating and industrial finishing.',
  },
  {
    name: 'Sarah Johnson',
    role: 'Operations Manager',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Ensures smooth operation and maintains our high quality standards.',
  },
  {
    name: 'Mike Wilson',
    role: 'Lead Technician',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Expert in surface preparation and coating application techniques.',
  },
  {
    name: 'Emily Chen',
    role: 'Customer Relations',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Dedicated to ensuring the best experience for our clients.',
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            About PowderPro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We are a leading powder coating service provider, committed to delivering
            exceptional quality and customer satisfaction since 2008.
          </p>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-primary-600 rounded-xl text-white text-center py-16 px-8"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Work Together?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Let's discuss your powder coating project and how we can help bring
            your vision to life.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Get in Touch
          </Link>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage; 