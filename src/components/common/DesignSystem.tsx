import React from 'react';
import { AlertTriangle, RefreshCw, Inbox, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const variants = {
    primary: 'bg-[#1E5EFF] text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm active:scale-[0.98]',
    secondary: 'bg-[#34A853] text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm active:scale-[0.98]',
    danger: 'bg-[#EF4444] text-white hover:bg-red-600 focus:ring-red-500 shadow-sm active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
    outline: 'border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#1F2937]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

// --- BADGE ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const styles = {
    success: 'bg-emerald-50 text-[#22C55E] border-emerald-200',
    warning: 'bg-amber-50 text-[#F59E0B] border-amber-200',
    error: 'bg-rose-50 text-[#EF4444] border-rose-200',
    info: 'bg-sky-50 text-[#0EA5E9] border-sky-200',
    neutral: 'bg-slate-100 text-[#6B7280] border-[#E5E7EB]',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- STATUS TAG ---
export const StatusTag: React.FC<{ status: string }> = ({ status }) => {
  switch (status?.toLowerCase()) {
    case 'résolu':
    case 'resolu':
    case 'cloture':
      return (
        <Badge variant="success">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      );
    case 'en cours':
    case 'en_cours':
    case 'affecte':
      return (
        <Badge variant="info">
          <Clock className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      );
    case 'en attente':
    case 'cree':
    case 'valide':
      return (
        <Badge variant="warning">
          <AlertCircle className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      );
    case 'rejeté':
    case 'rejete':
      return (
        <Badge variant="error">
          <X className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      );
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

// --- CARD ---
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// --- SKELETON LOADER ---
export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => (
  <div className={`bg-slate-200 animate-pulse rounded-lg ${className}`} />
);

// --- EMPTY STATE ---
interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Aucune donnée disponible',
  description = 'Il n\'y a aucune donnée à afficher pour le moment.',
  actionLabel,
  onAction,
  icon,
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-[#E5E7EB] my-4">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
      {icon || <Inbox className="w-6 h-6" />}
    </div>
    <h3 className="text-base font-semibold text-[#1F2937] mb-1">{title}</h3>
    <p className="text-xs text-[#6B7280] max-w-sm mb-4">{description}</p>
    {actionLabel && onAction && (
      <Button variant="outline" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

// --- ERROR STATE ---
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Une erreur est survenue',
  message = 'Impossible de charger les données depuis le serveur. Vérifiez votre connexion.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-2xl border border-rose-200 my-4">
    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-[#EF4444] mb-3">
      <AlertTriangle className="w-6 h-6" />
    </div>
    <h3 className="text-base font-semibold text-rose-900 mb-1">{title}</h3>
    <p className="text-xs text-[#EF4444] max-w-sm mb-4">{message}</p>
    {onRetry && (
      <Button variant="primary" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRetry}>
        Réessayer
      </Button>
    )}
  </div>
);

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#1F2937]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
