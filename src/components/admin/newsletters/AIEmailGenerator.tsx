'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompletion } from '@ai-sdk/react';

interface AIEmailGeneratorProps {
  onSelectTemplate: (html: string) => void;
  onClose: () => void;
}

export default function AIEmailGenerator({ onSelectTemplate, onClose }: AIEmailGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/admin/newsletters/generate',
    onFinish: () => {
      setIsGenerating(false);
      setGenerationSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setGenerationSuccess(false), 3000);
    },
    onError: (error) => {
      setError(error.message);
      setIsGenerating(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    
    setError(null);
    setIsGenerating(true);
    setGenerationSuccess(false);
    
    try {
      await complete(prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
    }
  };

  const handleUseTemplate = () => {
    onSelectTemplate(completion);
    onClose();
  };

  // Include brand context in the prompt
  const generatePromptContext = () => {
    return `Our brand has a Norse-inspired color palette (deep browns, gold/bronze accents, and charcoal). Your design should incorporate these colors and themes while maintaining a clean, premium look. Focus on responsive email design with clear sections and readable typography.`;
  };

  const promptSuggestions = [
    'Create a welcome email for new subscribers that introduces our Norse-inspired chocolate brand.',
    'Design a product announcement for our limited edition Viking collection.',
    'Create a seasonal promotion for our summer chocolate selection.',
    'Design a customer loyalty program email.',
    'Create a newsletter template for monthly updates about our products and company news.',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-medium">AI Email Generator</h2>
          <p className="text-sm text-stone-500 mt-1">
            Describe the email content you want to create and we&apos;ll generate it for you.
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-sm font-medium text-stone-700 mb-1">
                What kind of email do you want to create?
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full border border-stone-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                placeholder="e.g., Create a welcome email for new subscribers that introduces our products and gives them a 10% discount code"
                required
              />
              <div className="mt-2">
                <p className="text-sm text-stone-500 mb-2">Try one of these suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm hover:bg-stone-200 transition-colors"
                      onClick={() => setPrompt(suggestion)}
                    >
                      {suggestion.length > 40 ? `${suggestion.substring(0, 40)}...` : suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="btn border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50"
                disabled={isLoading || isGenerating || !prompt}
              >
                {isLoading || isGenerating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : 'Generate Email'}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
              {error}
            </div>
          )}

          <AnimatePresence>
            {generationSuccess && !error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-green-50 text-green-700 rounded-md mb-4"
              >
                Email template successfully generated!
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {completion && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Generated Email Template</h3>
                  <button
                    type="button"
                    onClick={handleUseTemplate}
                    className="btn-sm bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    Use This Template
                  </button>
                </div>
                <div className="border rounded-md p-4 max-h-[300px] overflow-auto bg-stone-50">
                  <div dangerouslySetInnerHTML={{ __html: completion }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isGenerating && !completion && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <div className="w-16 h-16 border-t-4 border-b-4 border-primary-600 rounded-full animate-spin mb-4"></div>
              <p className="text-stone-600">Crafting your Norse-inspired email...</p>
              <p className="text-stone-500 text-sm mt-2">This may take a few moments</p>
            </motion.div>
          )}
          
          <div className="text-xs text-stone-400 mt-6">
            <p>The AI will generate email content based on your prompt and our brand style.</p>
            <p className="mt-1">{generatePromptContext()}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 