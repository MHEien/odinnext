'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductById, Product } from '@/lib/mock/products';
import { notFound } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { useSearchParams } from 'next/navigation';

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  
  if (!productId) {
    notFound();
  }

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(productId);
      if (!product) {
        notFound();
      }
      setProduct(product);
    };
    fetchProduct();
  }, [productId]);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Success Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg">
                Added to cart successfully!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square rounded-lg overflow-hidden"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <nav className="mb-8">
              <Link href="/shop" className="text-primary-600 hover:text-primary-700">
                ← Back to Shop
              </Link>
            </nav>

            <h1 className="font-display text-4xl mb-4">{product.name}</h1>
            <p className="text-2xl text-primary-600 font-semibold mb-6">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-stone-600 mb-8">{product.description}</p>

            {/* Product Details */}
            <div className="space-y-6 mb-8">
              {/* Weight */}
              <div>
                <h3 className="font-semibold mb-2">Weight</h3>
                <p className="text-stone-600">{product.weight}</p>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc list-inside text-stone-600">
                  {product.ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              {/* Nutritional Info */}
              <div>
                <h3 className="font-semibold mb-2">Nutritional Information</h3>
                <div className="text-stone-600">
                  <p>Serving Size: {product.ingredients}</p>
                  <p>Calories: {product.nutritionalInfo.calories}</p>
                  <p>Protein: {product.nutritionalInfo.protein}g</p>
                  <p>Carbohydrates: {product.nutritionalInfo.carbohydrates}g</p>
                  <p>Fat: {product.nutritionalInfo.fat}g</p>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-auto">
              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="quantity" className="font-semibold">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="input-field w-20"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <motion.button
                onClick={handleAddToCart}
                className="btn-primary w-full bg-primary-600 hover:bg-primary-700"
                whileTap={{ scale: 0.95 }}
              >
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 