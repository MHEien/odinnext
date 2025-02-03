'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Product,
  ProductFilters,
  CreateProductData,
  UpdateProductData,
  getFilteredProducts,
  deleteProduct,
  categories,
  formatPrice,
} from '@/lib/mock/products';
import { useToast } from '@/lib/hooks/useToast';
import ProductForm from '@/components/admin/ProductForm';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState<string | null>(null);
  const showToast = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getFilteredProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        showToast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (
    name: keyof ProductFilters,
    value: string | boolean | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };

  const handleDelete = async (productId: string) => {
    try {
      setIsDeletingProduct(productId);
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast.error('Failed to delete product');
    } finally {
      setIsDeletingProduct(null);
    }
  };

  if (showForm) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl">
              {editingProduct ? 'Edit Product' : 'New Product'}
            </h1>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              className="text-stone-600 hover:text-stone-900"
            >
              ← Back to Products
            </button>
          </div>
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={async (data: CreateProductData | UpdateProductData) => {
              try {
                // In a real app, this would call the API
                // For now, we'll just update the local state
                if (editingProduct) {
                  const updateData = data as UpdateProductData;
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.id === editingProduct.id
                        ? {
                            ...p,
                            ...(updateData.name && { name: updateData.name }),
                            ...(updateData.description && {
                              description: updateData.description,
                            }),
                            ...(updateData.longDescription && {
                              longDescription: updateData.longDescription,
                            }),
                            ...(updateData.price && { price: updateData.price }),
                            ...(updateData.image && { image: updateData.image }),
                            ...(updateData.category && {
                              category: updateData.category,
                            }),
                            ...(updateData.ingredients && {
                              ingredients: updateData.ingredients,
                            }),
                            ...(updateData.allergens && {
                              allergens: updateData.allergens,
                            }),
                            ...(updateData.weight && { weight: updateData.weight }),
                            ...(updateData.nutritionalInfo && {
                              nutritionalInfo: updateData.nutritionalInfo,
                            }),
                            featured: updateData.featured ?? p.featured,
                            inStock: updateData.inStock ?? p.inStock,
                            updatedAt: new Date().toISOString(),
                          }
                        : p
                    )
                  );
                } else {
                  const createData = data as CreateProductData;
                  const newProduct: Product = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: createData.name,
                    description: createData.description,
                    longDescription: createData.longDescription,
                    price: createData.price,
                    image: createData.image,
                    category: createData.category,
                    ingredients: createData.ingredients,
                    allergens: createData.allergens,
                    weight: createData.weight,
                    featured: createData.featured ?? false,
                    inStock: createData.inStock ?? true,
                    nutritionalInfo: createData.nutritionalInfo,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };
                  setProducts((prev) => [...prev, newProduct]);
                }
                setShowForm(false);
                setEditingProduct(null);
              } catch (error) {
                console.error('Error saving product:', error);
                throw error;
              }
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl">Products</h1>
            <p className="text-stone-600">
              Manage your chocolate products catalog
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add Product
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'category',
                    e.target.value as ProductFilters['category']
                  )
                }
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Status
              </label>
              <select
                value={
                  filters.inStock === undefined
                    ? ''
                    : filters.inStock
                    ? 'true'
                    : 'false'
                }
                onChange={(e) =>
                  handleFilterChange(
                    'inStock',
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'true'
                  )
                }
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Status</option>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Featured
              </label>
              <select
                value={
                  filters.featured === undefined
                    ? ''
                    : filters.featured
                    ? 'true'
                    : 'false'
                }
                onChange={(e) =>
                  handleFilterChange(
                    'featured',
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'true'
                  )
                }
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Products</option>
                <option value="true">Featured Only</option>
                <option value="false">Non-Featured Only</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div variants={itemVariants}>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <svg
                className="w-12 h-12 text-stone-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-lg font-medium text-stone-900 mb-2">
                No products found
              </h3>
              <p className="text-stone-600">
                Try adjusting your filters or add a new product.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm overflow-hidden group"
                >
                  <div className="relative h-48">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-stone-100"
                      >
                        <svg
                          className="w-5 h-5 text-stone-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeletingProduct === product.id}
                        className="p-2 bg-white rounded-full hover:bg-stone-100"
                      >
                        {isDeletingProduct === product.id ? (
                          <svg
                            className="w-5 h-5 text-stone-600 animate-spin"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-stone-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-stone-600 mt-1">
                          {product.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(product.price)} kr
                        </p>
                        <p className="text-sm text-stone-500 mt-1">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      {product.featured && (
                        <span className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-600 rounded-full">
                          Featured
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.inStock
                            ? 'bg-green-50 text-green-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
} 