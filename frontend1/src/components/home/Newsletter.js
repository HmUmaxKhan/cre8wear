// src/components/home/Newsletter.js
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      if (email.includes('@')) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    }, 1000);

    // Real API implementation would look like this:
    /*
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
    */
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/10 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative">
            <div className="text-center max-w-2xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                Stay in the Loop
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-300 mb-8"
              >
                Subscribe to our newsletter for exclusive deals, custom design tips, and new product launches
              </motion.p>

              {/* Subscription Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="max-w-md mx-auto"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500"
                    disabled={status === 'loading' || status === 'success'}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Subscribing...
                      </span>
                    ) : status === 'success' ? (
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Subscribed!
                      </span>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {status === 'error' && (
                  <p className="mt-2 text-red-400 text-sm">Please enter a valid email address.</p>
                )}
                {status === 'success' && (
                  <p className="mt-2 text-green-400 text-sm">Thank you for subscribing!</p>
                )}
              </motion.form>

              {/* Benefits */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: '🎁',
                    title: 'Exclusive Offers',
                    description: 'Get access to special discounts'
                  },
                  {
                    icon: '🎨',
                    title: 'Design Tips',
                    description: 'Weekly customization inspiration'
                  },
                  {
                    icon: '🚀',
                    title: 'Early Access',
                    description: 'Be first to know about new products'
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl mb-2">{benefit.icon}</div>
                    <h3 className="text-white font-medium mb-1">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}