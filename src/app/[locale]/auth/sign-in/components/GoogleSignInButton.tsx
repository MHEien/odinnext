'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

export default function GoogleSignInButton() {
  const [error, setError] = useState('');
  const params = useParams();
  const locale = params.locale as string;

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signIn('google', { callbackUrl: `/${locale}/account` });
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google');
    }
  };

  return (
    <>
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4"
        >
          {error}
        </motion.div>
      )}
      
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center w-full py-2.5 px-4 border border-stone-300 rounded-lg shadow-sm bg-white hover:bg-stone-50 transition-colors text-sm font-medium text-stone-700"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" 
            fill="#4285F4" />
          <path d="M12.24 10.285V14.4h6.806a6.78 6.78 0 0 1-2.564 3.954l3.036 2.324c-1.917 1.744-4.384 2.71-7.278 2.71-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" 
            fill="#34A853" />
          <path d="M7.445 14.41c-.374-1.099-.574-2.312-.574-3.556 0-1.224.2-2.397.574-3.496l-3.092-2.346C3.51 6.952 2.85 9.41 2.85 12c0 2.588.659 5.047 1.503 6.987l3.092-2.577z" 
            fill="#FBBC05" />
          <path d="M12.24 5.426c2.237 0 4.248.77 5.831 2.276l3.141-3.141C18.944 2.447 15.773 1.26 12.24 1.26 7.742 1.26 3.872 3.9 2.046 7.68l3.092 2.346c.73-2.196 2.79-3.8 5.102-3.8z" 
            fill="#EA4335" />
        </svg>
        Sign in with Google
      </button>
    </>
  );
} 