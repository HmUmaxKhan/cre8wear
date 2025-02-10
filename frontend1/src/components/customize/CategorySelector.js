// /components/customize/CategorySelector.js
'use client'
import { useCustomizeStore } from './store/useCustomizeStore'

const CategorySelector = () => {
  const { setSelectedCategory } = useCustomizeStore();

  const categories = [
    {
      id: 'tshirt',
      name: 'T-Shirt',
      image: '/categories/tshirt.png',
      description: 'Classic fit t-shirt'
    },
    {
      id: 'hoodie',
      name: 'Hoodie',
      image: '/categories/hoodie.png',
      description: 'Comfortable pullover hoodie'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-medium mb-6">Select Product Category</h2>
      <div className="grid grid-cols-2 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className="flex flex-col items-center p-6 border rounded-lg hover:border-blue-500 transition-colors"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-32 h-32 object-contain mb-4"
            />
            <h3 className="text-lg font-medium">{category.name}</h3>
            <p className="text-gray-600 text-sm">{category.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;