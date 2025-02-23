const express = require('express');
const router = express.Router();
const { Product, Category, Review, Order } = require('../models/schemas');
const { upload, deleteFileFromS3, getS3Url } = require('../config/s3Config');

// Helper function to process variants data
const processVariantsData = (variantsData, files) => {
    try {
        const variants = typeof variantsData === 'string' 
            ? JSON.parse(variantsData) 
            : variantsData;

        return variants.map((variant, index) => {
            const frontImage = files?.find(f => f.fieldname === `frontImage-${index}`);
            const backImage = files?.find(f => f.fieldname === `backImage-${index}`);
            
            return {
                ...variant,
                frontImage: frontImage ? frontImage.location : variant.frontImage || null,
                backImage: backImage ? backImage.location : variant.backImage || null
            };
        });
    } catch (error) {
        console.error('Error processing variants:', error);
        throw new Error('Invalid variants data');
    }
};

// Helper function to update product rating
async function updateProductRating(productId) {
    const reviews = await Review.find({ productId });
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        await Product.findByIdAndUpdate(productId, {
            averageRating,
            reviewCount: reviews.length
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            averageRating: 0,
            reviewCount: 0
        });
    }
}

// Helper function to update product inventory
async function updateProductInventory(items, increase = false) {
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        const variant = product.variants.find(v => v.color === item.color);
        if (!variant) continue;

        const quantity = increase ? item.quantity : -item.quantity;
        variant.inventory[item.size] += quantity;

        await product.save();
    }
}

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category')
            .populate('reviews');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single product
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category')
            .populate('reviews');
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new product
router.post('/products', upload.any(), async (req, res) => {
    try {
        console.log('Files received:', req.files); // Debug log
        console.log('Body received:', req.body); // Debug log

        if (!req.body.variants) {
            return res.status(400).json({ error: 'Variants are required' });
        }

        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            feature: req.body.feature === 'true',
            variants: processVariantsData(req.body.variants, req.files || [])
        };

        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        // Clean up any uploaded files if there's an error
        if (req.files) {
            for (const file of req.files) {
                await deleteFileFromS3(file.key);
            }
        }
        res.status(400).json({ error: error.message });
    }
});

// Update product
router.patch('/products/:id', upload.any(), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const oldImages = product.variants.reduce((acc, variant) => {
            if (variant.frontImage) acc.push(variant.frontImage);
            if (variant.backImage) acc.push(variant.backImage);
            return acc;
        }, []);

        const updates = Object.keys(req.body);
        updates.forEach(update => {
            if (update === 'variants') {
                product.variants = processVariantsData(req.body.variants, req.files || []);
            } else {
                product[update] = req.body[update];
            }
        });

        await product.save();

        const newImages = product.variants.reduce((acc, variant) => {
            if (variant.frontImage) acc.push(variant.frontImage);
            if (variant.backImage) acc.push(variant.backImage);
            return acc;
        }, []);

        for (const oldImage of oldImages) {
            if (!newImages.includes(oldImage)) {
                const key = oldImage.split('/').slice(-4).join('/');
                await deleteFileFromS3(key);
            }
        }

        res.json(product);
    } catch (error) {
        if (req.files) {
            for (const file of req.files) {
                await deleteFileFromS3(file.key);
            }
        }
        res.status(400).json({ error: error.message });
    }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete product images
        for (const variant of product.variants) {
            if (variant.frontImage) {
                const frontKey = variant.frontImage.split('/').slice(-4).join('/');
                await deleteFileFromS3(frontKey);
            }
            if (variant.backImage) {
                const backKey = variant.backImage.split('/').slice(-4).join('/');
                await deleteFileFromS3(backKey);
            }
        }

        // Delete product and associated reviews
        await Promise.all([
            Product.findByIdAndDelete(req.params.id),
            Review.deleteMany({ productId: req.params.id })
        ]);

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Review Routes
// Get Routes
router.get('/products/:productId/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add review
router.post('/products/:productId/reviews', upload.array('images', 5), async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const review = new Review({
            ...req.body,
            productId: req.params.productId,
            images: req.files ? req.files.map(file => file.location) : []
        });

        await review.save();
        await updateProductRating(req.params.productId);
        
        res.status(201).json(review);
    } catch (error) {
        // Clean up uploaded files if there's an error
        if (req.files) {
            for (const file of req.files) {
                await deleteFileFromS3(file.key);
            }
        }
        res.status(400).json({ error: error.message });
    }
});

