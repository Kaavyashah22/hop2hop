import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Enquiry, BuyerRequirement, SellerStatus, IntentLevel, EnquiryStatus, ClosureReason } from '@/types/marketplace';

// ============= PRODUCTS =============

export async function getProducts(): Promise<Product[]> {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('category', '==', category));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('sellerId', '==', sellerId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'products', productId), updates);
}

export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));
}

// ============= ENQUIRIES =============

export async function createEnquiry(enquiry: {
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  message: string;
  intentLevel: IntentLevel;
}): Promise<string> {
  const docRef = await addDoc(collection(db, 'enquiries'), {
    ...enquiry,
    status: 'pending' as EnquiryStatus,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getEnquiriesForSeller(sellerId: string): Promise<Enquiry[]> {
  const q = query(
    collection(db, 'enquiries'),
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      respondedAt: data.respondedAt?.toDate() || undefined,
    };
  }) as Enquiry[];
}

export async function getEnquiriesForBuyer(buyerId: string): Promise<Enquiry[]> {
  const q = query(
    collection(db, 'enquiries'),
    where('buyerId', '==', buyerId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      respondedAt: data.respondedAt?.toDate() || undefined,
    };
  }) as Enquiry[];
}

export async function updateEnquiryStatus(
  enquiryId: string,
  status: EnquiryStatus,
  closureReason?: ClosureReason
): Promise<void> {
  const updates: any = { status };
  if (status === 'responded') {
    updates.respondedAt = serverTimestamp();
  }
  if (closureReason) {
    updates.closureReason = closureReason;
  }
  await updateDoc(doc(db, 'enquiries', enquiryId), updates);
}

// ============= REQUIREMENTS =============

export async function createRequirement(requirement: {
  buyerId: string;
  buyerName: string;
  productNeeded: string;
  quantity: string;
  location: string;
  timeline: string;
  description: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, 'requirements'), {
    ...requirement,
    interestedSellers: [],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getRequirements(): Promise<BuyerRequirement[]> {
  const q = query(collection(db, 'requirements'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  }) as BuyerRequirement[];
}

export async function getRequirementsForBuyer(buyerId: string): Promise<BuyerRequirement[]> {
  const q = query(
    collection(db, 'requirements'),
    where('buyerId', '==', buyerId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  }) as BuyerRequirement[];
}

export async function addInterestedSeller(requirementId: string, sellerId: string): Promise<void> {
  await updateDoc(doc(db, 'requirements', requirementId), {
    interestedSellers: arrayUnion(sellerId),
  });
}

export async function deleteRequirement(requirementId: string): Promise<void> {
  await deleteDoc(doc(db, 'requirements', requirementId));
}

// ============= USERS =============

export async function updateSellerStatus(userId: string, status: SellerStatus): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    sellerStatus: status,
  });
}

export async function getUserProfile(userId: string) {
  const docSnap = await getDoc(doc(db, 'users', userId));
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: userId,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  }
  return null;
}
