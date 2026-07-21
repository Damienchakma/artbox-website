'use client';

import { useApp } from '@/context/AppContext';
import Toast from '@/components/Toast/Toast';

export default function ToastWrapper() {
  const { toasts, removeToast } = useApp();
  return <Toast toasts={toasts} onRemove={removeToast} />;
}
