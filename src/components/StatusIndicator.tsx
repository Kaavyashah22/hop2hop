import { cn } from "@/lib/utils";
import { SellerStatus } from "@/types/marketplace";

interface StatusIndicatorProps {
  status?: SellerStatus;
}

const statusConfig = {
  available: {
    label: "Available Today",
    dotClass: "bg-green-500",
    textClass: "text-green-600",
  },
  delayed: {
    label: "Responds in 24 hrs",
    dotClass: "bg-yellow-500",
    textClass: "text-yellow-600",
  },
  unavailable: {
    label: "Not Accepting Enquiries",
    dotClass: "bg-red-500",
    textClass: "text-red-600",
  },
};

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const config =
    status && statusConfig[status as keyof typeof statusConfig]
      ? statusConfig[status as keyof typeof statusConfig]
      : statusConfig.available;

  if (!config) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          config.dotClass
        )}
      />
      <span className={cn("text-sm font-medium", config.textClass)}>
        {config.label}
      </span>
    </div>
  );
}
