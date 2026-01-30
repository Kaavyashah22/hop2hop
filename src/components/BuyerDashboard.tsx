import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { RequirementCard } from "@/components/RequirementCard";
import { EnquiryModal } from "@/components/EnquiryModal";
import { ClosureFeedbackModal } from "@/components/ClosureFeedbackModal";
import { useProducts, useBuyerRequirements } from "@/hooks/useFirestore";
import { createRequirement } from "@/services/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Product, IntentLevel } from "@/types/marketplace";
import { Search, Plus, X, FileText, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function BuyerDashboard() {
  const { userProfile, user } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const { requirements, loading: requirementsLoading } = useBuyerRequirements(user?.uid);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isClosureOpen, setIsClosureOpen] = useState(false);
  const [isPostingRequirement, setIsPostingRequirement] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "requirements">("products");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for new requirement
  const [newRequirement, setNewRequirement] = useState({
    productNeeded: "",
    quantity: "",
    location: "",
    timeline: "",
    description: "",
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnquire = (product: Product) => {
    setSelectedProduct(product);
    setIsEnquiryOpen(true);
  };

  const handleEnquirySubmit = (message: string, intentLevel: IntentLevel) => {
    // After some time, show closure feedback modal (simulating seller response)
    setTimeout(() => {
      setIsClosureOpen(true);
    }, 2000);
  };

  const handlePostRequirement = async () => {
    if (!newRequirement.productNeeded.trim() || !user || !userProfile) return;

    setIsSubmitting(true);
    try {
      await createRequirement({
        buyerId: user.uid,
        buyerName: userProfile.name,
        productNeeded: newRequirement.productNeeded,
        quantity: newRequirement.quantity,
        location: newRequirement.location,
        timeline: newRequirement.timeline,
        description: newRequirement.description,
      });

      setNewRequirement({
        productNeeded: "",
        quantity: "",
        location: "",
        timeline: "",
        description: "",
      });
      setIsPostingRequirement(false);
      toast({
        title: "Requirement Posted!",
        description: "Sellers will now be able to see and respond to your requirement.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post requirement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = productsLoading || requirementsLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
              <p className="text-muted-foreground">Find products and post requirements</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "products" ? "default" : "outline"}
                onClick={() => setActiveTab("products")}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Products
              </Button>
              <Button
                variant={activeTab === "requirements" ? "default" : "outline"}
                onClick={() => setActiveTab("requirements")}
              >
                <FileText className="w-4 h-4 mr-2" />
                My Requirements
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : activeTab === "products" ? (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search products or categories..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onEnquire={handleEnquire} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your search.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Requirements Section */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Requirements</h2>
              {!isPostingRequirement && (
                <Button onClick={() => setIsPostingRequirement(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Requirement
                </Button>
              )}
            </div>

            {/* New Requirement Form */}
            {isPostingRequirement && (
              <Card className="mb-6 animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg">Post New Requirement</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPostingRequirement(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productNeeded">Product / Service Needed</Label>
                      <Input
                        id="productNeeded"
                        placeholder="e.g., Steel Pipes, CNC Parts"
                        value={newRequirement.productNeeded}
                        onChange={(e) =>
                          setNewRequirement({ ...newRequirement, productNeeded: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        placeholder="e.g., 500 units"
                        value={newRequirement.quantity}
                        onChange={(e) =>
                          setNewRequirement({ ...newRequirement, quantity: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Mumbai, Maharashtra"
                        value={newRequirement.location}
                        onChange={(e) =>
                          setNewRequirement({ ...newRequirement, location: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input
                        id="timeline"
                        placeholder="e.g., Within 2 weeks"
                        value={newRequirement.timeline}
                        onChange={(e) =>
                          setNewRequirement({ ...newRequirement, timeline: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide more details about your requirement..."
                      value={newRequirement.description}
                      onChange={(e) =>
                        setNewRequirement({ ...newRequirement, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsPostingRequirement(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePostRequirement}
                      disabled={!newRequirement.productNeeded.trim() || isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post Requirement"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requirements.map((requirement) => (
                <RequirementCard key={requirement.id} requirement={requirement} />
              ))}
            </div>

            {requirements.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't posted any requirements yet.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <EnquiryModal
        product={selectedProduct}
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        onSubmit={handleEnquirySubmit}
      />

      <ClosureFeedbackModal
        isOpen={isClosureOpen}
        onClose={() => setIsClosureOpen(false)}
        onSubmit={(reason) => {
          toast({
            title: "Feedback Submitted",
            description: "Thank you for your feedback!",
          });
        }}
        sellerName={selectedProduct?.sellerName || ""}
      />
    </div>
  );
}
