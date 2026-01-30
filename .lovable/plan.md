
# Firebase Integration Plan (Without Image Storage)

## Overview

Connect the B2B marketplace with **Firebase** using only:
- **Firestore** - Database for products, enquiries, requirements, users
- **Firebase Authentication** - Email/password login/signup

No image/file storage will be implemented.

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                         │
│  (BuyerDashboard, SellerDashboard, EnquiryModal, etc.)     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Firebase SDK                             │
│        ┌──────────────┐       ┌──────────────┐             │
│        │  Firestore   │       │     Auth     │             │
│        │  (Database)  │       │   (Login)    │             │
│        └──────────────┘       └──────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Firebase Setup

**New Files:**
| File | Purpose |
|------|---------|
| `src/lib/firebase.ts` | Firebase SDK initialization |

**Dependencies to Install:**
- `firebase` package

**Environment Variables Needed:**
You'll need to provide these from your Firebase Console:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

### Phase 2: Firestore Database Structure

**Collections:**

| Collection | Fields |
|------------|--------|
| `users` | `id`, `email`, `name`, `role` (buyer/seller), `sellerStatus`, `createdAt` |
| `products` | `id`, `name`, `category`, `sellerId`, `sellerName`, `sellerStatus`, `priceType`, `price`, `priceMin`, `priceMax`, `description` |
| `enquiries` | `id`, `productId`, `productName`, `buyerId`, `buyerName`, `sellerId`, `message`, `intentLevel`, `status`, `closureReason`, `createdAt`, `respondedAt` |
| `requirements` | `id`, `buyerId`, `buyerName`, `productNeeded`, `quantity`, `location`, `timeline`, `description`, `interestedSellers[]`, `createdAt` |

**New File:**
| File | Purpose |
|------|---------|
| `src/services/firestore.ts` | All Firestore CRUD operations |

---

### Phase 3: Authentication

**New Files:**
| File | Purpose |
|------|---------|
| `src/contexts/AuthContext.tsx` | Auth state management (user, loading, signIn, signUp, signOut) |
| `src/pages/Auth.tsx` | Login/Signup page with role selection |
| `src/components/ProtectedRoute.tsx` | Route guard for authenticated pages |

**Features:**
- Email/password signup with role selection (Buyer or Seller)
- Email/password login
- Automatic session persistence
- Protected routes redirect to `/auth` if not logged in

---

### Phase 4: Real-Time Data Hooks

**New File:**
| File | Purpose |
|------|---------|
| `src/hooks/useFirestore.ts` | Real-time subscription hooks |

**Hooks to Create:**
- `useProducts()` - Live product listings
- `useEnquiries(sellerId)` - Live incoming enquiries for seller
- `useRequirements()` - Live buyer requirements
- `useUserProfile(userId)` - Live user profile data

All hooks use Firestore's `onSnapshot` for instant updates.

---

### Phase 5: Component Updates

**Files to Modify:**

| File | Changes |
|------|---------|
| `src/App.tsx` | Add AuthProvider, add `/auth` route, wrap with ProtectedRoute |
| `src/pages/Index.tsx` | Remove demo role switcher, use actual user role from auth |
| `src/components/BuyerDashboard.tsx` | Replace mock data with `useProducts()`, `useRequirements()` hooks |
| `src/components/SellerDashboard.tsx` | Replace mock data with `useEnquiries()`, `useRequirements()` hooks; use real seller status toggle |
| `src/components/EnquiryModal.tsx` | Submit enquiry to Firestore instead of mock |
| `src/components/ClosureFeedbackModal.tsx` | Update enquiry status in Firestore |

---

## File Summary

| New Files | Purpose |
|-----------|---------|
| `src/lib/firebase.ts` | Firebase config & initialization |
| `src/contexts/AuthContext.tsx` | Authentication context provider |
| `src/services/firestore.ts` | Database operations (CRUD) |
| `src/hooks/useFirestore.ts` | Real-time data hooks |
| `src/pages/Auth.tsx` | Login/Signup page |
| `src/components/ProtectedRoute.tsx` | Route protection |

| Modified Files | Changes |
|----------------|---------|
| `src/App.tsx` | Auth wrapper, new routes |
| `src/pages/Index.tsx` | Use real auth role |
| `src/components/BuyerDashboard.tsx` | Firestore hooks |
| `src/components/SellerDashboard.tsx` | Firestore hooks + real status toggle |
| `src/components/EnquiryModal.tsx` | Firestore submit |
| `src/components/ClosureFeedbackModal.tsx` | Firestore update |

---

## Prerequisites Before Implementation

To proceed, please provide your Firebase configuration from the Firebase Console (Project Settings → Your Apps → Config):

1. **API Key**
2. **Auth Domain** (usually `your-project.firebaseapp.com`)
3. **Project ID**
4. **Messaging Sender ID**
5. **App ID**

Also ensure you have:
- Created a Firebase project
- Enabled Firestore Database (can start in test mode)
- Enabled Email/Password authentication in Firebase Auth

Once you share the config values, I'll implement the complete integration.
