import { cn } from "@/lib/utils";
import { PriceType } from "@/types/marketplace";
import { Check, ArrowLeftRight, MessageSquare } from "lucide-react";

interface PriceBadgeProps {
  type: PriceType;
  price?: number;
  priceMin?: number;
  priceMax?: number;
}

const badgeConfig = {
  exact: {
    label: 'Exact Price',
    className: 'price-badge-exact',
    Icon: Check,
  },
  range: {
    label: 'Price Range',
    className: 'price-badge-range',
    Icon: ArrowLeftRight,
  },
  negotiable: {
    label: 'Negotiable',
    className: 'price-badge-negotiable',
    Icon: MessageSquare,
  },
};

export function PriceBadge({ type, price, priceMin, priceMax }: PriceBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.Icon;
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const getPriceDisplay = () => {
    if (type === 'exact' && price) {
      return formatPrice(price);
    }
    if (type === 'range' && priceMin && priceMax) {
      return `${formatPrice(priceMin)} - ${formatPrice(priceMax)}`;
    }
    if (type === 'negotiable' && price) {
      return `From ${formatPrice(price)}`;
    }
    return null;
  };
  
  return (
    <div className="flex flex-col gap-1">
      <span className={cn('price-badge', config.className)}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
      {getPriceDisplay() && (
        <span className="text-lg font-semibold text-foreground">
          {getPriceDisplay()}
        </span>
      )}
    </div>
  );
}
