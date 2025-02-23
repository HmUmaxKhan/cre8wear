"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CreditCard, User, Phone, Mail } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Image from "next/image";

const customStyles = `
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
  .required-field::after {
    content: '*';
    color: #EF4444;
    margin-left: 4px;
  }
`;

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [countryCode, setCountryCode] = useState("92");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    setPhoneNumber(value);
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "Province is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Postal code is required";

    if (phoneNumber && phoneNumber.length < 10) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const fullPhoneNumber = `+${countryCode}${phoneNumber}`;
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        contactNumber: fullPhoneNumber,
        email: formData.email || undefined, // Only send if not empty
        address: formData.address,
        city: formData.city,
        province: formData.state,
        pincode: formData.pincode,
        items: cartItems.map((item) => ({
          productId: item.id,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          frontImage: item.image,
          backImage: item.image,
        })),
        totalAmount: total,
      };

      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Order creation failed");
      }

      localStorage.setItem("cartItems", "[]");
      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout error:", error);
      setErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <>
      <style jsx global>
        {customStyles}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 mt-20 lg:grid-cols-12 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white shadow-md rounded-lg p-6 border">
                <div className="flex items-center mb-4 text-gray-800">
                  <User className="mr-2" />
                  <h2 className="text-xl font-semibold">
                    Personal Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 required-field">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 required-field">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Mail className="mr-2" /> Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center required-field">
                      <Phone className="mr-2" /> Phone Number
                    </label>
                    <div className="flex gap-2 items-center">
                      <PhoneInput
                        country={"pk"}
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
                        className={`phone-number-input ${
                          errors.phoneNumber ? "border-red-500" : ""
                        }`}
                        maxLength={10}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Shipping Address */}
              <div className="bg-white shadow-md rounded-lg p-6 border">
                <div className="flex items-center mb-4 text-gray-800">
                  <MapPin className="mr-2" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 required-field">
                      Address
                    </label>
                    <textarea
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 required-field">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 required-field">
                        Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.state ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 required-field">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.pincode ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              // In the Payment Method section, modify it to:
              {/* Payment Method */}
              <div className="bg-white shadow-md rounded-lg p-6 border">
                <div className="flex items-center mb-4 text-gray-800">
                  <CreditCard className="mr-2" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                <div className="flex items-center bg-blue-50 p-4 rounded-md">
                  <input
                    type="radio"
                    checked={true}
                    readOnly
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Cash on Delivery
                    </h3>
                    <p className="text-sm text-gray-600">
                      Pay when your order is delivered
                    </p>
                  </div>
                </div>
              </div>
              {/* Error message if any */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {errors.submit}
                </div>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white shadow-lg rounded-lg p-6 border sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="flex items-center"
                  >
                    <div className="relative h-16 w-16 mr-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover rounded-md w-full h-full"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.size} | {item.color} | Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-medium text-gray-800">
                        Rs {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Rs {item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Free Delivery</span>
                  <span>Rs 0.00</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-xl text-gray-900">
                    <span>Total</span>
                    <span>Rs {total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Including all taxes
                  </p>
                </div>
              </div>

              {/* Order Button for mobile */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 rounded-md hover:bg-blue-700 transition-colors mt-6 lg:hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
