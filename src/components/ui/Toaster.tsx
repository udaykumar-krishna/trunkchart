import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToasterProps {}

const Toaster: React.FC<ToasterProps> = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Example toast for demonstration
  useEffect(() => {
    // Add a welcome toast when component mounts
    showToast('Welcome to TrunkChart!', 'success');
    
    // Cleanup
    return () => {
      setToasts([]);
    };
  }, []);
  
  const showToast = (message: string, type: ToastType = 'info') => {
    const newToast: Toast = {
      id: `toast-${Date.now()}`,
      message,
      type,
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(newToast.id);
    }, 5000);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-blue-500" size={20} />;
    }
  };
  
  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${getToastColors(toast.type)} p-4 rounded-lg shadow-lg border max-w-xs flex items-start animate-fade-in`}
        >
          <div className="mr-3 pt-0.5">
            {getToastIcon(toast.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;

export { Toaster }