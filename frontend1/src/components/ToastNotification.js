'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Enum for different toast types
const ToastType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Create a context for toast notifications
const ToastContext = createContext(null);

// Toast Component
const Toast = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Define icon and color based on toast type
  const getTypeStyles = () => {
    switch(type) {
      case ToastType.SUCCESS:
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        };
      case ToastType.ERROR:
        return {
          icon: <XCircle className="w-6 h-6 text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        };
      case ToastType.WARNING:
        return {
          icon: <AlertCircle className="w-6 h-6 text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800'
        };
      case ToastType.INFO:
      default:
        return {
          icon: <Info className="w-6 h-6 text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        };
    }
  };

  const typeStyles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 
        ${typeStyles.bgColor} 
        ${typeStyles.borderColor} 
        ${typeStyles.textColor}
        border rounded-lg shadow-lg 
        px-4 py-3 
        flex items-center 
        space-x-3 
        min-w-[300px] 
        animate-slide-in
      `}
    >
      {typeStyles.icon}
      <div className="flex-grow">
        <p className="font-medium">{message}</p>
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          onClose();
        }} 
        className="hover:bg-gray-100 rounded-full p-1 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

// Toast Provider Component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = ToastType.INFO, duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Custom hook for toast notifications
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Export toast types for easy usage
export { ToastType };