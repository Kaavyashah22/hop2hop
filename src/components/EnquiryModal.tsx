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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Product, IntentLevel } from "@/types/marketplace";
import { IntentTag } from "./IntentTag";
import { Send, CheckCircle2, Zap, Package, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string, intentLevel: IntentLevel) => void;
}

const intentOptions: { value: IntentLevel; label: string; description: string; Icon: any }[] = [
  { value: 'urgent', label: 'Urgent', description: 'Need within 24-48 hours', Icon: Zap },
  { value: 'bulk', label: 'Bulk Order', description: 'Large quantity purchase', Icon: Package },
  { value: 'exploring', label: 'Just Exploring', description: 'Gathering information', Icon: Search },
];

export function EnquiryModal({ product, isOpen, onClose, onSubmit }: EnquiryModalProps) {
  const [message, setMessage] = useState("");
  const [intentLevel, setIntentLevel] = useState<IntentLevel>("exploring");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    onSubmit(message, intentLevel);
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setMessage("");
      setIntentLevel("exploring");
      onClose();
    }, 1500);
  };
  
  if (!product) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-status-available/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-status-available" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Enquiry Sent!</h3>
            <p className="text-muted-foreground text-center">
              Your enquiry has been sent to {product.sellerName}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Send Enquiry</DialogTitle>
              <DialogDescription>
                Enquiring about <span className="font-medium text-foreground">{product.name}</span> from {product.sellerName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your requirements, quantity needed, any specific questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
              
              <div className="space-y-3">
                <Label>Buyer Intent Level</Label>
                <RadioGroup
                  value={intentLevel}
                  onValueChange={(value) => setIntentLevel(value as IntentLevel)}
                  className="grid gap-3"
                >
                  {intentOptions.map((option) => {
                    const Icon = option.Icon;
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          intentLevel === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                        )}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          option.value === 'urgent' && "bg-intent-urgent/10",
                          option.value === 'bulk' && "bg-intent-bulk/10",
                          option.value === 'exploring' && "bg-intent-exploring/10"
                        )}>
                          <Icon className={cn(
                            "w-5 h-5",
                            option.value === 'urgent' && "text-intent-urgent",
                            option.value === 'bulk' && "text-intent-bulk",
                            option.value === 'exploring' && "text-intent-exploring"
                          )} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!message.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Enquiry
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
