'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createProduct } from '@/lib/mock/admin';
import type { Product } from '@/lib/mock/products';
import ImageUpload from '@/components/admin/ImageUpload';

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

type Category = Product['category'];
const categories: { value: Category; label: string }[] = [
  { value: 'dark', label: 'Dark Chocolate' },
  { value: 'milk', label: 'Milk Chocolate' },
  { value: 'white', label: 'White Chocolate' },
  { value: 'assorted', label: 'Assorted' },
];

interface FormData {
  name: string;
  description: string;
  longDescription: string;
  price: string;
  category: Category;
  ingredients: string[];
  allergens: string[];
  weight: string;
  image: string;
  inStock: boolean;
  featured: boolean;
}

const initialFormData: FormData = {
  name: '',
  description: '',
  longDescription: '',
  price: '',
  category: 'dark',
  ingredients: [''],
  allergens: [''],
  weight: '',
  image: '/images/placeholder-product.jpg', // TODO: Replace with actual placeholder
  inStock: true,
  featured: false,
};

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ''],
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  const handleIngredientChange = (index: number, value: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.map((ingredient, i) =>
        i === index ? value : ingredient
      ),
    });
  };

  const handleAddAllergen = () => {
    setFormData({
      ...formData,
      allergens: [...formData.allergens, ''],
    });
  };

  const handleRemoveAllergen = (index: number) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter((_, i) => i !== index),
    });
  };

  const handleAllergenChange = (index: number, value: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.map((allergen, i) =>
        i === index ? value : allergen
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name.trim()) throw new Error('Product name is required');
      if (!formData.description.trim()) throw new Error('Description is required');
      if (!formData.longDescription.trim()) throw new Error('Long description is required');
      if (!formData.price || isNaN(Number(formData.price))) throw new Error('Valid price is required');
      if (!formData.weight || isNaN(Number(formData.weight))) throw new Error('Valid weight is required');
      if (formData.ingredients.some((i) => !i.trim())) throw new Error('All ingredients must be filled');
      if (formData.allergens.some((a) => !a.trim())) throw new Error('All allergens must be filled');

      // Create product
      await createProduct({
        name: formData.name,
        description: formData.description,
        longDescription: formData.longDescription,
        price: Number(formData.price),
        category: formData.category,
        ingredients: formData.ingredients,
        allergens: formData.allergens,
        weight: Number(formData.weight),
        image: formData.image,
        inStock: formData.inStock,
        featured: formData.featured,
      });

      // Redirect to products page
      router.push('/admin/products');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while creating the product');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="font-display text-3xl mb-2">New Product</h1>
          <p className="text-stone-600">Create a new chocolate product.</p>
        </motion.div>

        {/* Form */}
        <motion.form
          variants={containerVariants}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Info */}
          <motion.div variants={itemVariants} className="card space-y-6">
            <h2 className="font-display text-xl">Basic Information</h2>
            
            <div>
              <label htmlFor="name" className="label">Product Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="e.g., Thor's Thunder"
              />
            </div>

            <div>
              <label htmlFor="description" className="label">Short Description</label>
              <input
                id="description"
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                placeholder="Brief product description"
              />
            </div>

            <div>
              <label htmlFor="longDescription" className="label">Full Description</label>
              <textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                className="input-field min-h-[100px]"
                placeholder="Detailed product description"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="label">Price ($)</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label htmlFor="weight" className="label">Weight (g)</label>
                <input
                  id="weight"
                  type="number"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="input-field"
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="label">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="input-field"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Ingredients */}
          <motion.div variants={itemVariants} className="card space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-xl">Ingredients</h2>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="btn-secondary"
              >
                Add Ingredient
              </button>
            </div>

            <div className="space-y-4">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="e.g., Dark Chocolate"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Allergens */}
          <motion.div variants={itemVariants} className="card space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-xl">Allergens</h2>
              <button
                type="button"
                onClick={handleAddAllergen}
                className="btn-secondary"
              >
                Add Allergen
              </button>
            </div>

            <div className="space-y-4">
              {formData.allergens.map((allergen, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={allergen}
                    onChange={(e) => handleAllergenChange(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="e.g., Milk"
                  />
                  {formData.allergens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergen(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image Upload */}
          <motion.div variants={itemVariants} className="card space-y-6">
            <h2 className="font-display text-xl">Product Image</h2>
            <ImageUpload
              currentImage={formData.image}
              onImageSelect={(file) => {
                // In a real app, we would upload the file to a storage service
                // For now, we'll create a temporary URL
                const url = URL.createObjectURL(file);
                setFormData({ ...formData, image: url });
              }}
            />
          </motion.div>

          {/* Options */}
          <motion.div variants={itemVariants} className="card space-y-6">
            <h2 className="font-display text-xl">Options</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 rounded border-stone-300 text-primary-600 focus:ring-primary-600"
                />
                <span>In Stock</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-stone-300 text-primary-600 focus:ring-primary-600"
                />
                <span>Featured Product</span>
              </label>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Form Actions */}
          <motion.div variants={itemVariants} className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
} 