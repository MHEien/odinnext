'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// Types
type Newsletter = {
  id: string;
  titleEn: string;
  titleNo: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT' | 'CANCELLED';
  scheduledFor: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function NewsletterPage() {
  const t = useTranslations('Admin.newsletters');
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/newsletters');
      if (!response.ok) {
        throw new Error('Failed to fetch newsletters');
      }
      const data = await response.json();
      setNewsletters(data.newsletters);
    } catch (err) {
      console.error('Error fetching newsletters:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNewsletter = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;

    try {
      const response = await fetch(`/api/admin/newsletters/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete newsletter');
      }

      setNewsletters(newsletters.filter((newsletter) => newsletter.id !== id));
    } catch (err) {
      console.error('Error deleting newsletter:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete newsletter');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-200 text-gray-800';
      case 'SCHEDULED':
        return 'bg-blue-200 text-blue-800';
      case 'SENT':
        return 'bg-green-200 text-green-800';
      case 'CANCELLED':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">{t('title')}</h1>
          <Link
            href="/admin/newsletters/new"
            className="btn-primary bg-primary-600 hover:bg-primary-700"
          >
            {t('createNewButton')}
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : newsletters.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('noNewsletters')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('columns.title')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('columns.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('columns.scheduled')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('columns.sent')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('columns.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newsletters.map((newsletter) => (
                  <tr key={newsletter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {newsletter.titleEn}
                      </div>
                      <div className="text-sm text-gray-500">
                        {newsletter.titleNo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          newsletter.status
                        )}`}
                      >
                        {t(`status.${newsletter.status.toLowerCase()}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(newsletter.scheduledFor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(newsletter.sentAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/newsletters/${newsletter.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {t('actions.view')}
                        </Link>
                        <Link
                          href={`/admin/newsletters/${newsletter.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {t('actions.edit')}
                        </Link>
                        <button
                          onClick={() => handleDeleteNewsletter(newsletter.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {t('actions.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  );
} 