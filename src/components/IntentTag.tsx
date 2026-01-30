import { cn } from "@/lib/utils";
import { IntentLevel } from "@/types/marketplace";
import { Zap, Package, Search } from "lucide-react";

interface IntentTagProps {
  level: IntentLevel;
  size?: 'sm' | 'md';
}

const intentConfig = {
  urgent: {
    label: 'Urgent (24-48 hrs)',
    className: 'intent-tag-urgent',
    Icon: Zap,
  },
  bulk: {
    label: 'Bulk Order',
    className: 'intent-tag-bulk',
    Icon: Package,
  },
  exploring: {
    label: 'Just Exploring',
    className: 'intent-tag-exploring',
    Icon: Search,
  },
};

export function IntentTag({ level, size = 'md' }: IntentTagProps) {
  const config = intentConfig[level];
  const Icon = config.Icon;
  
  return (
    <span className={cn(
      'intent-tag',
      config.className,
      size === 'sm' && 'text-xs px-2 py-0.5'
    )}>
      <Icon className={cn('mr-1', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      {config.label}
    </span>
  );
}
