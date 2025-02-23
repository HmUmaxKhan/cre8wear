'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const deliveryCharge = "Free Delivery"; // Fixed delivery charge

  const loadCartItems = () => {
    try {
      // Check both localStorage and sessionStorage
      const storedItems = localStorage.getItem('cartItems');
      console.log('Stored Cart Items:', storedItems); // Debugging log

      const items = storedItems ? JSON.parse(storedItems) : [];
      console.log('Parsed Cart Items:', items); // Debugging log

      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadCartItems();

    // Add event listener to sync cart across tabs/windows
    window.addEventListener('storage', loadCartItems);

    return () => {
      window.removeEventListener('storage', loadCartItems);
    };
  }, []);

  const updateQuantity = (productId, variantId, size, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      (item.id === productId && item.variantId === variantId && item.size === size) 
        ? { ...item, quantity: newQuantity } 
        : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Dispatch cart updated event
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (productId, variantId, size) => {
    const updatedItems = cartItems.filter(item => 
      !(item.id === productId && item.variantId === variantId && item.size === size)
    );
    
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Dispatch cart updated event
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Add a method to manually add an item (for debugging)
  const manuallyAddItem = () => {
    const sampleItem = {
      id: 'sample-product',
      variantId: 'variant-1',
      name: 'Sample Product',
      size: 'M',
      color: 'Black',
      price: 46.00,
      quantity: 1,
      image: '/sample-product.jpg'
    };

    const updatedItems = [...cartItems, sampleItem];
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Dispatch cart updated event
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  // Debugging: Log cart items on each render
  console.log('Current Cart Items:', cartItems);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen flex flex-col justify-center items-center">
        <div className="text-center bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
          <Image 
            src="/cart/empty.png" 
            alt="Empty Cart" 
            width={200} 
            height={200} 
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Explore our products and add some to your cart</p>
          <div className="space-y-4">
            <Link 
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors w-full"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-center mt-20 mb-12 text-gray-800">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          {cartItems.map((item) => (
            <div 
              key={`${item.id}-${item.variantId}-${item.size}`} 
              className="flex flex-col sm:flex-row items-start sm:items-center bg-white shadow-md rounded-lg p-4 border"
            >
              <div className="relative w-24 h-24 mr-4 mb-4 sm:mb-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Size: {item.size} | Color: {item.color}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.variantId, item.size, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1 bg-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.variantId, item.size, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.variantId, item.size)}
                    className="text-red-600 hover:text-red-700 flex items-center text-sm ml-4"
                  >
                    <Trash2 size={16} className="mr-1" /> Remove
                  </button>
                </div>
              </div>
              <div className="ml-auto mt-2 sm:mt-0">
                <p className="font-medium text-gray-800">
                  Rs {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white shadow-lg rounded-lg p-6 border sticky top-24">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className='font-semibold'>Free Delivery</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-xl text-gray-900">
                  <span>Total</span>
                  <span>Rs {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors mt-6 flex items-center justify-center"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}