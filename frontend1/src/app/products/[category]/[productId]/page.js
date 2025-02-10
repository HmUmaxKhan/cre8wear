// src/app/products/[category]/[productId]/page.js
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';

export default function ProductPage({ params }) {
  const { category, productId } = params;
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Simulating API call with local data
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setMainImage(foundProduct.images.main);
      if (foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0].code);
      }
    }
    setLoading(false);
  }, [productId]);

  const addToCart = (product, selectedSize, selectedColor, quantity) => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    if (!selectedColor) {
      alert('Please select a color');
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images.main,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    };

    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(
      item => item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item if it doesn't exist
      existingCart.push(cartItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(existingCart));
    
    // Create a custom alert with more details
    const colorName = product.colors.find(c => c.code === selectedColor)?.name || 'Unknown Color';
    const alertMessage = `
Added to Cart:
- ${product.name}
- Size: ${selectedSize}
- Color: ${colorName}
- Quantity: ${quantity}
- Total Price: ${(product.price * quantity).toFixed(2)}
    `;
    alert(alertMessage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Product not found</h1>
          <Link href="/products" className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
            Return to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 text-white gap-8 mt-14">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[product.images.front, product.images.back, ...product.images.sides].map((image, index) => (
              <button
                key={index}
                onClick={() => setMainImage(image)}
                className="aspect-square relative overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={image}
                  alt={`View ${index + 1}`}
                  fill
                  className="object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            <p className="text-2xl font-semibold text-white mt-2">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-white">Description</h2>
            <p className="mt-2 text-white">{product.description}</p>
          </div>

          {/* Size Selection */}
          <div>
            <h2 className="text-xl font-bold text-white">Select Size</h2>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 text-sm font-medium rounded-md ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h2 className="text-sm font-medium text-white">Select Color</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.colors.map((color) => (
                <button
                  key={color.code}
                  onClick={() => setSelectedColor(color.code)}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color.code
                      ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                >
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div>
            <h2 className="text-sm font-medium text-white">Quantity</h2>
            <div className="flex items-center space-x-4 mt-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-100 text-black px-3 py-1 rounded-md hover:bg-gray-200"
              >
                -
              </button>
              <span className="text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-100 text-black px-3 py-1 rounded-md hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
            <Link
              href={`/customize/${product.id}`}
              className="block w-full bg-gray-900 text-white text-center py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              Customize Design
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}