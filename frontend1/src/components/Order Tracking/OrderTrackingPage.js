'use client';

import { useState } from 'react';
import { Search, Package, X, Truck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Custom CSS for inputs
const styles = `
  .phone-input-container {
    background: #F8F9FA !important;
    border: 1px solid #E9ECEF !important;
    border-radius: 4px !important;
    width: 85px !important;
    height: 48px !important;
  }
  .phone-input-container .form-control {
    display: none !important;
  }
  .phone-input-container .flag-dropdown {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
  }
  .phone-input-container .selected-flag {
    background: transparent !important;
    width: 85px !important;
    padding: 0 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
  .phone-input-container .flag {
    transform: scale(1.2);
  }
  .phone-input-container .arrow {
    display: none !important;
  }
  .phone-input-dropdown {
    width: 300px !important;
  }
  .phone-number-input {
    height: 48px !important;
    flex: 1;
    padding: 8px 12px !important;
    border: 1px solid #E9ECEF !important;
    border-radius: 4px !important;
    font-size: 16px !important;
    outline: none !important;
  }
  .phone-number-input:focus {
    border-color: #4F46E5 !important;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
  }
`;

// Status mappings
const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Package className="text-yellow-500" />;
    case 'shipped':
      return <Truck className="text-blue-500" />;
    case 'delivered':
      return <CheckCircle className="text-green-500" />;
    case 'cancelled':
      return <XCircle className="text-red-500" />;
    default:
      return <Package className="text-gray-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'shipped':
      return 'text-blue-600 bg-blue-50';
    case 'delivered':
      return 'text-green-600 bg-green-50';
    case 'cancelled':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export default function OrderTrackingPage() {
  const [countryCode, setCountryCode] = useState('92');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setPhoneNumber(value);
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setOrders([]);

    const fullPhoneNumber = `+${countryCode}${phoneNumber}`;

    try {
      const response = await fetch(`${API_URL}/api/orders/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactNumber: fullPhoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancellingOrderId) return;

    try {
      const response = await fetch(`${API_URL}/api/orders/${cancellingOrderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel order');
      }

      // Refresh orders after cancellation
      handleTrackOrder(new Event('submit'));
      
      // Reset cancelling order id and close modal
      setCancellingOrderId(null);
      setShowCancelConfirmation(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Custom Confirmation Modal
  const CancelConfirmationModal = ({ orderNo, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="mr-3 text-yellow-500 w-8 h-8 md:w-10 md:h-10" />
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            Cancel Order
          </h2>
        </div>
        
        <p className="text-sm md:text-base text-gray-600 mb-6">
          Are you sure you want to cancel Order #{orderNo}? 
          This action cannot be undone.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm md:text-base"
          >
            No, Keep Order
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm md:text-base"
          >
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx global>{styles}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 min-h-screen flex flex-col items-center">
        {/* Confirmation Modal */}
        {showCancelConfirmation && cancellingOrderId && (
          <CancelConfirmationModal
            orderNo={orders.find(o => o._id === cancellingOrderId)?.orderNo}
            onConfirm={handleCancelOrder}
            onCancel={() => {
              setCancellingOrderId(null);
              setShowCancelConfirmation(false);
            }}
          />
        )}

        <div className="w-full mt-20 max-w-md mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
            Track Your Order
          </h1>

          <form onSubmit={handleTrackOrder} className="bg-white p-8 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Phone Number
              </label>
              <div className="flex gap-2 items-center">
                <PhoneInput
                  country={'pk'}
                  value={countryCode}
                  onChange={(value) => setCountryCode(value)}
                  enableSearch={true}
                  containerClass="phone-input-container"
                  searchClass="phone-input-search"
                  dropdownClass="phone-input-dropdown"
                />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="3001234567"
                  className="phone-number-input"
                  required
                  maxLength={10}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white h-12 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {isLoading ? 'Searching...' : 'Track Order'}
            </button>
          </form>

          {error && (
            <div className="mt-4 md:mt-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-center text-sm md:text-base">
              {error}
            </div>
          )}
        </div>

        {/* Orders Display Section */}
        {orders.length > 0 && (
          <div className="w-full max-w-4xl space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-center mb-4 text-gray-800">
              Your Orders
            </h2>
            
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white shadow-lg rounded-xl border overflow-hidden"
              >
                {/* Order Header */}
                <div className={`px-4 md:px-6 py-3 md:py-4 border-b flex justify-between items-center ${getStatusColor(order.status)}`}>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    {getStatusIcon(order.status)}
                    <span className="text-sm md:text-base font-semibold capitalize">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs md:text-sm">
                    Order #{order.orderNo}
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Order Information */}
                    <div className="space-y-2 md:space-y-3">
                      <h3 className="text-sm md:text-lg font-semibold border-b pb-1 md:pb-2">Order Information</h3>
                      <p className="text-xs md:text-sm">
                        <span className="font-medium">Date:</span>{' '}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs md:text-sm">
                        <span className="font-medium">Total:</span>{' '}
                        Rs {order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-xs md:text-sm">
                        <span className="font-medium">Payment:</span>{' '}
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-xs md:text-sm">
                        <span className="font-medium">Customer:</span>{' '}
                        {order.customerName}
                      </p>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2 md:space-y-3">
                      <h3 className="text-sm md:text-lg font-semibold border-b pb-1 md:pb-2">Contact Details</h3>
                      <p className="text-xs md:text-sm">{order.contactNumber}</p>
                      <p className="text-xs md:text-sm">{order.address}</p>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 md:space-y-3">
                      <h3 className="text-sm md:text-lg font-semibold border-b pb-1 md:pb-2">Order Items</h3>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 md:space-x-4">
                          <div className="relative w-12 h-12 md:w-16 md:h-16">
                            <Image
                              src={item.frontImage}
                              alt={`Product ${index + 1}`}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">
                              Color: {item.color} | Size: {item.size}
                            </p>
                            <p className="text-xs md:text-sm">
                              Qty: {item.quantity} | Price: Rs {item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cancel Order Button - Only show for pending orders */}
                  {order.status.toLowerCase() === 'pending' && (
                    <button
                      onClick={() => {
                        setCancellingOrderId(order._id);
                        setShowCancelConfirmation(true);
                      }}
                      className="mt-4 md:mt-6 w-full bg-red-600 text-white py-2 md:py-3 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center text-sm md:text-base"
                    >
                      <X className="mr-2 w-4 h-4 md:w-5 md:h-5" /> Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}