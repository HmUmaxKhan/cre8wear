"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import TabNavigation from "@/components/admin/TabNavigation";
import ProductModal from "@/components/admin/ProductModal";
import CategoryModal from "@/components/admin/CategoryModal";
import OrdersTab from "@/components/admin/OrdersTab";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user) {
      router.push('/auth/login');
      return;
    }

    fetchData();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const categoriesResponse = await fetch(`${API_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok || !categoriesResponse.ok) {
        if (response.status === 401 || categoriesResponse.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to fetch data');
      }

      const productsData = await response.json();
      const categoriesData = await categoriesResponse.json();
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/${type}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/auth/login');
            return;
          }
          throw new Error('Failed to delete item');
        }

        fetchData();
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Error deleting item");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl mt-24 sm:text-2xl font-bold mb-4 sm:mb-6">
          Admin Dashboard
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/auth/login');
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        tabs={["products", "categories", "orders"]}
      />

      {activeTab === "products" && (
        <div>
          <div className="flex justify-end mb-3 sm:mb-4">
            <button
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
              onClick={() => {
                setCurrentProduct(null);
                setShowProductModal(true);
              }}
            >
              Add New Product
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-3 sm:p-4 rounded shadow hover:shadow-md"
              >
                <h3 className="font-bold text-base sm:text-lg">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {product.description}
                </p>
                <p className="text-green-600 font-bold text-sm sm:text-base">
                  Rs{product.price}
                </p>
                <p className="text-sm sm:text-base">
                  Category: {product.category?.name}
                </p>
                {product.feature && (
                  <p className="text-blue-500 text-sm sm:text-base">
                    ✨ Featured Product
                  </p>
                )}

                <div className="mt-3 sm:mt-4">
                  <h4 className="font-semibold text-sm sm:text-base">
                    Variants:
                  </h4>
                  {product.variants.map((variant, index) => (
                    <div key={index} className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="font-medium text-sm sm:text-base">
                        {variant.color}
                      </p>
                      <div className="grid grid-cols-5 gap-1 mt-1">
                        {Object.entries(variant.inventory).map(
                          ([size, qty]) => (
                            <div key={size} className="text-xs sm:text-sm">
                              {size}: {qty}
                            </div>
                          )
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {variant.frontImage && (
                          <img
                            src={variant.frontImage}
                            alt={`${product.name} ${variant.color} front`}
                            className="w-full h-24 sm:h-32 object-cover rounded"
                          />
                        )}
                        {variant.backImage && (
                          <img
                            src={variant.backImage}
                            alt={`${product.name} ${variant.color} back`}
                            className="w-full h-24 sm:h-32 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 sm:mt-4 space-x-2">
                  <button
                    className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
                    onClick={() => {
                      setCurrentProduct(product);
                      setShowProductModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
                    onClick={() => handleDelete(product._id, "products")}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div>
          <div className="flex justify-end mb-3 sm:mb-4">
            <button
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
              onClick={() => {
                setCurrentCategory(null);
                setShowCategoryModal(true);
              }}
            >
              Add New Category
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="border p-3 sm:p-4 rounded shadow hover:shadow-md"
              >
                <h3 className="font-bold text-base sm:text-lg">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {category.description}
                </p>
                <div className="mt-3 sm:mt-4 space-x-2">
                  <button
                    className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
                    onClick={() => {
                      setCurrentCategory(category);
                      setShowCategoryModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
                    onClick={() => handleDelete(category._id, "categories")}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <OrdersTab API_URL={API_URL} />
      )}

      {showProductModal && (
        <ProductModal
          product={currentProduct}
          categories={categories}
          onClose={() => {
            setShowProductModal(false);
            setCurrentProduct(null);
          }}
          onSave={fetchData}
          API_URL={API_URL}
        />
      )}
      {showCategoryModal && (
        <CategoryModal
          category={currentCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setCurrentCategory(null);
          }}
          onSave={fetchData}
          API_URL={API_URL}
        />
      )}
    </div>
  );
}