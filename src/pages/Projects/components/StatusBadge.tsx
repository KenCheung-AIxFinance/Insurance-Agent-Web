import { FileText, Clock, CheckCircle, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'draft' | 'in_progress' | 'completed' | 'archived';

const statusConfig = {
  draft: {
    label: '草稿',
    icon: FileText,
    className: 'bg-gray-100 text-gray-800',
  },
  in_progress: {
    label: '進行中',
    icon: Clock,
    className: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: '已完成',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800',
  },
  archived: {
    label: '已封存',
    icon: Archive,
    className: 'bg-gray-100 text-gray-800',
  },
} as const;

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};
