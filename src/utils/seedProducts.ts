import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
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

export async function seedProducts(userId: string, userName: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if products already exist for this user
    const existingProducts = await getDocs(collection(db, 'products'));
    const existingRequirements = await getDocs(collection(db, 'requirements'));
    
    let productsAdded = 0;
    let requirementsAdded = 0;

    // Seed products if none exist
    if (existingProducts.empty) {
      for (const product of sampleProducts) {
        await addDoc(collection(db, 'products'), {
          ...product,
          sellerId: userId,
          sellerName: userName,
          sellerStatus: 'available',
          createdAt: serverTimestamp(),
        });
      }
      productsAdded = sampleProducts.length;
    }

    // Seed requirements if none exist (use a demo buyer ID)
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

    if (productsAdded === 0 && requirementsAdded === 0) {
      return { 
        success: true, 
        message: `Data already seeded (${existingProducts.size} products, ${existingRequirements.size} requirements exist)` 
      };
    }

    const messages = [];
    if (productsAdded > 0) messages.push(`${productsAdded} products`);
    if (requirementsAdded > 0) messages.push(`${requirementsAdded} buyer requirements`);

    return { 
      success: true, 
      message: `Successfully added ${messages.join(' and ')}!` 
    };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { success: false, message: 'Failed to seed data. Please try again.' };
  }
}
