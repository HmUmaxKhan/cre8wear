'use client';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const socialLinks = [
    { name: 'Facebook', icon: <FaFacebook className="w-6 h-6" />, href: 'https://www.facebook.com/profile.php?id=61573424315636' },
    { name: 'Instagram', icon: <FaInstagram className="w-6 h-6" />, href: 'https://www.instagram.com/cre8nwear/' },
    { name: 'TikTok', icon: <FaTiktok className="w-6 h-6" />, href: 'https://www.tiktok.com/@cre8nwear' }
  ];

  return (
    <>
      <footer ref={ref} className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Brand Info */}
            <div className={`space-y-6 transform transition-all duration-500 ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.png"
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
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <FaPhone className="w-4 h-4" />
                  <span>+92 326 6614332</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4" />
                  <a href="mailto:cre8wear56@gmail.com" className="hover:text-white transition-colors">
                  cre8wear56@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
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
                  <Link href="/coming" className="text-gray-400 hover:text-white transition-colors">
                    Design Studio
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    About Us
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
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Cre8&Wear. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Contact Link */}
      <Link 
        href="https://wa.me/923259564155"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 z-50"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6" />
      </Link>
    </>
  );
}