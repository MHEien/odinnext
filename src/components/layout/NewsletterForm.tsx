'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

interface NewsletterFormProps {
  translations: {
    emailPlaceholder: string;
    subscribeButton: string;
    subscribing: string;
    subscribeSuccess: string;
    subscribeError: string;
  };
}

export default function NewsletterForm({ translations }: NewsletterFormProps) {
  const locale = useLocale() as 'en' | 'no';
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    setSubscriptionStatus('idle');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/newsletters/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, locale }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to subscribe');
      }
      
      setSubscriptionStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="mt-4 sm:flex sm:max-w-md" onSubmit={handleSubscribe}>
        <label htmlFor="email-address" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          name="email-address"
          id="email-address"
          autoComplete="email"
          required
          className="input-field bg-stone-800 border-stone-700 text-white placeholder-stone-400"
          placeholder={translations.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
          <button
            type="submit"
            className="btn-primary w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? translations.subscribing : translations.subscribeButton}
          </button>
        </div>
      </form>
      
      {subscriptionStatus === 'success' && (
        <p className="mt-2 text-sm text-green-400">
          {translations.subscribeSuccess}
        </p>
      )}
      
      {subscriptionStatus === 'error' && (
        <p className="mt-2 text-sm text-red-400">
          {errorMessage || translations.subscribeError}
        </p>
      )}
    </>
  );
} 