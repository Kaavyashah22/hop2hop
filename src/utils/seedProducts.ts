import { collection, addDoc, getDocs, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const sampleProducts = [
  {
    name: 'Industrial Steel Pipes',
    category: 'Raw Materials',
    priceType: 'exact',
    price: 2500,
    description: 'High-quality galvanized steel pipes for industrial use. Available in various sizes.',
  },
  {
    name: 'Electronic Control Panels',
    category: 'Electronics',
    priceType: 'range',
    priceMin: 15000,
    priceMax: 45000,
    description: 'Custom electronic control panels for automation systems.',
  },
  {
    name: 'Bulk Packaging Materials',
    category: 'Packaging',
    priceType: 'negotiable',
    price: 500,
    description: 'Eco-friendly packaging solutions for bulk orders.',
  },
  {
    name: 'Industrial Machinery Parts',
    category: 'Machinery',
    priceType: 'range',
    priceMin: 8000,
    priceMax: 25000,
    description: 'Replacement parts for heavy industrial machinery.',
  },
  {
    name: 'Safety Equipment Kit',
    category: 'Safety',
    priceType: 'exact',
    price: 3200,
    description: 'Complete safety equipment kit for industrial workers.',
  },
  {
    name: 'Chemical Solvents',
    category: 'Chemicals',
    priceType: 'negotiable',
    price: 1200,
    description: 'Industrial-grade chemical solvents for manufacturing.',
  },
];

const sampleRequirements = [
  {
    buyerName: 'Metro Construction Corp',
    productNeeded: 'Reinforced Concrete Blocks',
    quantity: '5,000 units',
    location: 'Mumbai, Maharashtra',
    timeline: 'Within 2 weeks',
    description: 'Looking for high-quality reinforced concrete blocks for a commercial building project.',
    interestedSellers: [],
  },
  {
    buyerName: 'AutoTech Industries',
    productNeeded: 'CNC Machine Components',
    quantity: '50 sets',
    location: 'Pune, Maharashtra',
    timeline: 'Within 1 month',
    description: 'Require precision CNC machine components for our manufacturing unit expansion.',
    interestedSellers: [],
  },
  {
    buyerName: 'FoodPack Solutions',
    productNeeded: 'Food-Grade Packaging',
    quantity: '100,000 units/month',
    location: 'Delhi NCR',
    timeline: 'Ongoing contract',
    description: 'Seeking reliable supplier for food-grade packaging materials with ISO certification.',
    interestedSellers: [],
  },
  {
    buyerName: 'Green Energy Systems',
    productNeeded: 'Solar Panel Mounting Brackets',
    quantity: '2,000 units',
    location: 'Bangalore, Karnataka',
    timeline: 'Within 3 weeks',
    description: 'Need durable aluminum mounting brackets for rooftop solar installations.',
    interestedSellers: [],
  },
  {
    buyerName: 'PharmaCare Ltd',
    productNeeded: 'Laboratory Equipment',
    quantity: '25 units',
    location: 'Hyderabad, Telangana',
    timeline: 'Within 45 days',
    description: 'Looking for certified lab equipment including centrifuges and spectrophotometers.',
    interestedSellers: [],
  },
];

// Sample enquiries - these will be linked to seller's products
const sampleEnquiries = [
  {
    buyerName: 'Rajesh Kumar',
    message: 'Need 500 units urgently for our construction project starting next week. Can you deliver?',
    intentLevel: 'urgent',
    status: 'pending',
  },
  {
    buyerName: 'Priya Sharma',
    message: 'Looking for monthly supply of 10,000 units. Can we discuss bulk pricing and long-term contract?',
    intentLevel: 'bulk',
    status: 'pending',
  },
  {
    buyerName: 'Amit Patel',
    message: 'Interested in learning more about your products. Can you share catalog and pricing details?',
    intentLevel: 'exploring',
    status: 'pending',
  },
  {
    buyerName: 'Sunita Reddy',
    message: 'We need 200 units by end of this week. This is very urgent - please confirm availability ASAP.',
    intentLevel: 'urgent',
    status: 'pending',
  },
  {
    buyerName: 'Vikram Singh',
    message: 'Our company is expanding and we need a reliable supplier for 5,000+ units per month. Interested in partnership.',
    intentLevel: 'bulk',
    status: 'pending',
  },
];

export async function seedProducts(userId: string, userName: string): Promise<{ success: boolean; message: string }> {
  try {
    const existingProducts = await getDocs(collection(db, 'products'));
    const existingRequirements = await getDocs(collection(db, 'requirements'));
    const existingEnquiries = await getDocs(query(collection(db, 'enquiries'), where('sellerId', '==', userId)));
    
    let productsAdded = 0;
    let requirementsAdded = 0;
    let enquiriesAdded = 0;
    const addedProductIds: { id: string; name: string }[] = [];

    // Seed products if none exist
    if (existingProducts.empty) {
      for (const product of sampleProducts) {
        const docRef = await addDoc(collection(db, 'products'), {
          ...product,
          sellerId: userId,
          sellerName: userName,
          sellerStatus: 'available',
          createdAt: serverTimestamp(),
        });
        addedProductIds.push({ id: docRef.id, name: product.name });
      }
      productsAdded = sampleProducts.length;
    } else {
      // Get existing products for this seller to link enquiries
      const sellerProducts = await getDocs(query(collection(db, 'products'), where('sellerId', '==', userId)));
      sellerProducts.docs.forEach(doc => {
        addedProductIds.push({ id: doc.id, name: doc.data().name });
      });
    }

    // Seed requirements if none exist
    if (existingRequirements.empty) {
      for (const requirement of sampleRequirements) {
        await addDoc(collection(db, 'requirements'), {
          ...requirement,
          buyerId: `demo-buyer-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: serverTimestamp(),
        });
      }
      requirementsAdded = sampleRequirements.length;
    }

    // Seed enquiries if none exist for this seller and they have products
    if (existingEnquiries.empty && addedProductIds.length > 0) {
      for (let i = 0; i < sampleEnquiries.length; i++) {
        const enquiry = sampleEnquiries[i];
        const product = addedProductIds[i % addedProductIds.length]; // Cycle through products
        
        await addDoc(collection(db, 'enquiries'), {
          ...enquiry,
          productId: product.id,
          productName: product.name,
          buyerId: `demo-buyer-${Math.random().toString(36).substr(2, 9)}`,
          sellerId: userId,
          createdAt: serverTimestamp(),
        });
      }
      enquiriesAdded = sampleEnquiries.length;
    }

    if (productsAdded === 0 && requirementsAdded === 0 && enquiriesAdded === 0) {
      return { 
        success: true, 
        message: `Data already seeded (${existingProducts.size} products, ${existingRequirements.size} requirements, ${existingEnquiries.size} enquiries exist)` 
      };
    }

    const messages = [];
    if (productsAdded > 0) messages.push(`${productsAdded} products`);
    if (requirementsAdded > 0) messages.push(`${requirementsAdded} buyer requirements`);
    if (enquiriesAdded > 0) messages.push(`${enquiriesAdded} enquiries`);

    return { 
      success: true, 
      message: `Successfully added ${messages.join(', ')}!` 
    };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { success: false, message: 'Failed to seed data. Please try again.' };
  }
}
