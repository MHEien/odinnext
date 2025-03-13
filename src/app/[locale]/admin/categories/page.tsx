'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations('Admin.Categories')

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create category');
      }

      // Reset form and refresh categories
      setNewCategory({ name: '', description: '' });
      await fetchCategories();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while creating the category');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
          <h1 className="font-display text-3xl mb-2">{t('title')}</h1>
          <p className="text-stone-600">{t('manage')}</p>
        </motion.div>

        {/* New Category Form */}
        <motion.div variants={itemVariants} className="card space-y-6">
          <h2 className="font-display text-xl">{t('addNewCategory')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="label">{t('name')}</label>
              <input
                type="text"
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="input-field"
                placeholder={t('namePlaceholder')}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="label">{t('description')}</label>
              <textarea
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="input-field min-h-[100px]"
                placeholder={t('descriptionPlaceholder')}
              />
            </div>
            {error && (
              <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                {error}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? t('adding') : t('addCategory')}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Categories List */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="font-display text-xl mb-6">{t('existingCategories')}</h2>
          <div className="divide-y divide-stone-200">
            {categories.map((category) => (
              <div
                key={category.id}
                className="py-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  {category.description && (
                    <p className="text-stone-600 text-sm mt-1">
                      {category.description}
                    </p>
                  )}
                  <p className="text-stone-500 text-xs mt-1">
                    Slug: {category.slug}
                  </p>
                </div>
                {/* Add edit/delete functionality here if needed */}
              </div>
            ))}
            {categories.length === 0 && (
              <p className="py-4 text-stone-600 text-center">
                {t('noCategories')}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 