// Update review
router.patch('/products/:productId/reviews/:reviewId', upload.array('images', 5), async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const oldImages = [...review.images];

        // Update basic fields
        const updates = Object.keys(req.body);
        updates.forEach(update => {
            if (update !== 'images') {
                review[update] = req.body[update];
            }
        });

        // Handle new images
        if (req.files && req.files.length > 0) {
            // Add new images to existing ones
            const newImageLocations = req.files.map(file => file.location);
            review.images = [...review.images, ...newImageLocations];
        }

        // Handle image deletions if specified
        if (req.body.deletedImages) {
            const deletedImages = JSON.parse(req.body.deletedImages);
            // Remove deleted images from review
            review.images = review.images.filter(img => !deletedImages.includes(img));
            
            // Delete from S3
            for (const img of deletedImages) {
                const imageKey = img.split('/').slice(-4).join('/');
                await deleteFileFromS3(imageKey);
            }
        }

        await review.save();
        await updateProductRating(req.params.productId);

        res.json(review);
    } catch (error) {
        // Clean up any newly uploaded files if there's an error
        if (req.files) {
            for (const file of req.files) {
                await deleteFileFromS3(file.key);
            }
        }
        res.status(400).json({ error: error.message });
    }
});

// Delete review
router.delete('/products/:productId/reviews/:reviewId', async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Delete all images from S3
        if (review.images && review.images.length > 0) {
            for (const image of review.images) {
                const imageKey = image.split('/').slice(-4).join('/');
                await deleteFileFromS3(imageKey);
            }
        }

        await Review.findByIdAndDelete(req.params.reviewId);
        await updateProductRating(req.params.productId);

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Category routes (unchanged)
// Category routes with S3 integration
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create category with optional image
router.post('/categories', upload.single('image'), async (req, res) => {
    try {
        const categoryData = {
            name: req.body.name,
            description: req.body.description
        };

        // Add image only if it was uploaded
        if (req.file) {
            categoryData.image = req.file.location;
        }

        const category = new Category(categoryData);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        // Clean up uploaded image if there's an error
        if (req.file) {
            await deleteFileFromS3(req.file.key);
        }
        res.status(400).json({ error: error.message });
    }
});

// Update category
router.patch('/categories/:id', upload.single('image'), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Store old image for potential deletion
        const oldImage = category.image;

        // Update basic fields
        if (req.body.name) category.name = req.body.name;
        if (req.body.description) category.description = req.body.description;

        // Update image if provided
        if (req.file) {
            category.image = req.file.location;
            // Delete old image from S3 if it exists
            if (oldImage) {
                const oldImageKey = oldImage.split('/').slice(-4).join('/');
                await deleteFileFromS3(oldImageKey);
            }
        }

        await category.save();
        res.json(category);
    } catch (error) {
        // Clean up uploaded image if there's an error
        if (req.file) {
            await deleteFileFromS3(req.file.key);
        }
        res.status(400).json({ error: error.message });
    }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete image from S3 if it exists
        if (category.image) {
            const imageKey = category.image.split('/').slice(-4).join('/');
            await deleteFileFromS3(imageKey);
        }

        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single category
router.get('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get products by category slug
router.get('/products/by-category/:slug', async (req, res) => {
    try {
        // Log the incoming slug
        console.log('Incoming Category Slug:', req.params.slug);

        // Convert the slug to match category name format
        const categorySlug = req.params.slug.toLowerCase();
        
        // Find category by matching the slug
        const categories = await Category.find();
        
        // More robust slug matching
        const category = categories.find(cat => {
            const slugifiedCategoryName = cat.name.toLowerCase().replace(/\s+/g, '-');
            console.log(`Comparing: ${slugifiedCategoryName} === ${categorySlug}`);
            return slugifiedCategoryName === categorySlug;
        });

        // Detailed logging for category finding
        if (!category) {
            console.warn('No category found. Available categories:', 
                categories.map(cat => ({
                    name: cat.name, 
                    slugifiedName: cat.name.toLowerCase().replace(/\s+/g, '-')
                }))
            );
            
            return res.status(404).json({
                error: 'Category not found',
                message: `No category found for slug: ${categorySlug}`,
                availableCategories: categories.map(cat => ({
                    name: cat.name, 
                    slugifiedName: cat.name.toLowerCase().replace(/\s+/g, '-')
                }))
            });
        }

        // Find all products in this category
        const products = await Product.find({ category: category._id })
            .populate('category')
            .populate('reviews');

        console.log('Found Category:', category);
        console.log('Found Products:', products);

        res.json({
            category,
            products
        });
    } catch (error) {
        console.error('Complete Route Error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Create new order
router.post('/orders', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['customerName', 'contactNumber', 'address', 'city', 'province', 'pincode', 'items'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `${field} is required` });
            }
        }

        // Validate inventory before creating order
        for (const item of req.body.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ error: `Product not found: ${item.productId}` });
            }

            const variant = product.variants.find(v => v.color === item.color);
            if (!variant) {
                return res.status(400).json({ error: `Color ${item.color} not found for product` });
            }

            if (!variant.inventory[item.size] || variant.inventory[item.size] < item.quantity) {
                return res.status(400).json({ 
                    error: `Insufficient inventory for ${product.name} in ${item.color}, size ${item.size}` 
                });
            }
        }

        const order = new Order(req.body);
        await order.save();
        await updateProductInventory(req.body.items);

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Get all orders
router.get('/orders', async (req, res) => {
    try {
      const orders = await Order.find()
        .sort('-createdAt');
      
      res.json(orders);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  });
// Get single order
router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order
router.patch('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Handle inventory if items are being updated
        if (req.body.items) {
            await updateProductInventory(order.items, true); // Restore old inventory

            // Validate new inventory
            for (const item of req.body.items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return res.status(400).json({ error: `Product not found: ${item.productId}` });
                }

                const variant = product.variants.find(v => v.color === item.color);
                if (!variant) {
                    return res.status(400).json({ error: `Color ${item.color} not found for product` });
                }

                if (!variant.inventory[item.size] || variant.inventory[item.size] < item.quantity) {
                    return res.status(400).json({ 
                        error: `Insufficient inventory for ${product.name} in ${item.color}, size ${item.size}` 
                    });
                }
            }

            await updateProductInventory(req.body.items);
        }

        Object.keys(req.body).forEach(key => {
            order[key] = req.body[key];
        });

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete order
router.delete('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await updateProductInventory(order.items, true); // Restore inventory
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Track orders by contact number and email
router.post('/orders/track', async (req, res) => {
    try {
        const { contactNumber} = req.body;

        if (!contactNumber) {
            return res.status(400).json({ 
                error: 'Both contact number and email are required' 
            });
        }


        const orders = await Order.find({ 
            contactNumber: contactNumber,
        })
        .sort('-createdAt');

        if (!orders.length) {
            return res.status(404).json({ 
                message: 'No orders found with provided contact number and email' 
            });
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order details by order number
router.post('/orders/detail', async (req, res) => {
    try {
        const { orderNo, contactNumber, email } = req.body;

        if (!orderNo || !contactNumber || !email) {
            return res.status(400).json({ 
                error: 'Order number, contact number and email are required' 
            });
        }

        const order = await Order.findOne({
            orderNo: orderNo,
            contactNumber: contactNumber,
            email: email.toLowerCase()
        })
        .populate({
            path: 'items.productId',
            populate: { path: 'category' }
        });

        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found with provided details' 
            });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Quick status check
router.post('/orders/status-check', async (req, res) => {
    try {
        const { orderNo, contactNumber } = req.body;

        if (!orderNo || !contactNumber) {
            return res.status(400).json({ 
                error: 'Order number and contact number are required' 
            });
        }

        const order = await Order.findOne({
            orderNo: orderNo,
            contactNumber: contactNumber
        })
        .select('orderNo customerName totalAmount createdAt');

        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found with provided details' 
            });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;