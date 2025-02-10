// src/components/layout/Footer.js
'use client';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';


export default function Footer() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const socialLinks = [
    { name: 'Facebook', icon: "fb2.png", href: '#' },
    { name: 'Instagram', icon: <FaInstagram />, href: '#' },
    { name: 'Twitter', icon: <FaTwitter />, href: '#' },
    { name: 'TikTok', icon: <FaTiktok />, href: '#' }
  ];

  return (
    <footer ref={ref} className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className={`space-y-6 transform transition-all duration-500 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo-white.png"
                alt="Cre8&Wear"
                width={40}
                height={40}
                className="w-auto h-10"
              />
              <span className="font-bold text-xl">Cre8&Wear</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Create and customize your perfect clothing with our innovative design tools
              and premium quality materials.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={`/icons/${social.icon}`}
                    alt={social.name}
                    width={24}
                    height={24}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={`transform transition-all duration-500 delay-100 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/customize" className="text-gray-400 hover:text-white transition-colors">
                  Design Studio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className={`transform transition-all duration-500 delay-200 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={`transform transition-all duration-500 delay-300 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Cre8&Wear. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}