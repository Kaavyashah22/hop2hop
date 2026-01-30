import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/marketplace";
import { BuyerDashboard } from "@/components/BuyerDashboard";
import { SellerDashboard } from "@/components/SellerDashboard";
import { ShoppingCart, Store, ArrowRightLeft } from "lucide-react";

const Index = () => {
  const [role, setRole] = useState<UserRole>('buyer');
  
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-bold text-lg">B2B Marketplace</span>
          </div>
          
          {/* Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary-foreground/70 hidden sm:block">Demo Mode:</span>
            <div className="flex bg-primary-foreground/10 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRole('buyer')}
                className={
                  role === 'buyer'
                    ? 'bg-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary'
                    : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-transparent'
                }
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buyer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRole('seller')}
                className={
                  role === 'seller'
                    ? 'bg-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary'
                    : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-transparent'
                }
              >
                <Store className="w-4 h-4 mr-2" />
                Seller
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Role-specific Dashboard */}
      {role === 'buyer' ? <BuyerDashboard /> : <SellerDashboard />}
    </div>
  );
};

export default Index;
