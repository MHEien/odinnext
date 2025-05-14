'use client';

import { useEffect, useState } from 'react';
import type { Product, Prisma, Category } from '@prisma/client';
import ImageUpload from './ImageUpload';
import { useToast } from '@/lib/hooks/useToast';
import { NutritionalInfo } from '@/lib/db/actions/products';

interface ProductFormProps {
  product?: Product & { price: number };
  categories: Category[];
  onSubmit: (data: Prisma.ProductCreateInput | Prisma.ProductUpdateInput & { id?: string }) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  longDescription: string;
  price: number;
  images: string[];
  categoryId: string;
  ingredients: string[];
  allergens: string[];
  weight: number;
  featured: boolean;
  inStock: boolean;
  stock: number;
  nutritionalInfo: NutritionalInfo;
}

export default function ProductForm({
  product,
  categories,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const showToast = useToast();
  const [mainImage, setMainImage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    images: [],
    categoryId: '',
    ingredients: [],
    allergens: [],
    weight: 100,
    featured: false,
    inStock: true,
    stock: 0,
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
    },
  });

  useEffect(() => {
    if (product) {
      const nutritionalInfo = product.nutritionalInfo as unknown as NutritionalInfo;
      setFormData({
        name: product.name,
        description: product.description,
        longDescription: product.longDescription,
        price: product.price,
        images: product.images,
        categoryId: product.categoryId,
        ingredients: product.ingredients,
        allergens: product.allergens,
        weight: product.weight,
        featured: product.featured,
        inStock: product.inStock,
        stock: product.stock,
        nutritionalInfo,
      });
      
      if (product.images.length > 0) {
        setMainImage(product.images[0]);
      }
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.longDescription.trim()) {
      newErrors.longDescription = 'Long description is required';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.weight <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }

    if (formData.allergens.length === 0) {
      newErrors.allergens = 'At least one allergen is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setIsSubmitting(true);
      // Convert the form data to match Prisma schema
      const submissionData = {
        id: product?.id,
        name: formData.name,
        description: formData.description,
        longDescription: formData.longDescription,
        price: formData.price,
        images: formData.images,
        categoryId: formData.categoryId,
        ingredients: formData.ingredients,
        allergens: formData.allergens,
        weight: formData.weight,
        featured: formData.featured,
        inStock: formData.inStock,
        stock: formData.stock,
        nutritionalInfo: formData.nutritionalInfo as unknown as Prisma.InputJsonValue,
      };
      
      await onSubmit(submissionData);
      showToast.success(
        product ? 'Product updated successfully' : 'Product created successfully'
      );
    } catch (error) {
      console.error('Error submitting product:', error);
      showToast.error(
        product
          ? 'Failed to update product'
          : 'Failed to create product'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]:
        type === 'number'
          ? parseFloat(value) || 0
          : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleArrayChange = (
    name: 'ingredients' | 'allergens',
    value: string
  ) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  const handleNutritionalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        [name]: parseFloat(value) || 0,
      },
    }));
  };

  const handleImageSelect = (imageUrl: string) => {
    setMainImage(imageUrl);
    setFormData((prev: FormData) => ({
      ...prev,
      images: [imageUrl, ...prev.images.filter(img => img !== imageUrl)],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-display text-xl mb-6">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.name
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Short Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Long Description
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              rows={4}
              className={`mt-1 block w-full rounded-lg border ${
                errors.longDescription
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
            {errors.longDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.longDescription}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`mt-1 block w-full rounded-lg border ${
                  errors.price
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Weight (g)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="0"
                className={`mt-1 block w-full rounded-lg border ${
                  errors.weight
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.categoryId
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded border-stone-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-stone-700">
                Featured Product
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="rounded border-stone-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-stone-700">
                In Stock
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-display text-xl mb-6">Product Images</h2>
        <ImageUpload
          currentImage={mainImage}
          onImageSelect={handleImageSelect}
        />
        {errors.images && (
          <p className="mt-2 text-sm text-red-600">{errors.images}</p>
        )}
      </div>

      {/* Ingredients & Allergens */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-display text-xl mb-6">Ingredients & Allergens</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Ingredients (comma-separated)
            </label>
            <input
              type="text"
              value={formData.ingredients.join(', ')}
              onChange={(e) => handleArrayChange('ingredients', e.target.value)}
              className={`mt-1 block w-full rounded-lg border ${
                errors.ingredients
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
              placeholder="Dark Chocolate, Sea Salt, Almonds"
            />
            {errors.ingredients && (
              <p className="mt-1 text-sm text-red-600">{errors.ingredients}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Allergens (comma-separated)
            </label>
            <input
              type="text"
              value={formData.allergens.join(', ')}
              onChange={(e) => handleArrayChange('allergens', e.target.value)}
              className={`mt-1 block w-full rounded-lg border ${
                errors.allergens
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
              placeholder="Milk, Soy, Nuts"
            />
            {errors.allergens && (
              <p className="mt-1 text-sm text-red-600">{errors.allergens}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nutritional Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-display text-xl mb-6">Nutritional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Calories
            </label>
            <input
              type="number"
              name="calories"
              value={formData.nutritionalInfo.calories}
              onChange={handleNutritionalInfoChange}
              min="0"
              className="mt-1 block w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Protein (g)
            </label>
            <input
              type="number"
              name="protein"
              value={formData.nutritionalInfo.protein}
              onChange={handleNutritionalInfoChange}
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Carbohydrates (g)
            </label>
            <input
              type="number"
              name="carbohydrates"
              value={formData.nutritionalInfo.carbohydrates}
              onChange={handleNutritionalInfoChange}
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Fat (g)
            </label>
            <input
              type="number"
              name="fat"
              value={formData.nutritionalInfo.fat}
              onChange={handleNutritionalInfoChange}
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {product ? 'Updating...' : 'Creating...'}
            </span>
          ) : product ? (
            'Update Product'
          ) : (
            'Create Product'
          )}
        </button>
      </div>
    </form>
  );
} 