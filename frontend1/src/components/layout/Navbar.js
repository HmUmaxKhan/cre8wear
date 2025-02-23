"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes, FaShoppingBag, FaClipboardList } from "react-icons/fa";

const API_URL = "http://localhost:5001";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);

  // Function to create slug from category name
  const createSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  // Update cart count
  const updateCartCount = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartCount(cartItems.length);
    } catch (error) {
      console.error('Error updating cart count:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // Transform the categories data to include slugs
        const processedCategories = data.map(category => ({
          ...category,
          slug: createSlug(category.name)
        }));

        setCategories(processedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();

    // Add scroll event listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Initial cart count and add event listeners
    updateCartCount();
    
    // Listen for custom cart update event
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-lg py-2" : "bg-black py-4"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image
                src={isScrolled ? "/logo-white.png" : "/logo.png"}
                alt="Cre8&Wear"
                width={150}
                height={150}
                className="w-auto h-12 transition-transform hover:scale-105 cursor-pointer"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/products/${category.slug}`}
                className="relative text-sm font-medium text-white transition-colors hover:text-blue-600 group"
              >
                {category.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
              </Link>
            ))}
            <Link
              href="/coming"
              className="relative text-sm font-medium text-white transition-colors hover:text-blue-600 group"
            >
              Customize
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
            </Link>
            <Link
              href="/track-order"
              className="relative text-sm font-medium text-white transition-colors hover:text-blue-600 group flex items-center"
            >
              <FaClipboardList className="mr-2" /> Track Order
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
            </Link>
          </div>

          {/* Cart Icon */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/track-order"
              className="text-white hover:text-blue-600 transition-colors flex items-center"
              title="Track Order"
            >
              <FaClipboardList className="h-5 w-5 mr-1" />
            </Link>
            <Link
              href="/cart"
              className="relative text-white hover:text-blue-600 transition-colors"
            >
              <FaShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-blue-600 transition-colors"
          >
            {isMobileMenuOpen ? (
              <FaTimes className=" h-6 w-6" />
            ) : (
              <FaBars className="mr-6 h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className={`fixed right-0 top-0 bottom-0 w-64 bg-white transform transition-transform duration-300 ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/products/${category.slug}`}
                  className="block text-gray-900 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              
              <Link
                href="/coming"
                className="block text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Customize
              </Link>
              
              <Link
                href="/track-order"
                className="block text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Track Order
              </Link>
              
              <hr className="border-gray-200" />
              
              <Link
                href="/cart"
                className="flex items-center text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaShoppingBag className="h-6 w-6 mr-2" />
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}