import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Enquiry } from "@/types/marketplace";
import { IntentTag } from "./IntentTag";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnquiryCardProps {
  enquiry: Enquiry;
  showProduct?: boolean;
}

export function EnquiryCard({ enquiry, showProduct = true }: EnquiryCardProps) {
  return (
    <Card className={cn(
      "animate-fade-in transition-all",
      enquiry.intentLevel === 'urgent' && "border-l-4 border-l-intent-urgent"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            {showProduct && (
              <p className="text-sm text-muted-foreground">
                Enquiry for <span className="font-medium text-foreground">{enquiry.productName}</span>
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <IntentTag level={enquiry.intentLevel} size="sm" />
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(enquiry.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
          {enquiry.status === 'responded' && (
            <div className="flex items-center gap-1 text-xs text-status-available">
              <CheckCircle className="w-4 h-4" />
              Responded
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">{enquiry.buyerName}</p>
            <p className="text-sm text-muted-foreground">{enquiry.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
