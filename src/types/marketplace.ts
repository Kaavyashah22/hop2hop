export type SellerStatus = 'available' | 'delayed' | 'unavailable';
export type PriceType = 'exact' | 'range' | 'negotiable';
export type IntentLevel = 'urgent' | 'bulk' | 'exploring';
export type UserRole = 'buyer' | 'seller';
export type EnquiryStatus = 'pending' | 'responded' | 'closed';
export type ClosureReason = 'deal_closed' | 'not_interested' | 'no_response';

export interface Product {
  id: string;
  name: string;
  category: string;
  sellerId: string;
  sellerName: string;
  sellerStatus: SellerStatus;
  priceType: PriceType;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  description: string;
  image?: string;
}

export interface Enquiry {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  message: string;
  intentLevel: IntentLevel;
  status: EnquiryStatus;
  closureReason?: ClosureReason;
  createdAt: Date;
  respondedAt?: Date;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  productNeeded: string;
  quantity: string;
  location: string;
  timeline: string;
  description: string;
  createdAt: Date;
  interestedSellers: string[];
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  status?: SellerStatus;
}
