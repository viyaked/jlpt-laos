import { CheckCircle2 } from 'lucide-react';

interface ToastNotificationProps {
  message: string;
}

export function ToastNotification({ message }: ToastNotificationProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm animate-bounce">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}