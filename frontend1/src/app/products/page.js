'use client';
import { useState, useEffect, useMemo } from 'react';
import ProductGrid from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { motion } from 'framer-motion';

export default function ProductsPage() {
    // State for filtering and sorting
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [sortBy, setSortBy] = useState('featured');

    // Products state
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5001/api/products', {
                    cache: 'no-store',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filtered and sorted products
    const processedProducts = useMemo(() => {
        let filteredProducts = [...products];

        // Category filter
        if (selectedCategory !== 'All Products') {
            filteredProducts = filteredProducts.filter(
                product => product.category?.name === selectedCategory
            );
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query)
            );
        }

        // Price filter
        filteredProducts = filteredProducts.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Sorting
        switch (sortBy) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'rating':
                filteredProducts.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            case 'featured':
            default:
                filteredProducts = filteredProducts.filter(product => product.feature)
                    .concat(filteredProducts.filter(product => !product.feature));
        }

        return filteredProducts;
    }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
                <p className="text-gray-600 text-center mb-8">{error}</p>
                <a href="/" className="text-blue-600 hover:text-blue-800">Return to Home</a>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Page Title */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-center mt-14 text-gray-900"
            >
                Our Products
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Search Bar */}
                <div className="mt-4 w-full flex justify-center">
                    <div className="relative w-full max-w-xl">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <ProductFilters
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            priceRange={priceRange}
                            onPriceRangeChange={setPriceRange}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />
                    </div>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        {processedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {processedProducts.map((product) => (
                                    <ProductGrid 
                                        key={product._id} 
                                        product={product} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <h2 className="text-2xl font-bold text-gray-900">No products found</h2>
                                <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}