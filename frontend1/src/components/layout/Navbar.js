"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingBag } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Replace with actual cart state

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Hoodies", href: "/products/hoodies" },
    { name: "Shirts", href: "/products/shirts" },
    { name: "T-Shirts", href: "/products/t-shirts" },
    { name: "Jackets", href: "/products/jackets" },
    { name: "Customize", href: "/customize" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center space-x-2 cursor-pointer">
              {isScrolled ? (
                <Image
                  src="/logo-white.png"
                  alt="Cre8&Wear"
                  width={150}
                  height={150}
                  className="w-auto h-12 transition-transform hover:scale-105 cursor-pointer"
                />
              ) : (
                <Image
                  src="/logo.png"
                  alt="Cre8&Wear"
                  width={150}
                  height={150}
                  className="w-auto h-12 transition-transform hover:scale-105 cursor-pointer"
                />
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-medium transition-colors hover:text-blue-600 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }
                group`}
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/cart"
              className={`relative hover:text-blue-600 transition-colors ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              <FaShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/auth/login"
              className={`hover:text-blue-600 transition-colors ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              <FaUser className="h-6 w-6" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden hover:text-blue-600 transition-colors ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
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
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-900 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="border-gray-200" />
              <Link
                href="/cart"
                className="flex items-center text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaShoppingBag className="h-6 w-6 mr-2" />
                Cart ({cartCount})
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUser className="h-6 w-6 mr-2" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
