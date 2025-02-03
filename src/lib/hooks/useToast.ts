import { toast } from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  icon?: string;
}

export function useToast() {
  const showToast = {
    success: (message: string, options?: ToastOptions) => {
      toast.success(message, {
        duration: options?.duration || 4000,
        icon: options?.icon || '✓',
      });
    },
    error: (message: string, options?: ToastOptions) => {
      toast.error(message, {
        duration: options?.duration || 4000,
        icon: options?.icon || '✕',
      });
    },
    loading: (message: string, options?: ToastOptions) => {
      return toast.loading(message, {
        duration: options?.duration,
      });
    },
    dismiss: (toastId?: string) => {
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
    },
  };

  return showToast;
} 