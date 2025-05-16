'use client';

import { useState, useEffect } from 'react';
import { useRouter} from '@/i18n/routing';
import { motion } from 'framer-motion';
import ImageUpload from '@/components/admin/ImageUpload';
import { Category } from '@prisma/client';
import { createProduct } from './actions';
import type { CreateProductInput } from './actions';
import { useTranslations } from 'next-intl';


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

interface FormData extends Omit<CreateProductInput, 'price' | 'weight' | 'stock'> {
  price: string;
  weight: string;
  stock: string;
}



export default function NewProductForm() {
  const initialFormData: FormData = {
    name: '',
    description: '',
    longDescription: '',
    price: '',
    categoryId: '',
    ingredients: [''],
    allergens: [''],
    weight: '',
    images: ['/images/placeholder-product.jpg'],
    inStock: true,
    featured: false,
    stock: '0',
    nutritionalInfo: {},
  };
  const t = useTranslations('Admin.Products');
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ''],
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_: string, i: number) => i !== index),
    });
  };

  const handleIngredientChange = (index: number, value: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.map((ingredient: string, i: number) =>
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
      allergens: formData.allergens.filter((_: string, i: number) => i !== index),
    });
  };

  const handleAllergenChange = (index: number, value: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.map((allergen: string, i: number) =>
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
      if (!formData.name.trim()) throw new Error(t('errors.nameRequired'));
      if (!formData.description.trim()) throw new Error(t('errors.descriptionRequired'));
      if (!formData.longDescription.trim()) throw new Error(t('errors.longDescriptionRequired'));
      if (!formData.price || isNaN(Number(formData.price))) throw new Error(t('errors.validPriceRequired'));
      if (!formData.weight || isNaN(Number(formData.weight))) throw new Error(t('errors.validWeightRequired'));
      if (!formData.stock || isNaN(Number(formData.stock))) throw new Error(t('errors.validStockRequired'));
      if (formData.ingredients.some((i: string) => !i.trim())) throw new Error(t('errors.allIngredientsRequired'));
      if (formData.allergens.some((a: string) => !a.trim())) throw new Error(t('errors.allAllergensRequired'));
      if (!formData.categoryId) throw new Error(t('errors.categoryRequired'));

      // Call server action
      const result = await createProduct({
        ...formData,
        price: Number(formData.price),
        weight: Number(formData.weight),
        stock: Number(formData.stock),
      });

      if (!result.success) {
        throw new Error(result.error || t('errors.createError'));
      }

      // Redirect to products page
      router.push('/admin/products');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('errors.unknownError'));
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
        <h2 className="font-display text-xl">{t('basicInfo')}</h2>
        
        <div>
          <label htmlFor="name" className="label">{t('productName')}</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            placeholder={t('productNamePlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="description" className="label">{t('shortDescription')}</label>
          <input
            id="description"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            placeholder={t('shortDescriptionPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="longDescription" className="label">{t('fullDescription')}</label>
          <textarea
            id="longDescription"
            value={formData.longDescription}
            onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
            className="input-field min-h-[100px]"
            placeholder={t('fullDescriptionPlaceholder')}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label htmlFor="price" className="label">{t('price')}</label>
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
            <label htmlFor="weight" className="label">{t('weight')}</label>
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
          <div>
            <label htmlFor="stock" className="label">{t('stock')}</label>
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
        </div>

        <div>
          <label htmlFor="category" className="label">{t('category')}</label>
          <select
            id="category"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="input-field"
          >
            <option value="">{t('selectCategory')}</option>
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
          <h2 className="font-display text-xl">{t('ingredients')}</h2>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="btn-secondary"
          >
            {t('addIngredient')}
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
                placeholder={t('ingredientPlaceholder')}
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
          <h2 className="font-display text-xl">{t('allergens')}</h2>
          <button
            type="button"
            onClick={handleAddAllergen}
            className="btn-secondary"
          >
            {t('addAllergen')}
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
                placeholder={t('allergenPlaceholder')}
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

      {/* Nutritional Info */}
      <motion.div variants={itemVariants} className="card space-y-6">
        <h2 className="font-display text-xl">{t('nutritionalInfo')}</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="calories" className="label">{t('calories')}</label>
            <input
              id="calories"
              type="number"
              min="0"
              value={formData.nutritionalInfo.calories || ''}
              onChange={(e) => setFormData({
                ...formData,
                nutritionalInfo: {
                  ...formData.nutritionalInfo,
                  calories: e.target.value ? Number(e.target.value) : undefined,
                },
              })}
              className="input-field"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="fat" className="label">{t('fat')}</label>
            <input
              id="fat"
              type="number"
              min="0"
              step="0.1"
              value={formData.nutritionalInfo.fat || ''}
              onChange={(e) => setFormData({
                ...formData,
                nutritionalInfo: {
                  ...formData.nutritionalInfo,
                  fat: e.target.value ? Number(e.target.value) : undefined,
                },
              })}
              className="input-field"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="protein" className="label">{t('protein')}</label>
            <input
              id="protein"
              type="number"
              min="0"
              step="0.1"
              value={formData.nutritionalInfo.protein || ''}
              onChange={(e) => setFormData({
                ...formData,
                nutritionalInfo: {
                  ...formData.nutritionalInfo,
                  protein: e.target.value ? Number(e.target.value) : undefined,
                },
              })}
              className="input-field"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="carbs" className="label">{t('carbs')}</label>
            <input
              id="carbs"
              type="number"
              min="0"
              step="0.1"
              value={formData.nutritionalInfo.carbs || ''}
              onChange={(e) => setFormData({
                ...formData,
                nutritionalInfo: {
                  ...formData.nutritionalInfo,
                  carbs: e.target.value ? Number(e.target.value) : undefined,
                },
              })}
              className="input-field"
              placeholder="0"
            />
          </div>
        </div>
      </motion.div>

      {/* Image Upload */}
      <motion.div variants={itemVariants} className="card space-y-6">
        <h2 className="font-display text-xl">{t('productImage')}</h2>
        <ImageUpload
          currentImage={formData.images[0]}
          onImageSelect={(imageUrl) => {
            setFormData({ ...formData, images: [imageUrl] });
          }}
        />
      </motion.div>

      {/* Options */}
      <motion.div variants={itemVariants} className="card space-y-6">
        <h2 className="font-display text-xl">{t('options')}</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="w-4 h-4 rounded border-stone-300 text-primary-600 focus:ring-primary-600"
            />
            <span>{t('inStock')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded border-stone-300 text-primary-600 focus:ring-primary-600"
            />
            <span>{t('featured')}</span>
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
          {t('cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-primary ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? t('creating') : t('create')}
        </button>
      </motion.div>
    </motion.form>
  );
} 