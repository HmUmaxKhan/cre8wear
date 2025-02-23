// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
      //  required: true,
        trim: true
    },
    image: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});
// models/Review.js
const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String
    }],
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, {
    timestamps: true
});
// models/Product.js
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
       // required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    feature: {
        type: Boolean,
        default: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    variants: [{
        color: {
            type: String,
            required: true
        },
        frontImage: {
            type: String,
          //  required: true
        },
        backImage: {
            type: String,
          //  required: true
        },
        inventory: {
            XS: {
                type: Number,
                default: 0,
                min: 0
            },
            S: {
                type: Number,
                default: 0,
                min: 0
            },
            M: {
                type: Number,
                default: 0,
                min: 0
            },
            L: {
                type: Number,
                default: 0,
                min: 0
            },
            XL: {
                type: Number,
                default: 0,
                min: 0
            }
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId'
});

const orderSchema = new mongoose.Schema({
    orderNo: {
        type: Number,
        unique: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    province: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        required: true,
        trim: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        color: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: true,
            enum: ['XS', 'S', 'M', 'L', 'XL']
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        frontImage: {
            type: String,
            required: true
        },
        backImage: {
            type: String,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

// Auto-increment order number
orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastOrder = await this.constructor.findOne({}, {}, { sort: { 'orderNo': -1 } });
        this.orderNo = lastOrder ? lastOrder.orderNo + 1 : 1;
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const Review = mongoose.model('Review', reviewSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { Category, Product, Review, Order };