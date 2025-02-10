// src/data/products.js
export const products = [
    {
      id: '1',
      name: 'Classic Cotton Hoodie',
      description: 'Premium cotton blend hoodie perfect for customization',
      price: 49.99,
      category: 'hoodies',
      images: {
        main: '/images/hoodies/classic-main.jpg',
        front: '/images/hoodies/classic-front.jpg',
        back: '/images/hoodies/classic-back.jpg',
        sides: [
          '/images/hoodies/classic-left.jpg',
          '/images/hoodies/classic-right.jpg'
        ]
      },
      colors: [
        { name: 'Black', code: '#000000' },
        { name: 'Navy', code: '#000080' },
        { name: 'Gray', code: '#808080' },
        { name: 'Red', code: '#FF0000' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      featured: true
    },
    {
      id: '2',
      name: 'Premium T-Shirt',
      description: 'High-quality cotton t-shirt for everyday wear',
      price: 29.99,
      category: 't-shirts',
      images: {
        main: '/images/t-shirts/premium-main.jpg',
        front: '/images/t-shirts/premium-front.jpg',
        back: '/images/t-shirts/premium-back.jpg',
        sides: [
          '/images/t-shirts/premium-left.jpg',
          '/images/t-shirts/premium-right.jpg'
        ]
      },
      colors: [
        { name: 'White', code: '#FFFFFF' },
        { name: 'Black', code: '#000000' },
        { name: 'Blue', code: '#0000FF' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      featured: true
    },
    {
      id: '3',
      name: 'Designer Jacket',
      description: 'Modern and stylish jacket for all seasons',
      price: 79.99,
      category: 'jackets',
      images: {
        main: '/images/jackets/designer-main.jpg',
        front: '/images/jackets/designer-front.jpg',
        back: '/images/jackets/designer-back.jpg',
        sides: [
          '/images/jackets/designer-left.jpg',
          '/images/jackets/designer-right.jpg'
        ]
      },
      colors: [
        { name: 'Black', code: '#000000' },
        { name: 'Brown', code: '#8B4513' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      featured: true
    }
  ];
  
  export const categories = [
    {
      id: 'hoodies',
      name: 'Hoodies',
      image: '/images/categories/hoodies.jpg',
      description: 'Comfortable and stylish hoodies'
    },
    {
      id: 'shirts',
      name: 'Shirts',
      image: '/images/categories/shirts.jpg',
      description: 'Classic button-up shirts'
    },
    {
      id: 't-shirts',
      name: 'T-Shirts',
      image: '/images/categories/t-shirts.jpg',
      description: 'Casual and customizable t-shirts'
    },
    {
      id: 'jackets',
      name: 'Jackets',
      image: '/images/categories/jackets.jpg',
      description: 'Stylish and durable jackets'
    }
  ];