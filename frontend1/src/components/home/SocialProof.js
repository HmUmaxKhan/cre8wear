// src/components/home/SocialProof.js
'use client';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

export default function SocialProof() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const socialPosts = [
    {
      image: '/social/post1.jpg',
      username: '@fashionista',
      likes: '2.5k',
      platform: 'instagram'
    },
    {
      image: '/social/post1.jpg',
      username: '@fashionista',
      likes: '2.5k',
      platform: 'instagram'
    },
    {
      image: '/social/post1.jpg',
      username: '@fashionista',
      likes: '2.5k',
      platform: 'instagram'
    },
    {
      image: '/social/post1.jpg',
      username: '@fashionista',
      likes: '2.5k',
      platform: 'instagram'
    },
    // Add more social posts
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600">
            Follow us on social media and share your creations
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {socialPosts.map((post, index) => (
            <div
              key={index}
              className={`relative aspect-square overflow-hidden rounded-lg transform transition-all duration-500 ${
                inView
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Image
                src={post.image}
                alt={`Social post by ${post.username}`}
                fill
                className="object-cover hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="text-white text-center">
                  <p>{post.username}</p>
                  <p>{post.likes} likes</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            <span className="sr-only">Instagram</span>
            {/* Instagram Icon */}
          </a>
          {/* Add more social media links */}
        </div>
      </div>
    </section>
  );
}