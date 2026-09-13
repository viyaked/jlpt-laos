import { forwardRef, type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'sm', dot = false, className = '', ...props }, ref) => {
    const variants = {
      default: 'bg-slate-100 text-slate-700 border border-slate-200',
      success: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
      warning: 'bg-amber-50 text-amber-800 border border-amber-100',
      danger: 'bg-red-50 text-red-800 border border-red-100',
      info: 'bg-blue-50 text-blue-800 border border-blue-100',
      outline: 'bg-transparent text-slate-700 border-2 border-slate-300',
    };

    const sizes = {
      xs: 'px-2 py-0.5 text-[10px]',
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    const dotColors = {
      default: 'bg-slate-400',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500',
      outline: 'bg-slate-400',
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5 font-semibold rounded-full border
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        {...props}
      >
        {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} aria-hidden="true" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export interface StatusBadgeProps {
  status: 'open' | 'almost-full' | 'full' | 'online' | 'offline' | 'pending' | 'active' | 'inactive';
  size?: 'xs' | 'sm' | 'md';
  showDot?: boolean;
}

export function StatusBadge({ status, size = 'sm', showDot = true }: StatusBadgeProps) {
  const config = {
    open: { variant: 'success' as const, label: 'Open', dot: true },
    'almost-full': { variant: 'warning' as const, label: 'Almost Full', dot: true },
    full: { variant: 'danger' as const, label: 'Full', dot: true },
    online: { variant: 'success' as const, label: 'Online', dot: true },
    offline: { variant: 'default' as const, label: 'Offline', dot: true },
    pending: { variant: 'warning' as const, label: 'Pending', dot: true },
    active: { variant: 'success' as const, label: 'Active', dot: true },
    inactive: { variant: 'default' as const, label: 'Inactive', dot: true },
  }[status];

  return (
    <Badge variant={config.variant} size={size} dot={showDot && config.dot}>
      {config.label}
    </Badge>
  );
}