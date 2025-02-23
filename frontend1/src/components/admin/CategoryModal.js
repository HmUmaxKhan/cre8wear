'use client';
import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CategoryModal({ category, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      // Trim and validate name
      const trimmedName = formData.name.trim();
      const trimmedDescription = formData.description.trim();

      formDataToSend.append('name', trimmedName);
      formDataToSend.append('description', trimmedDescription);

      if (image) {
        formDataToSend.append('image', image);
      }

      // Log FormData contents for debugging
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        }
      };

      if (category?._id) {
        const response = await axios.patch(
          `${API_URL}/api/categories/${category._id}`,
          formDataToSend,
          config
        );
        console.log('Update response:', response.data);
      } else {
        const response = await axios.post(
          `http://localhost:5001/api/categories`,
          formDataToSend,
          config
        );
        console.log('Create response:', response.data);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error Details:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto my-8 shadow-xl">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                placeholder="Enter category description"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                         file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 
                         disabled:bg-blue-300 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}