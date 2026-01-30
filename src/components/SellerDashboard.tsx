import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RequirementCard } from "@/components/RequirementCard";
import { EnquiryCard } from "@/components/EnquiryCard";
import { StatusIndicator } from "@/components/StatusIndicator";
import { mockEnquiries, mockRequirements, mockProducts } from "@/data/mockData";
import { SellerStatus, BuyerRequirement, Enquiry } from "@/types/marketplace";
import { Package, MessageSquare, FileText, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusOptions: { value: SellerStatus; label: string }[] = [
  { value: 'available', label: 'Available Today' },
  { value: 'delayed', label: 'Responds in 24 hrs' },
  { value: 'unavailable', label: 'Not Accepting' },
];

export function SellerDashboard() {
  const [sellerStatus, setSellerStatus] = useState<SellerStatus>('available');
  const [requirements, setRequirements] = useState<BuyerRequirement[]>(mockRequirements);
  const [activeTab, setActiveTab] = useState<'enquiries' | 'products' | 'requirements'>('enquiries');
  
  // Sort enquiries by intent level (urgent first)
  const sortedEnquiries = [...mockEnquiries].sort((a, b) => {
    const order = { urgent: 0, bulk: 1, exploring: 2 };
    return order[a.intentLevel] - order[b.intentLevel];
  });
  
  // Filter seller's own products
  const sellerProducts = mockProducts.filter(p => p.sellerId === 'seller-1');
  
  const handleShowInterest = (requirement: BuyerRequirement) => {
    setRequirements(requirements.map(req => {
      if (req.id === requirement.id) {
        return {
          ...req,
          interestedSellers: [...req.interestedSellers, 'seller-1'],
        };
      }
      return req;
    }));
    toast({
      title: "Interest Shown!",
      description: `You've shown interest in "${requirement.productNeeded}"`,
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Seller Dashboard</h1>
              <p className="text-muted-foreground">Manage your listings and enquiries</p>
            </div>
            
            {/* Status Selector */}
            <Card className="w-full lg:w-auto">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Your Status:</span>
                  <div className="flex gap-2">
                    {statusOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={sellerStatus === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSellerStatus(option.value)}
                        className="text-xs"
                      >
                        <StatusIndicator status={option.value} showLabel={false} size="sm" />
                        <span className="ml-2 hidden sm:inline">{option.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={activeTab === 'enquiries' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('enquiries')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Enquiries
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary-foreground/20 text-xs">
                {sortedEnquiries.length}
              </span>
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('products')}
            >
              <Package className="w-4 h-4 mr-2" />
              My Products
            </Button>
            <Button
              variant={activeTab === 'requirements' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('requirements')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Browse Requirements
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container py-6">
        {activeTab === 'enquiries' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Incoming Enquiries</h2>
              <p className="text-sm text-muted-foreground">
                Sorted by buyer intent level (urgent enquiries first)
              </p>
            </div>
            
            <div className="space-y-4 max-w-2xl">
              {sortedEnquiries.map((enquiry) => (
                <EnquiryCard key={enquiry.id} enquiry={enquiry} />
              ))}
            </div>
            
            {sortedEnquiries.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No enquiries yet.</p>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'products' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Your Products</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your product listings
                </p>
              </div>
              <Button>
                <Package className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
            
            <div className="grid gap-4 max-w-3xl">
              {sellerProducts.map((product) => (
                <Card key={product.id} className="animate-fade-in">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {product.priceType === 'exact' && `₹${product.price?.toLocaleString()}`}
                            {product.priceType === 'range' && `₹${product.priceMin?.toLocaleString()} - ₹${product.priceMax?.toLocaleString()}`}
                            {product.priceType === 'negotiable' && `From ₹${product.price?.toLocaleString()}`}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{product.priceType}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
        
        {activeTab === 'requirements' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Buyer Requirements</h2>
              <p className="text-sm text-muted-foreground">
                Browse and respond to buyer requirements
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requirements.map((requirement) => (
                <RequirementCard
                  key={requirement.id}
                  requirement={requirement}
                  isSeller
                  onInterested={handleShowInterest}
                  alreadyInterested={requirement.interestedSellers.includes('seller-1')}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
