import NewProductForm from './NewProductForm';
import { getTranslations } from 'next-intl/server';
export default async function NewProductPage() {

  const t = await getTranslations('Admin.Products');

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl mb-2">{t('newProduct')}</h1>
          <p className="text-stone-600">{t('createNewProduct')}</p>
        </div>
        <NewProductForm />
      </div>
    </div>
  );
} 