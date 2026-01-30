import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct } from "@/services/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { PriceType, SellerStatus } from "@/types/marketplace";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  "Industrial Machinery",
  "Raw Materials",
  "Electronics",
  "Packaging",
  "Chemicals",
  "Textiles",
  "Construction",
  "Agriculture",
  "Other",
];

export function AddProductModal({ open, onClose }: AddProductModalProps) {
  const { user, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    priceType: "exact" as PriceType,
    price: "",
    priceMin: "",
    priceMax: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;

    // Validation
    if (!formData.name.trim() || !formData.category || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.priceType === "exact" && !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please enter a price.",
        variant: "destructive",
      });
      return;
    }

    if (formData.priceType === "range" && (!formData.priceMin || !formData.priceMax)) {
      toast({
        title: "Validation Error",
        description: "Please enter min and max price.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createProduct({
        name: formData.name.trim(),
        category: formData.category,
        sellerId: user.uid,
        sellerName: userProfile.name,
        sellerStatus: (userProfile.sellerStatus || "available") as SellerStatus,
        priceType: formData.priceType,
        price: formData.priceType !== "range" ? parseFloat(formData.price) : undefined,
        priceMin: formData.priceType === "range" ? parseFloat(formData.priceMin) : undefined,
        priceMax: formData.priceType === "range" ? parseFloat(formData.priceMax) : undefined,
        description: formData.description.trim(),
      });

      toast({
        title: "Product Added!",
        description: `"${formData.name}" has been added to your listings.`,
      });

      // Reset form and close
      setFormData({
        name: "",
        category: "",
        priceType: "exact",
        price: "",
        priceMin: "",
        priceMax: "",
        description: "",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              List a new product for buyers to discover.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Industrial Steel Pipes"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                maxLength={100}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priceType">Price Type *</Label>
              <Select
                value={formData.priceType}
                onValueChange={(value: PriceType) =>
                  setFormData({ ...formData, priceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exact">Exact Price</SelectItem>
                  <SelectItem value="range">Price Range</SelectItem>
                  <SelectItem value="negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.priceType === "range" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priceMin">Min Price (₹) *</Label>
                  <Input
                    id="priceMin"
                    type="number"
                    placeholder="10000"
                    value={formData.priceMin}
                    onChange={(e) =>
                      setFormData({ ...formData, priceMin: e.target.value })
                    }
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priceMax">Max Price (₹) *</Label>
                  <Input
                    id="priceMax"
                    type="number"
                    placeholder="50000"
                    value={formData.priceMax}
                    onChange={(e) =>
                      setFormData({ ...formData, priceMax: e.target.value })
                    }
                    min="0"
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="price">
                  {formData.priceType === "exact" ? "Price (₹) *" : "Starting Price (₹) *"}
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="25000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  min="0"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your product, specifications, and any other relevant details..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                maxLength={1000}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
