import { cn } from "@/lib/utils";
import { SellerStatus } from "@/types/marketplace";

interface StatusIndicatorProps {
  status: SellerStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  available: {
    label: 'Available Today',
    dotClass: 'status-dot-available',
  },
  delayed: {
    label: 'Responds in 24 hrs',
    dotClass: 'status-dot-delayed',
  },
  unavailable: {
    label: 'Not Accepting Enquiries',
    dotClass: 'status-dot-unavailable',
  },
};

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
};

export function StatusIndicator({ status, showLabel = true, size = 'md' }: StatusIndicatorProps) {
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center gap-2">
      <span className={cn('status-dot', config.dotClass, sizeClasses[size])} />
      {showLabel && (
        <span className="text-sm text-muted-foreground">{config.label}</span>
      )}
    </div>
  );
}
