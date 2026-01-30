import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BuyerRequirement } from "@/types/marketplace";
import { MapPin, Calendar, Package, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RequirementCardProps {
  requirement: BuyerRequirement;
  isSeller?: boolean;
  onInterested?: (requirement: BuyerRequirement) => void;
  alreadyInterested?: boolean;
}

export function RequirementCard({ 
  requirement, 
  isSeller = false, 
  onInterested,
  alreadyInterested = false 
}: RequirementCardProps) {
  return (
    <Card className="card-hover animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight">
              {requirement.productNeeded}
            </h3>
            <p className="text-sm text-muted-foreground">
              by {requirement.buyerName} • {formatDistanceToNow(requirement.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {requirement.description}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span>{requirement.quantity}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{requirement.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{requirement.timeline}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{requirement.interestedSellers.length} interested</span>
          </div>
        </div>
      </CardContent>
      
      {isSeller && onInterested && (
        <CardFooter className="pt-0">
          <Button
            className="w-full"
            variant={alreadyInterested ? "secondary" : "default"}
            disabled={alreadyInterested}
            onClick={() => onInterested(requirement)}
          >
            {alreadyInterested ? 'Already Interested' : 'Show Interest'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
