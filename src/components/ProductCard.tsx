import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/marketplace";
import { StatusIndicator } from "./StatusIndicator";
import { PriceBadge } from "./PriceBadge";
import { Send, Building2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEnquire: (product: Product) => void;
}

export function ProductCard({ product, onEnquire }: ProductCardProps) {
  const isUnavailable = product.sellerStatus === 'unavailable';
  
  return (
    <Card className="card-hover overflow-hidden animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        
        <PriceBadge
          type={product.priceType}
          price={product.price}
          priceMin={product.priceMin}
          priceMax={product.priceMax}
        />
        
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{product.sellerName}</span>
          </div>
          <StatusIndicator status={product.sellerStatus} />
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button
          className="w-full"
          variant={isUnavailable ? "secondary" : "default"}
          disabled={isUnavailable}
          onClick={() => onEnquire(product)}
        >
          <Send className="w-4 h-4 mr-2" />
          {isUnavailable ? 'Not Available' : 'Send Enquiry'}
        </Button>
      </CardFooter>
    </Card>
  );
}
