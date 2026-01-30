import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BuyerDashboard } from "@/components/BuyerDashboard";
import { SellerDashboard } from "@/components/SellerDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Store, LogOut, Loader2, Database } from "lucide-react";
import { seedProducts } from "@/utils/seedProducts";
import { toast } from "sonner";
const Index = () => {
  const { userProfile, signOut, loading } = useAuth();
  const [seeding, setSeeding] = useState(false);

  const handleSeedProducts = async () => {
    setSeeding(true);
    const result = await seedProducts();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setSeeding(false);
  };

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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

          {/* Seed & User Info & Sign Out */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSeedProducts}
              disabled={seeding}
              className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              {seeding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Database className="w-4 h-4 mr-2" />
              )}
              <span className="hidden sm:inline">Seed Data</span>
            </Button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{userProfile.name}</p>
              <p className="text-xs text-primary-foreground/70 capitalize">
                {userProfile.role}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Role-specific Dashboard */}
      {userProfile.role === "buyer" ? <BuyerDashboard /> : <SellerDashboard />}
    </div>
  );
};

export default Index;
