'use client';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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
  .phone-number-input.error {
    border-color: #EF4444 !important;
  }
  .required-field::after {
    content: '*';
    color: #EF4444;
    margin-left: 4px;
  }
`;

export function StarRating({ rating, onRatingChange = null, size = 'normal', required = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (index) => {
    if (onRatingChange) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (onRatingChange) {
      setHoverRating(0);
    }
  };

  const handleClick = (index) => {
    if (onRatingChange) {
      onRatingChange(index);
    }
  };

  const displayRating = hoverRating || rating;
  const starSize = size === 'large' ? 'w-10 h-10' : 'w-6 h-6';

  return (
    <div 
      className="flex gap-1" 
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className={`${starSize} cursor-pointer`}
          onMouseOver={() => handleMouseOver(index)}
          onClick={() => handleClick(index)}
        >
          <svg 
            className={`${starSize} ${displayRating >= index ? 'text-yellow-400' : 'text-gray-300'}`}
            viewBox="0 0 24 24"
            fill={displayRating >= index ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ))}
      <span className="ml-2 text-gray-600">
        {displayRating > 0 ? `${displayRating.toFixed(1)} out of 5` : ''}
      </span>
    </div>
  );
}

export default function ReviewForm({ productId, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    description: '',
  });
  const [countryCode, setCountryCode] = useState('92');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Review description is required';
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    if (errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('contactNumber', `+${countryCode}${phoneNumber}`);
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('description', formData.description.trim());

      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch(`http://localhost:5001/api/products/${productId}/reviews`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Reset form
      setFormData({
        name: '',
        rating: 0,
        description: '',
      });
      setPhoneNumber('');
      setImages([]);
      setErrors({});
      onSubmit?.();

    } catch (error) {
      setErrors(prev => ({ ...prev, submit: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleRatingChange = (newRating) => {
    setFormData(prev => ({ ...prev, rating: newRating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  return (
    <>
      <style jsx global>{styles}</style>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-lg p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Write a Review</h3>
          
          {/* Rating Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 required-field">
              Rating
            </label>
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              size="large"
              required
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 required-field">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              className={`mt-1 block w-full rounded-md border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 required-field">
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
                className={`phone-number-input ${errors.phoneNumber ? 'error' : ''}`}
                maxLength={10}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 required-field">
              Your Review
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              rows={4}
              className={`mt-1 block w-full rounded-md border ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
              placeholder="Share your experience with this product..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add Photos (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full text-gray-700"
            />
          </div>

          {errors.submit && (
            <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-base font-medium"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </>
  );
}