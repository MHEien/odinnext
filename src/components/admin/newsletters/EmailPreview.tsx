'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface EmailPreviewProps {
  htmlContent: string;
  title: string;
  onClose?: () => void;
}

export default function EmailPreview({ htmlContent, title, onClose }: EmailPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-medium">{title}</h2>
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg overflow-hidden border">
              <button
                type="button"
                className={`px-3 py-1 text-sm ${viewMode === 'desktop' ? 'bg-primary-100 text-primary-800' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('desktop')}
              >
                Desktop
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm ${viewMode === 'mobile' ? 'bg-primary-100 text-primary-800' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('mobile')}
              >
                Mobile
              </button>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                &times;
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-grow overflow-auto p-4 bg-gray-100">
          <div 
            className={`mx-auto bg-white shadow ${
              viewMode === 'desktop' ? 'w-[600px]' : 'w-[375px]'
            } transition-all duration-300`}
          >
            <iframe
              srcDoc={htmlContent}
              title="Email Preview"
              className="w-full h-[70vh] border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <span className="text-sm text-gray-500">
            Preview mode: {viewMode === 'desktop' ? 'Desktop' : 'Mobile'}
          </span>
        </div>
      </motion.div>
    </div>
  );
} 