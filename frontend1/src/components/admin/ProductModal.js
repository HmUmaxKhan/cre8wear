'use client';
import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductModal({ product, categories, onClose, onSave }) {
  const [formData, setFormData] = useState(
    product || {
      name: "",
      description: "",
      price: "",
      category: "",
      feature: false,
      variants: [],
    }
  );
  const [variants, setVariants] = useState(product?.variants || []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "variants") {
        formDataToSend.append(key, formData[key]);
      }
    });

    variants.forEach((variant, index) => {
      if (variant.frontImageFile) {
        formDataToSend.append(`frontImage-${index}`, variant.frontImageFile);
      }
      if (variant.backImageFile) {
        formDataToSend.append(`backImage-${index}`, variant.backImageFile);
      }
    });

    formDataToSend.append(
      "variants",
      JSON.stringify(
        variants.map((variant) => ({
          color: variant.color,
          inventory: variant.inventory,
          frontImage: variant.frontImage,
          backImage: variant.backImage,
        }))
      )
    );

    try {
      if (product?._id) {
        await axios.patch(`${API_URL}/api/products/${product._id}`, formDataToSend);
      } else {
        await axios.post(`${API_URL}/api/products`, formDataToSend);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    }
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
  };

  const handleFileChange = (index, type, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedVariants = [...variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [`${type}ImageFile`]: file,
        [`${type}ImagePreview`]: URL.createObjectURL(file),
      };
      setVariants(updatedVariants);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto my-8 mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="sticky top-0 bg-white p-6 border-b z-10">
          <h2 className="text-xl font-bold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price"
                className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                step="0.01"
              />
            </div>

            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <select
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="feature"
                className="w-4 h-4"
                checked={formData.feature}
                onChange={(e) => setFormData({ ...formData, feature: e.target.checked })}
              />
              <label htmlFor="feature">Featured Product</label>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-4">Variants</h3>
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg mb-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Color"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={variant.color || ""}
                      onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                      required
                    />
                    <div className="grid grid-cols-5 gap-2">
                      {["XS", "S", "M", "L", "XL"].map((size) => (
                        <input
                          key={size}
                          type="number"
                          placeholder={size}
                          className="p-2 border rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={variant.inventory?.[size] || ""}
                          onChange={(e) =>
                            handleVariantChange(index, "inventory", {
                              ...variant.inventory,
                              [size]: parseInt(e.target.value) || 0,
                            })
                          }
                          min="0"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Front Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, "front", e)}
                        className="mb-2"
                      />
                      {(variant.frontImagePreview || variant.frontImage) && (
                        <img
                          src={variant.frontImagePreview || variant.frontImage}
                          alt="Front preview"
                          className="mt-2 h-32 object-contain"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block mb-2">Back Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, "back", e)}
                        className="mb-2"
                      />
                      {(variant.backImagePreview || variant.backImage) && (
                        <img
                          src={variant.backImagePreview || variant.backImage}
                          alt="Back preview"
                          className="mt-2 h-32 object-contain"
                        />
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={() => {
                      const newVariants = [...variants];
                      newVariants.splice(index, 1);
                      setVariants(newVariants);
                    }}
                  >
                    Remove Variant
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                onClick={() => setVariants([...variants, { color: "", inventory: {} }])}
              >
                Add Variant
              </button>
            </div>

            <div className="sticky bottom-0 bg-white pt-4 pb-4 border-t mt-6">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}