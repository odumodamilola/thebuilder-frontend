'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, message, type = 'success', duration = 4000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <div 
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-[12px] bg-white p-4 shadow-[0_8px_24px_rgba(11,32,70,0.08)] ring-1 ring-line",
        "animate-in slide-in-from-bottom-5 sm:slide-in-from-right-5 fade-in duration-250"
      )}
      role="alert"
    >
      {type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
      {type === 'error' && <X className="h-5 w-5 text-brand-red" />}
      
      <p className="flex-1 font-ui text-[13px] leading-[18px] text-ink">
        {message}
      </p>
      
      <button 
        onClick={() => onClose(id)}
        className="rounded-[8px] p-1 text-slate transition-colors hover:bg-navy-50 hover:text-navy-900 focus:outline-none focus:ring-2 focus:ring-royal"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// A simple ToastContainer for the layout
export function ToastContainer({ toasts, onClose }: { toasts: ToastProps[], onClose: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
