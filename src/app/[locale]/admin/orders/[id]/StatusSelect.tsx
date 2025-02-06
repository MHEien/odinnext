'use client';

import { useState } from 'react';
import { useRouter} from '@/i18n/routing';
import type { OrderStatus } from '@prisma/client';
import type { OrderWithItems } from '@/lib/db/actions/orders';
import { updateOrderStatus } from '@/lib/db/actions/orders';
import { useToast } from '@/lib/hooks/useToast';

function formatStatus(status: OrderStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function getStatusColor(status: OrderStatus) {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return colors[status] || colors.PENDING;
}

const statuses: OrderStatus[] = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export function StatusSelect({ order }: { order: OrderWithItems }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const showToast = useToast();

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      setIsUpdating(true);
      showToast.loading('Updating order status...');
      await updateOrderStatus(order.id, status);
      router.refresh();
      showToast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={order.status}
      onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
      disabled={isUpdating}
      className={`px-4 py-2 rounded-lg text-sm ${getStatusColor(
        order.status
      )} border-0 focus:ring-2 focus:ring-primary-600`}
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {formatStatus(status)}
        </option>
      ))}
    </select>
  );
} 