'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ProductGrid({
    categoryId = 'all',
    priceRange = [0, 10000],
    sortBy = 'featured',
    searchQuery = ''
}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        async function fetchProducts() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('http://localhost:5001/api/products', {
                    signal: controller.signal
                });
                
                if (!response.ok) throw new Error('Failed to fetch products');
                
                let data = await response.json();
                
                // Apply category filter
                if (categoryId && categoryId !== 'all') {
                    data = data.filter(product => product.category?._id === categoryId);
                }
                
                // Apply search query filter
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    data = data.filter(product =>
                        product.name.toLowerCase().includes(query) ||
                        product.description?.toLowerCase().includes(query)
                    );
                }
                
                // Apply price filter
                data = data.filter(product =>
                    product.price >= priceRange[0] && product.price <= priceRange[1]
                );
                
                // Apply sorting
                switch (sortBy) {
                    case 'price-low':
                        data.sort((a, b) => a.price - b.price);
                        break;
                    case 'price-high':
                        data.sort((a, b) => b.price - a.price);
                        break;
                    case 'newest':
                        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        break;
                    case 'rating':
                        data.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                        break;
                    case 'featured':
                    default:
                        data = data.filter(product => product.feature)
                            .concat(data.filter(product => !product.feature));
                }
                
                if (isMounted) {
                    setProducts(data);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted && error.name !== 'AbortError') {
                    setError(error.message);
                    setLoading(false);
                }
            }
        }

        fetchProducts();

        // Cleanup function
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [categoryId, priceRange, sortBy, searchQuery]);

    // Render loading state
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div 
                        key={index} 
                        className="bg-gray-200 rounded-lg animate-pulse h-80" 
                    />
                ))}
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <p className="text-gray-600 mt-2">Unable to load products. Please try again later.</p>
            </div>
        );
    }

    // Render no products state
    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">No products found</h2>
                <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
            </div>
        );
    }

    // Render products
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            {products.map((product) => (
                <ProductCard 
                    key={product._id} 
                    product={product} 
                />
            ))}
        </motion.div>
    );
}