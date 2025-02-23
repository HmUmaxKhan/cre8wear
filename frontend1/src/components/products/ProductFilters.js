'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProductFilters({
    selectedCategory,
    onCategoryChange,
    priceRange,
    onPriceRangeChange,
    sortBy,
    onSortChange
}) {
    const params = useParams();
    const [categories, setCategories] = useState([]);

    // Create slug from category name
    const createSlug = (name) => {
        return name.toLowerCase().replace(/\s+/g, '-');
    };

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/categories');
                if (!response.ok) throw new Error('Failed to fetch categories');
                
                const data = await response.json();
                const processedCategories = [
                    { name: 'All Products', slug: 'all-products' },
                    ...data.map(category => ({
                        ...category,
                        slug: createSlug(category.name)
                    }))
                ];

                setCategories(processedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="bg-gray-100 p-4 rounded-lg space-y-6">
            {/* Categories */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <Link
                            key={category._id || category.slug}
                            href={category.name === 'All Products' 
                                ? '/products' 
                                : `/products/${category.slug}`}
                            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                (params?.category === category.slug || 
                                 (category.name === 'All Products' && !params?.category))
                                    ? 'bg-blue-500 text-white' 
                                    : 'hover:bg-gray-200'
                            }`}
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                <div className="flex items-center space-x-4">
                    <span>Rs {priceRange[0]}</span>
                    <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange[1]}
                        onChange={(e) => onPriceRangeChange([0, Number(e.target.value)])}
                        className="flex-grow"
                    />
                    <span>Rs {priceRange[1]}</span>
                </div>
            </div>

            {/* Sort By */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Sort By</h3>
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Best Rating</option>
                </select>
            </div>
        </div>
    );
}