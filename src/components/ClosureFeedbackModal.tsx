import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClosureReason } from "@/types/marketplace";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClosureFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: ClosureReason) => void;
  sellerName: string;
}

const closureOptions: { value: ClosureReason; label: string; description: string; Icon: any; color: string }[] = [
  { 
    value: 'deal_closed', 
    label: 'Deal Closed', 
    description: 'Successfully completed the transaction',
    Icon: CheckCircle2,
    color: 'text-status-available'
  },
  { 
    value: 'not_interested', 
    label: 'Not Interested', 
    description: 'Decided not to proceed',
    Icon: XCircle,
    color: 'text-status-unavailable'
  },
  { 
    value: 'no_response', 
    label: 'No Response', 
    description: 'Seller did not respond',
    Icon: Clock,
    color: 'text-status-delayed'
  },
];

export function ClosureFeedbackModal({ isOpen, onClose, onSubmit, sellerName }: ClosureFeedbackModalProps) {
  const [selected, setSelected] = useState<ClosureReason | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = () => {
    if (!selected) return;
    onSubmit(selected);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setSelected(null);
      onClose();
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-muted-foreground text-center">
              Your feedback helps improve the marketplace
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>How did it go?</DialogTitle>
              <DialogDescription>
                {sellerName} has responded to your enquiry. Please share the outcome.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              {closureOptions.map((option) => {
                const Icon = option.Icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelected(option.value)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                      selected === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", option.color)} />
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Skip
              </Button>
              <Button onClick={handleSubmit} disabled={!selected}>
                Submit Feedback
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
