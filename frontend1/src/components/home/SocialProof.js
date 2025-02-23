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
      image: '/social/post1.png',
      username: '@cre8wear',
      platform: 'facebook',
      url: 'https://www.facebook.com/profile.php?id=61573424315636'
    },
    {
      image: '/social/post2.png',
      username: '@cre8nwear',
      platform: 'instagram',
      url: 'https://www.instagram.com/cre8nwear/'
    },
    {
      image: '/social/post3.png',
      username: '@cre8nwear',
      platform: 'tiktok',
      url: 'https://www.tiktok.com/@cre8nwear'
    }
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
          className="flex justify-center items-center gap-8 max-w-4xl mx-auto"
        >
          {socialPosts.map((post, index) => (
            <a
              key={index}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative w-72 aspect-square overflow-hidden rounded-lg transform transition-all duration-500 ${
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
                  <p className="font-semibold mb-2">{post.username}</p>
                  <p className="text-sm capitalize">View on {post.platform}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}