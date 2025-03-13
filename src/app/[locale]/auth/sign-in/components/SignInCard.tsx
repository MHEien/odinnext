'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import SignInForm from './SignInForm';
import GoogleSignInButton from './GoogleSignInButton';

export default function SignInCard() {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl mb-2">Welcome Back</h1>
        <p className="text-stone-600">
          Enter Valhalla&apos;s gates to access your chocolate realm
        </p>
      </div>

      <SignInForm />
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-stone-500">Or continue with</span>
        </div>
      </div>
      
      <GoogleSignInButton />

      <div className="text-center text-sm text-stone-600 mt-6">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/sign-up"
          className="text-primary-600 hover:text-primary-700"
        >
          Sign up
        </Link>
      </div>
    </motion.div>
  );
} 