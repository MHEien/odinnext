'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import EmailTemplateSelector from '@/components/admin/newsletters/EmailTemplateSelector';
import EmailEditor from '@/components/admin/newsletters/EmailEditor';
import AIEmailGenerator from '@/components/admin/newsletters/AIEmailGenerator';

type EmailTemplate = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  html: string;
};

type EditorMode = 'template-select' | 'custom-editor' | 'content-edit';

export default function NewNewsletterPage() {
  const t = useTranslations('Admin.newsletters');
  const router = useRouter();
  
  // State for the different editor modes
  const [editorMode, setEditorMode] = useState<EditorMode>('template-select');
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  // Form data for the newsletter
  const [formData, setFormData] = useState({
    titleEn: '',
    titleNo: '',
    contentEn: '',
    contentNo: '',
    htmlTemplateEn: '',
    htmlTemplateNo: '',
    originalTemplate: '',
    scheduledFor: '',
    isTranslatedAI: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // AI translation function
  const handleTranslate = async (from: 'en' | 'no') => {
    setIsSubmitting(true);
    try {
      // Here you would integrate with a translation API
      // For now, let's simulate it
      if (from === 'en' && formData.titleEn && formData.contentEn) {
        // Simulate AI translation (in a real app, call an API)
        await new Promise(r => setTimeout(r, 1000));
        setFormData({
          ...formData,
          titleNo: `[AI Translated] ${formData.titleEn}`,
          contentNo: `[AI Translated Content]\n${formData.contentEn}`,
          htmlTemplateNo: formData.htmlTemplateEn, // Copy the HTML template
          isTranslatedAI: true
        });
      } else if (from === 'no' && formData.titleNo && formData.contentNo) {
        await new Promise(r => setTimeout(r, 1000));
        setFormData({
          ...formData,
          titleEn: `[AI Translated] ${formData.titleNo}`,
          contentEn: `[AI Translated Content]\n${formData.contentNo}`,
          htmlTemplateEn: formData.htmlTemplateNo, // Copy the HTML template
          isTranslatedAI: true
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      setError('Failed to translate newsletter content');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    
    // Only update templates if we have an original template
    if (newFormData.originalTemplate) {
      // Update English template
      if (name === 'titleEn' || name === 'contentEn') {
        newFormData.htmlTemplateEn = newFormData.originalTemplate
          .replace(/{{title}}/g, newFormData.titleEn)
          .replace(/{{content}}/g, newFormData.contentEn)
          .replace(/{{year}}/g, new Date().getFullYear().toString());
      }
      
      // Update Norwegian template
      if (name === 'titleNo' || name === 'contentNo') {
        newFormData.htmlTemplateNo = newFormData.originalTemplate
          .replace(/{{title}}/g, newFormData.titleNo)
          .replace(/{{content}}/g, newFormData.contentNo)
          .replace(/{{year}}/g, new Date().getFullYear().toString());
      }
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/newsletters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create newsletter');
      }

      router.push('/admin/newsletters');
    } catch (err) {
      console.error('Error creating newsletter:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Template selection handler
  const handleTemplateSelect = (template: EmailTemplate) => {
    // Store original template
    const originalTemplate = template.html;
    
    // Process templates with current content
    const processedHtmlEn = originalTemplate
      .replace(/{{title}}/g, formData.titleEn)
      .replace(/{{content}}/g, formData.contentEn)
      .replace(/{{year}}/g, new Date().getFullYear().toString());
    
    const processedHtmlNo = originalTemplate
      .replace(/{{title}}/g, formData.titleNo)
      .replace(/{{content}}/g, formData.contentNo)
      .replace(/{{year}}/g, new Date().getFullYear().toString());
    
    setFormData({
      ...formData,
      htmlTemplateEn: processedHtmlEn,
      htmlTemplateNo: processedHtmlNo,
      originalTemplate: originalTemplate,
    });
    
    setEditorMode('content-edit');
  };

  // Handle custom template creation
  const handleCustomTemplate = () => {
    setEditorMode('custom-editor');
  };

  // Handle email editor changes
  const handleEmailEditorChange = (html: string) => {
    // Store original template
    const originalTemplate = html;
    
    // Process templates with current content
    const processedHtmlEn = originalTemplate
      .replace(/{{title}}/g, formData.titleEn)
      .replace(/{{content}}/g, formData.contentEn)
      .replace(/{{year}}/g, new Date().getFullYear().toString());
      
    const processedHtmlNo = originalTemplate
      .replace(/{{title}}/g, formData.titleNo)
      .replace(/{{content}}/g, formData.contentNo)
      .replace(/{{year}}/g, new Date().getFullYear().toString());
    
    setFormData({
      ...formData,
      htmlTemplateEn: processedHtmlEn,
      htmlTemplateNo: processedHtmlNo,
      originalTemplate: originalTemplate,
    });
  };

  // Handle AI generated template
  const handleAIGeneratedTemplate = (html: string) => {
    // Store original template
    const originalTemplate = html;
    
    // Process templates with current content
    const processedHtmlEn = originalTemplate
      .replace(/{{title}}/g, formData.titleEn)
      .replace(/{{content}}/g, formData.contentEn)
      .replace(/{{year}}/g, new Date().getFullYear().toString());
      
    const processedHtmlNo = originalTemplate
      .replace(/{{title}}/g, formData.titleNo)
      .replace(/{{content}}/g, formData.contentNo)
      .replace(/{{year}}/g, new Date().getFullYear().toString());
    
    setFormData({
      ...formData,
      htmlTemplateEn: processedHtmlEn,
      htmlTemplateNo: processedHtmlNo,
      originalTemplate: originalTemplate,
    });
    setEditorMode('content-edit');
  };

  return (
      <div className="container px-4 mx-auto py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">{t('newNewsletter')}</h1>
              <p className="text-gray-600">{t('createNewsletterDesc')}</p>
            </div>

            {editorMode !== 'template-select' && (
              <button
                type="button"
                onClick={() => setEditorMode('template-select')}
                className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Change Template
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {editorMode === 'template-select' && (
            <motion.div
              key="template-selector"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Choose Email Template</h2>
                  <button
                    type="button"
                    onClick={() => setShowAIGenerator(true)}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    AI Generator
                  </button>
                </div>
                
                <EmailTemplateSelector 
                  onSelect={handleTemplateSelect}
                  onCustom={handleCustomTemplate}
                />
              </div>
            </motion.div>
          )}

          {editorMode === 'custom-editor' && (
            <motion.div
              key="custom-editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow p-6 mb-6"
            >
              <h2 className="text-xl font-medium mb-4">Create Custom Template</h2>
              <EmailEditor
                initialHtml={formData.htmlTemplateEn}
                onChange={handleEmailEditorChange}
              />
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditorMode('content-edit')}
                  className="btn bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Continue to Content
                </button>
              </div>
            </motion.div>
          )}

          {editorMode === 'content-edit' && (
            <motion.div
              key="content-edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h2 className="text-lg font-medium mb-4">{t('englishContent')}</h2>
                    
                    <div className="mb-4">
                      <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('title')} (English)
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        id="titleEn"
                        value={formData.titleEn}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="contentEn" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('content')} (English)
                      </label>
                      <textarea
                        name="contentEn"
                        id="contentEn"
                        value={formData.contentEn}
                        onChange={handleInputChange}
                        rows={10}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    {formData.htmlTemplateEn && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Template Preview
                        </label>
                        <div className="border rounded-md p-4 max-h-[300px] overflow-auto bg-gray-50">
                          <div dangerouslySetInnerHTML={{ __html: formData.htmlTemplateEn }} />
                        </div>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => handleTranslate('en')}
                      className="btn bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                      disabled={isSubmitting || !formData.titleEn || !formData.contentEn}
                    >
                      {t('translateToNorwegian')}
                    </button>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-medium mb-4">{t('norwegianContent')}</h2>
                    
                    <div className="mb-4">
                      <label htmlFor="titleNo" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('title')} (Norwegian)
                      </label>
                      <input
                        type="text"
                        name="titleNo"
                        id="titleNo"
                        value={formData.titleNo}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="contentNo" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('content')} (Norwegian)
                      </label>
                      <textarea
                        name="contentNo"
                        id="contentNo"
                        value={formData.contentNo}
                        onChange={handleInputChange}
                        rows={10}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    {formData.htmlTemplateNo && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Template Preview (Norwegian)
                        </label>
                        <div className="border rounded-md p-4 max-h-[300px] overflow-auto bg-gray-50">
                          <div dangerouslySetInnerHTML={{ __html: formData.htmlTemplateNo }} />
                        </div>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => handleTranslate('no')}
                      className="btn bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                      disabled={isSubmitting || !formData.titleNo || !formData.contentNo}
                    >
                      {t('translateToEnglish')}
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('scheduledFor')}
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledFor"
                    id="scheduledFor"
                    value={formData.scheduledFor}
                    onChange={handleInputChange}
                    className="w-full md:w-64 border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {t('scheduledHint')}
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/newsletters')}
                    className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="btn bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('saving') : t('saveNewsletter')}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Email Generator Modal */}
        {showAIGenerator && (
          <AIEmailGenerator
            onSelectTemplate={handleAIGeneratedTemplate}
            onClose={() => setShowAIGenerator(false)}
          />
        )}
      </div>
  );
} 