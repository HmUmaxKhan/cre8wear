import Link from "next/link";
import { CheckCircle, Home, ShoppingCart } from "lucide-react";

export default function CheckoutSuccessPage() {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full px-8 py-12 text-center transform transition-all duration-300 hover:scale-105">
          <div className="mb-8 flex justify-center">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle 
                className="h-16 w-16 text-green-600 animate-bounce" 
                strokeWidth={1.5} 
              />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
            Order Placed Successfully!
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for your order. Our team will process and contact you shortly for delivery confirmation.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
}