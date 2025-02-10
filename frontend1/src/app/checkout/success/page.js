import Link from "next/link";

// src/app/checkout/success/page.js
export default function CheckoutSuccessPage() {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mb-8 mt-12">
          <svg
            className="mx-auto h-16 w-16 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <circle cx="24" cy="24" r="22" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 24l6 6 12-12"
            />
          </svg>
        </div>
        <h1 className="text-3xl text-white mt-12 font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-white mb-8">
          Thank you for your order. We will contact you shortly for delivery confirmation.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
  