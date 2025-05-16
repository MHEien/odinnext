'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface BlobImage {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export interface ImageUploadProps {
  currentImage: string;
  onImageSelect: (imageUrl: string) => void;
  publicBool?: boolean;
}

export default function ImageUpload({ currentImage, onImageSelect, publicBool = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [showGallery, setShowGallery] = useState(false);
  const [existingImages, setExistingImages] = useState<BlobImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing images
  useEffect(() => {
    async function fetchImages() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/image');
        const data = await response.json();
        console.log("Images data:", data);
        console.log("Setting existingImages to:", data.public || []);
        setExistingImages(data.public || []);
      } catch (err) {
        console.error('Failed to load existing images', err);
        setError('Failed to load existing images');
      } finally {
        setIsLoading(false);
      }
    }
    fetchImages();
  }, []);

  // Add debug log for render
  console.log("Current state - showGallery:", showGallery, "existingImages:", existingImages);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('public', publicBool.toString());

    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/admin/image/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            onImageSelect(data.url);
            resolve();
          } catch (err) {
            setError('Failed to parse server response');
            reject(err);
          }
        } else {
          setError('Failed to upload image');
          reject(new Error('Failed to upload image'));
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        setError('Failed to upload image');
        reject(new Error('Failed to upload image'));
      };

      xhr.send(formData);
    });
  }, [onImageSelect, publicBool]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setShowGallery(!showGallery)}
          className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          {showGallery ? 'Hide Gallery' : 'Show Existing Images'}
        </button>
      </div>

      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border rounded-lg p-4 bg-stone-50">
              <h3 className="text-lg font-semibold mb-4">Image Gallery</h3>
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {existingImages.map((image) => (
                    <motion.div
                      key={image.url}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative aspect-square w-full h-[200px] cursor-pointer group"
                      onClick={() => {
                        onImageSelect(image.url);
                        setShowGallery(false);
                      }}
                    >
                      <Image
                        src={image.url}
                        alt={image.pathname}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <p className="text-white text-sm">Select</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary-500 bg-primary-50' : 'border-stone-300 hover:border-primary-500'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input {...getInputProps()} />
          {currentImage ? (
            <div className="relative w-full aspect-video min-h-[120px]">
              <Image
                src={currentImage}
                alt="Product preview"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the dropzone
                  onImageSelect('');
                }}
                className="absolute top-2 right-2 bg-stone-800/70 hover:bg-stone-900/70 text-white rounded-full p-2 transition-colors"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : isUploading ? (
            <div className="py-8 space-y-4">
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-stone-600">Uploading... {progress}%</p>
            </div>
          ) : isDragActive ? (
            <p className="py-8 text-primary-600">Drop the image here...</p>
          ) : (
            <p className="py-8 text-stone-600">
              Drag & drop an image here, or click to select one
            </p>
          )}
        </motion.div>
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-sm"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
} 