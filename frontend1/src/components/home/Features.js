// src/components/home/Features.js
'use client';
import { useInView } from 'react-intersection-observer';

export default function Features() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      icon: "🎨",
      title: "Custom Design Studio",
      description: "Use our intuitive design tools to create your perfect look"
    },
    {
      icon: "✨",
      title: "Premium Quality",
      description: "High-quality materials and expert craftsmanship"
    },
    {
      icon: "🚀",
      title: "Fast Delivery",
      description: "Quick production and worldwide shipping"
    },
    {
      icon: "💫",
      title: "AI-Powered Design",
      description: "Generate unique designs with our AI technology"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl text-black md:text-4xl font-bold mb-4">
            Why Choose Cre8&Wear
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of technology, quality, and creativity
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-white p-6 rounded-lg shadow-lg transform transition-all duration-500 ${
                inView
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl text-black font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}