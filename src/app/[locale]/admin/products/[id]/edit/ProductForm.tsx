'use client';

import { useState } from 'react';
import { useRouter} from '@/i18n/routing';
import { motion } from 'framer-motion';
import ImageUpload from '@/components/admin/ImageUpload';
import type { Category } from '@prisma/client';
import type { ProductWithStats } from '@/lib/db/actions/products';
import { updateProduct } from '@/lib/db/actions/products';

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

interface FormData {
  name: string;
  description: string;
  longDescription: string;
  price: string;
  categoryId: string;
  ingredients: string[];
  allergens: string[];
  weight: string;
  images: string[];
  stock: string;
  inStock: boolean;
  featured: boolean;
  nutritionalInfo: {
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
  };
}

interface ProductFormProps {
  product: ProductWithStats;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: product.name,
    description: product.description,
    longDescription: product.longDescription,
    price: String(product.price),
    categoryId: product.categoryId,
    ingredients: product.ingredients,
    allergens: product.allergens,
    weight: String(product.weight),
    images: product.images,
    stock: String(product.stock),
    inStock: product.inStock,
    featured: product.featured,
    nutritionalInfo: {
      calories: String((product.nutritionalInfo as unknown as { calories: number })?.calories || 0),
      protein: String((product.nutritionalInfo as unknown as { protein: number })?.protein || 0),
      carbohydrates: String((product.nutritionalInfo as unknown as { carbohydrates: number })?.carbohydrates || 0),
      fat: String((product.nutritionalInfo as unknown as { fat: number })?.fat || 0),
    },
  });
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
      if (!formData.stock || isNaN(Number(formData.stock))) throw new Error('Valid stock is required');
      if (formData.ingredients.some((i) => !i.trim())) throw new Error('All ingredients must be filled');
      if (formData.allergens.some((a) => !a.trim())) throw new Error('All allergens must be filled');

      // Validate nutritional info
      const { calories, protein, carbohydrates, fat } = formData.nutritionalInfo;
      if (!calories || isNaN(Number(calories))) throw new Error('Valid calories value is required');
      if (!protein || isNaN(Number(protein))) throw new Error('Valid protein value is required');
      if (!carbohydrates || isNaN(Number(carbohydrates))) throw new Error('Valid carbohydrates value is required');
      if (!fat || isNaN(Number(fat))) throw new Error('Valid fat value is required');

      // Update product
      await updateProduct(product.id, {
        name: formData.name,
        description: formData.description,
        longDescription: formData.longDescription,
        price: Number(formData.price),
        category: {
          connect: { id: formData.categoryId }
        },
        ingredients: formData.ingredients,
        allergens: formData.allergens,
        weight: Number(formData.weight),
        images: formData.images,
        stock: Number(formData.stock),
        inStock: formData.inStock,
        featured: formData.featured,
        nutritionalInfo: {
          calories: Number(calories),
          protein: Number(protein),
          carbohydrates: Number(carbohydrates),
          fat: Number(fat),
        },
      });

      // Redirect to products page
      router.push('/admin/products');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while updating the product');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
          <label htmlFor="stock" className="label">Stock</label>
          <input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="input-field"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="category" className="label">Category</label>
          <select
            id="category"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="input-field"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
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

      {/* Nutritional Information */}
      <motion.div variants={itemVariants} className="card space-y-6">
        <h2 className="font-display text-xl">Nutritional Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="calories" className="label">Calories</label>
            <input
              id="calories"
              type="number"
              min="0"
              value={formData.nutritionalInfo.calories}
              onChange={(e) => setFormData({
                ...formData,
                nutritionalInfo: {
                  ...formData.nutritionalInfo,
                  calories: e.target.value,
                },
              })}
              className="input-field"
              placeholder="500"
            />
          </div>
          <div>
            <label htmlFor="protein" className="label">Protein (g)</label>
            <input
              id="protein"
              type="number"
              min="0"
              value={formData.nutritionalInfo.protein}
              onChange={(e) => setFormData({
                ...formData,
                nutritionalInfo: {
                  ...formData.nutritionalInfo,
                  protein: e.target.value,
                },
              })}
              className="input-field"
              placeholder="10"
            />
          </div>
          <div>
            <label htmlFor="carbohydrates" className="label">Carbohydrates (g)</label>
            <input
              id="carbohydrates"
              type="number"
              min="0"
              value={formData.nutritionalInfo.carbohydrates}
              onChange={(e) => setFormData({
                ...formData,
                nutritionalInfo: {
                  ...formData.nutritionalInfo,
                  carbohydrates: e.target.value,
                },
              })}
              className="input-field"
              placeholder="50"
            />
          </div>
          <div>
            <label htmlFor="fat" className="label">Fat (g)</label>
            <input
              id="fat"
              type="number"
              min="0"
              value={formData.nutritionalInfo.fat}
              onChange={(e) => setFormData({
                ...formData,
                nutritionalInfo: {
                  ...formData.nutritionalInfo,
                  fat: e.target.value,
                },
              })}
              className="input-field"
              placeholder="30"
            />
          </div>
        </div>
      </motion.div>

      {/* Image Upload */}
      <motion.div variants={itemVariants} className="card space-y-6">
        <h2 className="font-display text-xl">Product Image</h2>
        <ImageUpload
          currentImage={formData.images[0]}
          onImageSelect={(imageUrl) => setFormData({ ...formData, images: [imageUrl] })}
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
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </motion.div>
    </motion.form>
  );
} 