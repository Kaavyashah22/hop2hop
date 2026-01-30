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

export async function seedProducts(userId: string, userName: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if products already exist for this user
    const existingProducts = await getDocs(collection(db, 'products'));
    if (!existingProducts.empty) {
      return { success: true, message: `Products already seeded (${existingProducts.size} products exist)` };
    }

    // Add sample products with authenticated user as owner
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), {
        ...product,
        sellerId: userId,
        sellerName: userName,
        sellerStatus: 'available',
        createdAt: serverTimestamp(),
      });
    }

    return { success: true, message: `Successfully added ${sampleProducts.length} sample products to your account!` };
  } catch (error) {
    console.error('Error seeding products:', error);
    return { success: false, message: 'Failed to seed products. Please try again.' };
  }
}
