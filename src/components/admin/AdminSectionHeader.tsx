import { type ReactNode } from 'react';
import { Badge, Button } from '../ui';

interface AdminSectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  badge?: string;
}

export function AdminSectionHeader({ title, description, action, badge }: AdminSectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="w-2.5 h-6 bg-slate-900 rounded-sm inline-block" aria-hidden="true" />
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h3>
          {badge && (
            <Badge variant="outline" size="sm" className="bg-red-50 text-red-700 border-red-200">
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button variant="primary" size="sm" leftIcon={action.icon} onClick={action.onClick} className="self-start sm:self-auto">
          {action.label}
        </Button>
      )}
    </div>
  );
}