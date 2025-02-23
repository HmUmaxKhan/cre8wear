"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReviewForm from "@/components/products/ReviewForm";
import { StarRating } from "@/components/products/ReviewForm";
import { useToast, ToastType } from '@/components/ToastNotification';

const defaultProductImage = "/placeholder-product.jpg";

export default function ProductPage() {
  const params = useParams();
  const productId = params.productId;
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(defaultProductImage);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5001/api/products/${productId}`
      );
      if (!response.ok) throw new Error("Product not found");
      const data = await response.json();

      const processedProduct = {
        _id: data._id || "",
        name: data.name || "Unnamed Product",
        description: data.description || "No description available",
        price: data.price || 0,
        averageRating: data.averageRating || 0,
        reviewCount: data.reviewCount || 0,
        variants:
          data.variants && data.variants.length > 0
            ? data.variants
            : [{ color: "Default", frontImage: defaultProductImage }],
        reviews: data.reviews || [],
      };

      setProduct(processedProduct);

      if (processedProduct.variants[0].frontImage) {
        setMainImage(processedProduct.variants[0].frontImage);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setLightboxImage(null);
      }
    };

    if (lightboxImage) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [lightboxImage]);

  const handleQuantityChange = (newQuantity) => {
    if (!selectedSize) {
      showToast("Please select a size first", ToastType.WARNING);
      return;
    }

    const availableQuantity = product.variants[selectedVariant]?.inventory?.[selectedSize] || 0;
    
    if (newQuantity > availableQuantity) {
      showToast(`Maximum available quantity is ${availableQuantity}`, ToastType.WARNING);
      setQuantity(availableQuantity);
      return;
    }

    if (newQuantity < 1) {
      setQuantity(1);
      return;
    }

    setQuantity(newQuantity);
  };

  const addToCart = () => {
    if (!selectedSize) {
      showToast("Please select a size", ToastType.WARNING);
      return;
    }
  
    const variant = product.variants[selectedVariant];
    if (!variant) {
      showToast("Please select a valid variant", ToastType.WARNING);
      return;
    }

    // Check available inventory for selected size
    const availableQuantity = variant.inventory?.[selectedSize] || 0;
    
    if (quantity > availableQuantity) {
      showToast(`Only ${availableQuantity} items available in size ${selectedSize}`, ToastType.WARNING);
      setQuantity(availableQuantity);
      return;
    }
  
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: variant.frontImage || defaultProductImage,
      color: variant.color,
      size: selectedSize,
      quantity: quantity,
      variantId: selectedVariant,
    };
  
    const existingCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItemIndex = existingCart.findIndex(
      (item) =>
        item.id === product._id &&
        item.size === selectedSize &&
        item.variantId === selectedVariant
    );

    // Check total quantity including cart
    if (existingItemIndex !== -1) {
      const totalQuantity = existingCart[existingItemIndex].quantity + quantity;
      if (totalQuantity > availableQuantity) {
        const remainingQuantity = availableQuantity - existingCart[existingItemIndex].quantity;
        showToast(
          `Cannot add ${quantity} more items. Only ${remainingQuantity} more available in size ${selectedSize}`,
          ToastType.WARNING
        );
        return;
      }
      existingCart[existingItemIndex].quantity = totalQuantity;
    } else {
      existingCart.push(cartItem);
    }
  
    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    showToast('Added to cart!', ToastType.SUCCESS);
  };

  const openLightbox = (imageSrc) => {
    setLightboxImage(imageSrc);
  };

  const handleVariantChange = (index) => {
    if (product?.variants?.[index]) {
      setSelectedVariant(index);
      const variant = product.variants[index];
      setMainImage(variant.frontImage || defaultProductImage);
      setSelectedSize(""); // Reset size when color changes
      setQuantity(1); // Reset quantity when color changes
    }
  };

  const getCurrentVariantImages = () => {
    if (!product?.variants?.[selectedVariant]) return [];

    const variant = product.variants[selectedVariant];
    const images = [];

    if (variant.frontImage) {
      images.push({
        src: variant.frontImage,
        alt: `${product.name} - ${variant.color} Front View`,
      });
    }

    if (variant.backImage) {
      images.push({
        src: variant.backImage,
        alt: `${product.name} - ${variant.color} Back View`,
      });
    }

    return images;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <Link href="/products" className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
            Return to products
          </Link>
        </div>
      </div>
    );
  }

  const variantImages = getCurrentVariantImages();
  const currentVariant = product.variants[selectedVariant];
  const availableQuantity = selectedSize ? (currentVariant?.inventory?.[selectedSize] || 0) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            {mainImage && (
              <div
                className="aspect-square relative overflow-hidden bg-gray-100 cursor-zoom-in"
                onClick={() => openLightbox(mainImage)}
              >
                <Image
                  src={mainImage}
                  alt={`${product.name} main view`}
                  fill
                  className="object-cover object-center"
                />
              </div>
            )}
          </div>

          {variantImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {variantImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative overflow-hidden rounded-lg border-2 border-gray-200 cursor-zoom-in"
                  onClick={() => openLightbox(image.src)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover object-center"
                    onClick={() => setMainImage(image.src)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6 p-6 border-2 border-gray-200 rounded-lg">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xl md:text-2xl font-semibold text-gray-900 mt-2">
              Rs {product.price.toFixed(2)}
            </p>
            <div className="mt-2 flex items-center">
              <StarRating rating={product.averageRating} />
              <span className="ml-2 text-gray-600">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg md:text-xl font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-gray-700">{product.description}</p>
          </div>

          {/* Color Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg md:text-xl font-medium text-gray-900">Select Color</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => handleVariantChange(index)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedVariant === index
                        ? "border-blue-600 ring-2 ring-blue-600 ring-offset-2"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: variant.color }}
                    title={variant.color}
                  >
                    <span className="sr-only">{variant.color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg md:text-xl font-medium text-gray-900">Select Size</h2>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {["XS", "S", "M", "L", "XL"].map((size) => {
                const inventory = currentVariant?.inventory?.[size] || 0;
                const isAvailable = inventory > 0;

                return (
                  <button
                    key={size}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    disabled={!isAvailable}
                    className={`py-2 text-sm font-medium rounded-md relative ${
                      selectedSize === size
                        ? "bg-blue-600 text-white"
                        : isAvailable
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {size}
                    {!isAvailable && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-red-500 font-bold">
                        Out of Stock
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg md:text-xl font-medium text-gray-900">Quantity</h2>
            <div className="flex items-center space-x-4 mt-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="bg-gray-100 text-gray-900 px-3 py-1 rounded-md hover:bg-gray-200"
                disabled={!selectedSize}
              >
                -
              </button>
              <span className="text-gray-900">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="bg-gray-100 text-gray-900 px-3 py-1 rounded-md hover:bg-gray-200"
                disabled={!selectedSize || quantity >= availableQuantity}
              >
                +
              </button>
              {selectedSize && (
                <span className="text-sm text-gray-500">
                  Available: {availableQuantity}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="pt-6">
            <button
              onClick={addToCart}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!selectedSize || availableQuantity === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="max-w-full max-h-full relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-0 right-0 m-4 text-white text-2xl z-60"
            >
              ✕
              </button>
            <Image
              src={lightboxImage}
              alt="Lightbox image"
              width={1000}
              height={1000}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-16 bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
            Reviews
          </h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Write a Review
          </button>
        </div>

        {showReviewForm && (
          <div className="mt-6">
            <ReviewForm
              productId={productId}
              onSubmit={() => {
                setShowReviewForm(false);
                fetchProduct();
              }}
            />
          </div>
        )}

        {/* Reviews List */}
        <div className="mt-8 space-y-8">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white shadow rounded-lg p-6 border"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {review.name || "Anonymous User"}
                  </h3>
                  <StarRating rating={review.rating || 0} />
                </div>
                <p className="mt-4 text-gray-700">
                  {review.description || "No review description"}
                </p>
                {review.images && review.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {review.images.map(
                      (image, index) =>
                        image && (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-zoom-in"
                            onClick={() => openLightbox(image)}
                          >
                            <Image
                              src={image}
                              alt={`Review image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )
                    )}
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : "Date not available"}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">
              No reviews yet. Be the first to review this product!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}