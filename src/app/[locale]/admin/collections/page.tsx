'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Search, X, PlusCircle, CheckCircle } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string | null;
  price: number;
  featured: boolean;
  active: boolean;
  products: CollectionProduct[];
}

interface CollectionProduct {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
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

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{[key: string]: number}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    image: '',
    price: 0,
    featured: false,
    active: true,
    products: [] as {productId: string, quantity: number}[],
  });
  
  const t = useTranslations('Admin.Collections');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch collections
      const collectionsResponse = await fetch('/api/admin/collections');
      if (!collectionsResponse.ok) throw new Error('Failed to fetch collections');
      const collectionsData = await collectionsResponse.json();
      setCollections(collectionsData);
      
      // Fetch products for selection
      const productsResponse = await fetch('/api/admin/products');
      if (!productsResponse.ok) throw new Error('Failed to fetch products');
      const productsData = await productsResponse.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (productId: string, value: number) => {
    if (value === 0) {
      const newSelectedProducts = { ...selectedProducts };
      delete newSelectedProducts[productId];
      setSelectedProducts(newSelectedProducts);
    } else {
      setSelectedProducts({
        ...selectedProducts,
        [productId]: value
      });
    }
  };

  const toggleProductSelection = (productId: string) => {
    if (selectedProducts[productId]) {
      const newSelectedProducts = { ...selectedProducts };
      delete newSelectedProducts[productId];
      setSelectedProducts(newSelectedProducts);
    } else {
      setSelectedProducts({
        ...selectedProducts,
        [productId]: 1
      });
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProductsDetails = products.filter(product => 
    selectedProducts[product.id] !== undefined
  );

  const calculateDefaultPrice = () => {
    return Object.entries(selectedProducts).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Transform selectedProducts into the format expected by the API
    const productsArray = Object.entries(selectedProducts)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity
      }));

    // Calculate default price based on selected products if price is not manually set
    const submissionData = {
      ...newCollection,
      price: newCollection.price || calculateDefaultPrice(),
      products: productsArray
    };

    try {
      const response = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create collection');
      }

      // Reset form and refresh collections
      setNewCollection({
        name: '',
        description: '',
        image: '',
        price: 0,
        featured: false,
        active: true,
        products: [],
      });
      setSelectedProducts({});
      await fetchData();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while creating the collection');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="font-norse text-4xl mb-2">{t('title') || 'Collections'}</h1>
          <p className="text-stone-600">{t('manage') || 'Create and manage chocolate collections.'}</p>
        </motion.div>

        {/* New Collection Form */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 space-y-6">
          <h2 className="font-norse text-2xl">{t('addNewCollection') || 'Add New Collection'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700">
                    {t('name') || 'Name'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newCollection.name}
                    onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-amber-500"
                    placeholder={t('namePlaceholder') || 'Seasonal Selection'}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-stone-700">
                    {t('description') || 'Description'}
                  </label>
                  <textarea
                    id="description"
                    value={newCollection.description}
                    onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-amber-500 min-h-[100px]"
                    placeholder={t('descriptionPlaceholder') || 'Describe this collection...'}
                    required
                  />
                </div>
                
                <div>
                  <ImageUpload currentImage={newCollection.image} onImageSelect={(image) => setNewCollection({ ...newCollection, image })} publicBool={true} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-stone-700">
                      {t('price') || 'Price'} 
                      {isEditing ? '' : ` (${t('calculatedDefault') || 'Default: Sum of products'})`}
                    </label>
                    <div className="flex items-center mt-1">
                      <span className="text-stone-500 mr-2">kr</span>
                      <input
                        type="number"
                        id="price"
                        value={isEditing ? newCollection.price : (newCollection.price || calculateDefaultPrice())}
                        onChange={(e) => {
                          setIsEditing(true);
                          setNewCollection({ ...newCollection, price: parseFloat(e.target.value) });
                        }}
                        className="block w-full rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-amber-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={newCollection.featured}
                        onChange={(e) => setNewCollection({ ...newCollection, featured: e.target.checked })}
                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-stone-700">
                        {t('featured') || 'Featured'}
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="active"
                        checked={newCollection.active}
                        onChange={(e) => setNewCollection({ ...newCollection, active: e.target.checked })}
                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="active" className="ml-2 block text-sm text-stone-700">
                        {t('active') || 'Active'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{t('selectProducts') || 'Selected Products'}</h3>
                  <button 
                    type="button"
                    className="text-sm bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded-lg transition flex items-center gap-1"
                    onClick={() => setShowProductSelector(true)}
                  >
                    <PlusCircle size={16} />
                    <span>{t('addProducts') || 'Add Products'}</span>
                  </button>
                </div>
                
                {Object.keys(selectedProducts).length > 0 ? (
                  <div className="overflow-y-auto max-h-96 border border-stone-200 rounded-lg p-4 space-y-4">
                    {selectedProductsDetails.map((product) => (
                      <div key={product.id} className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                        <div className="w-12 h-12 overflow-hidden rounded-md flex-shrink-0">
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-stone-600">kr {product.price}</div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={selectedProducts[product.id] || 0}
                            onChange={(e) => handleProductSelect(product.id, parseInt(e.target.value))}
                            className="w-16 rounded-md border border-stone-300 focus:border-amber-500 focus:ring-amber-500"
                            min="0"
                            max={product.stock}
                          />
                          <button 
                            type="button"
                            onClick={() => handleProductSelect(product.id, 0)}
                            className="ml-2 text-stone-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border border-dashed border-stone-300 rounded-lg p-8 space-y-3 h-56">
                    <div className="text-stone-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <p className="text-stone-500 text-center">{t('noProductsSelected') || 'No products selected yet'}</p>
                    <button 
                      type="button"
                      className="text-sm bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded-lg transition flex items-center gap-1"
                      onClick={() => setShowProductSelector(true)}
                    >
                      <PlusCircle size={16} />
                      <span>{t('addProducts') || 'Add Products'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {error && (
              <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || Object.keys(selectedProducts).length === 0}
                className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-6 rounded-lg font-medium transition duration-200 disabled:opacity-70"
              >
                {isSubmitting ? (t('adding') || 'Adding...') : (t('addCollection') || 'Add Collection')}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Collections List */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
          <h2 className="font-norse text-2xl mb-6">{t('existingCollections') || 'Existing Collections'}</h2>
          
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="border border-stone-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative h-40 bg-stone-100">
                    {collection.image ? (
                      <Image 
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-stone-400">{t('noImage') || 'No image'}</span>
                      </div>
                    )}
                    {collection.featured && (
                      <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">
                        {t('featured') || 'Featured'}
                      </div>
                    )}
                    {!collection.active && (
                      <div className="absolute top-2 left-2 bg-stone-100 text-stone-800 text-xs font-bold px-2 py-1 rounded">
                        {t('inactive') || 'Inactive'}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{collection.name}</h3>
                    <p className="text-stone-600 text-sm line-clamp-2 mb-3">{collection.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-amber-800">kr {collection.price.toFixed(2)}</div>
                      <div className="text-sm text-stone-500">
                        {collection.products.length} {collection.products.length === 1 ? 'product' : 'products'}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-1">
                      {collection.products.slice(0, 3).map((cp) => (
                        <div key={cp.id} className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded">
                          {cp.product.name} x{cp.quantity}
                        </div>
                      ))}
                      {collection.products.length > 3 && (
                        <div className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded">
                          +{collection.products.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-stone-200 p-4 flex justify-end space-x-2">
                    <button className="text-amber-700 hover:text-amber-800 text-sm font-medium">
                      {t('edit') || 'Edit'}
                    </button>
                    <button className="text-stone-500 hover:text-stone-700 text-sm font-medium">
                      {t('delete') || 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-stone-500">{t('noCollections') || 'No collections available'}</p>
              <p className="text-stone-400 text-sm mt-2">{t('createFirst') || 'Create your first collection above'}</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Product Selector Modal */}
      {showProductSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-stone-200 flex justify-between items-center">
              <h3 className="font-norse text-xl">{t('selectProducts') || 'Select Products'}</h3>
              <button 
                onClick={() => setShowProductSelector(false)}
                className="text-stone-500 hover:text-stone-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 border-b border-stone-200">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchProducts') || 'Search products...'}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-amber-500"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div 
                      key={product.id} 
                      onClick={() => toggleProductSelection(product.id)}
                      className={`flex items-center p-3 border ${selectedProducts[product.id] ? 'border-amber-500 bg-amber-50' : 'border-stone-200'} rounded-lg cursor-pointer hover:bg-stone-50 transition-colors duration-150`}
                    >
                      <div className="w-16 h-16 overflow-hidden rounded-md flex-shrink-0 mr-4">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                            <span className="text-xs text-stone-400">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-stone-600">kr {product.price}</div>
                        <div className="text-xs text-stone-500">{t('inStock') || 'In stock'}: {product.stock}</div>
                      </div>
                      <div className="ml-2">
                        {selectedProducts[product.id] ? (
                          <CheckCircle size={22} className="text-amber-600" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-stone-300" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center py-10 text-stone-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p>{t('noProductsFound') || 'No products found'}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-stone-200 flex justify-between items-center">
              <div className="text-sm text-stone-600">
                {Object.keys(selectedProducts).length} {t('productsSelected') || 'products selected'}
              </div>
              <button
                onClick={() => setShowProductSelector(false)}
                className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-6 rounded-lg font-medium transition duration-200"
              >
                {t('done') || 'Done'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
