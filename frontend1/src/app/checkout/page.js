// src/app/checkout/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would normally send the order to your backend
      // For now, we'll just simulate a successful order
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      // Clear cart after successful order
      localStorage.setItem('cartItems', '[]');
      router.push('/checkout/success');
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-center mt-12 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-600 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-white mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 text-white md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold text-white">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-white">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-lg font-semibold text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-white">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full text-black  rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-600 rounded-lg text-white shadow p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-white">
                Address
              </label>
              <textarea
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold text-white">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-white">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-bold text-white">
                Postal Code
              </label>
              <input
                type="text"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-600 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>
          <div className="flex items-center">
            <input
              type="radio"
              checked={true}
              readOnly
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label className="ml-3 block text-lg font-semibold text-white">
              Cash on Delivery
            </label>
          </div>
          <p className="mt-2 text-sm text-white">
            Pay when your order is delivered
          </p>
        </div>


        <button
          type="submit"
          onClick={()=>{router.push("/checkout/success")}}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}