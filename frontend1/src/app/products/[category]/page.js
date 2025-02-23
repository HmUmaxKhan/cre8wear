'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductFilters from '@/components/products/ProductFilters';
import ProductCard from '@/components/products/ProductCard';
import { useParams } from 'next/navigation';

const API_URL = "http://localhost:5001/api";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function CategoryPage() {
    const params = useParams();
    
    // Slug and category name conversion
    const categorySlug = params?.category
        ? decodeURIComponent(params.category.toString())
        : null;

    // State for filtering and sorting
    const [selectedCategory, setSelectedCategory] = useState(() => {
        // Convert slug to proper category name
        const slugToNameMapping = {
            't-shirts': 'T-Shirts',
            'baggy-shirts': 'Baggy Shirts',
            'hoodie': 'Hoodie',
            'shirts': 'Shirts',
            'pants': 'Pants',
            'pents': 'Pants'
        };
        
        return slugToNameMapping[categorySlug] || 'All Products';
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [sortBy, setSortBy] = useState('featured');

    // Fetch states
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch category and products
    useEffect(() => {
        if (!categorySlug) return;

        const fetchCategoryAndProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/products/by-category/${categorySlug}`, {
                    cache: 'no-store',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch category products');
                }

                const result = await response.json();
                setCategory(result.category);
                setProducts(result.products);
                setError(null);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryAndProducts();
    }, [categorySlug]);

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
            {/* Category Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-3xl font-bold mt-14 capitalize text-gray-900">
                    {category?.name || 'Products'}
                </h1>
                {category?.description && (
                    <p className="mt-4 text-gray-600">{category.description}</p>
                )}
            </motion.div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            >
                {/* Search Input */}
                <div className="w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Filters */}
                <div className="w-full max-w-xs">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest</option>
                        <option value="rating">Best Rating</option>
                    </select>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
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
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {processedProducts.map((product) => (
                                <ProductCard 
                                    key={product._id} 
                                    product={product} 
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900">No products found</h2>
                            <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}