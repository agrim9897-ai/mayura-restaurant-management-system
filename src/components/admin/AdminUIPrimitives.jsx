import React, { useState } from 'react';

/**
 * Warm White Minimal Luxury Design System UI Primitives
 */

// 1. BUTTONS
export function Button({
  children,
  variant = 'primary', // primary | secondary | ghost | danger | outline
  size = 'md', // sm | md | lg
  disabled = false,
  isLoading = false,
  icon,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-6 py-3 text-xs',
  };

  const variantStyles = {
    primary: 'bg-[#C5A059] text-white hover:bg-[#B59049] shadow-2xs',
    secondary: 'bg-white text-[#1A1A1A] border border-[#E8E4DE] hover:bg-[#FAF8F4] shadow-2xs',
    ghost: 'bg-transparent text-[#666666] hover:bg-[#EFE9DF] hover:text-[#1A1A1A]',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-2xs',
    outline: 'bg-transparent text-[#C5A059] border border-[#C5A059] hover:bg-[#C5A059] hover:text-white',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>Loading...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {icon && <span className="material-symbols-outlined text-base">{icon}</span>}
          {children}
        </span>
      )}
    </button>
  );
}

// 2. CARDS
export function Card({ children, className = '', ...props }) {
  return (
    <div className={`saas-card p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`border-b border-[#E8E4DE] pb-4 mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`font-serif text-xl font-bold text-[#1A1A1A] ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-xs text-[#666666] mt-0.5 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`border-t border-[#E8E4DE] pt-4 mt-4 flex items-center justify-between ${className}`}>{children}</div>;
}

// 3. TABLES
export function Table({ children, className = '' }) {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className={`w-full text-left border-collapse text-xs ${className}`}>{children}</table>
    </div>
  );
}

export function TableHeader({ children }) {
  return <thead className="bg-[#FAF8F4] border-b border-[#E8E4DE] uppercase tracking-wider text-[10px] text-[#666666] font-semibold">{children}</thead>;
}

export function TableRow({ children, className = '', onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[#E8E4DE]/60 hover:bg-[#FAF8F4]/80 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }) {
  return <th className={`p-4 font-semibold text-[#666666] ${className}`}>{children}</th>;
}

export function TableCell({ children, className = '' }) {
  return <td className={`p-4 text-[#1A1A1A] align-middle ${className}`}>{children}</td>;
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-[#E8E4DE]/60">{children}</tbody>;
}

// 4. FORMS & INPUTS
export function FormLabel({ children, required = false, className = '' }) {
  return (
    <label className={`block text-xs font-semibold text-[#666666] mb-1.5 ${className}`}>
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] placeholder-[#666666]/60 focus:outline-none custom-focus font-medium ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-3 text-xs text-[#1A1A1A] placeholder-[#666666]/60 focus:outline-none custom-focus leading-relaxed resize-none ${className}`}
      {...props}
    />
  );
}

export function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer font-medium ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

// 5. MODAL / DIALOG
export function Modal({ isOpen, onClose, children, maxWidth = 'max-w-md' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className={`bg-white border border-[#E8E4DE] rounded-2xl w-full ${maxWidth} p-6 space-y-5 shadow-2xl animate-scale`}>
        {children}
      </div>
    </div>
  );
}

// 6. DRAWER (Slide-over)
export function Drawer({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 animate-backdrop-in" />
      <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white border-l border-[#E8E4DE] shadow-2xl z-50 flex flex-col justify-between animate-drawer-in p-6">
        <div className="flex items-center justify-between border-b border-[#E8E4DE] pb-4 mb-4">
          <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">{title}</h3>
          <button onClick={onClose} className="text-[#666666] hover:text-[#1A1A1A]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </>
  );
}

// 7. TOOLTIP
export function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#1A1A1A] text-white text-[10px] rounded-lg whitespace-nowrap shadow-md z-50">
          {text}
        </div>
      )}
    </div>
  );
}

// 8. EMPTY & ERROR STATES
export function EmptyState({ title = 'No Data Available', description = 'There are no records matching your criteria.', icon = 'inbox' }) {
  return (
    <div className="saas-card p-16 text-center space-y-2">
      <span className="material-symbols-outlined text-4xl text-[#666666]/30">{icon}</span>
      <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">{title}</h3>
      <p className="text-xs text-[#666666]">{description}</p>
    </div>
  );
}

export function ErrorState({ title = 'Something Went Wrong', message = 'Failed to fetch data.', onRetry }) {
  return (
    <div className="saas-card p-12 text-center space-y-3 border-rose-200 bg-rose-50/50">
      <span className="material-symbols-outlined text-4xl text-rose-500">error</span>
      <h3 className="font-serif text-lg font-bold text-rose-900">{title}</h3>
      <p className="text-xs text-rose-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

// 9. TOAST NOTIFICATION
export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  const isSuccess = type === 'success';
  return (
    <div
      className={`fixed bottom-6 right-6 font-semibold text-xs px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border animate-bounce ${
        isSuccess ? 'bg-[#C5A059] text-white border-white/20' : 'bg-rose-600 text-white border-white/20'
      }`}
    >
      <span className="material-symbols-outlined text-base">
        {isSuccess ? 'check_circle' : 'error'}
      </span>
      <span>{message}</span>
    </div>
  );
}
