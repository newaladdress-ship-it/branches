# Business Data Structure & Troubleshooting Guide

## Why Businesses Weren't Showing

The issue was that the **Latest Businesses** component on the homepage was filtering by status `'live'`, but new businesses are being saved with status `'approved'`. This mismatch caused the filter to exclude all businesses.

### Fixed Issues

1. **Status Filter Mismatch**
   - Before: Only showed businesses with status === 'live'
   - After: Now shows businesses with status === 'approved', 'pending', or 'live'
   - This matches the actual status value being saved when users submit a business

2. **Added Debug Logging**
   - Browser console now logs all fetched businesses with their status and category
   - Helps identify if data is being loaded from Firebase correctly

## Business Data Structure in Firebase

When a business is submitted through `/add-business`, it's saved with this structure:

```javascript
{
  businessName: "String",           // Required: Business name
  category: "restaurant",           // Required: Category ID (normalized)
  categoryId: "restaurant",         // Normalized category ID
  categorySlug: "restaurant",       // For URL routing
  subcategory: "Fine Dining",       // Optional: Sub-category
  description: "String (500-1000)", // Required: Business description
  phone: "03XX-XXXXXXX",            // Required: Phone number
  whatsapp: "92XXXXXXXXXX",         // Optional: WhatsApp number
  email: "business@example.com",    // Required: Email
  websiteUrl: "https://...",        // Optional: Website
  address: "Street, Area",          // Required: Physical address
  city: "Karachi",                  // Required: City
  logoUrl: "URL or empty string",   // Optional: Logo image URL
  slug: "business-name-karachi",    // Auto-generated: URL slug
  status: "approved",               // Status: approved/pending/live
  createdAt: Timestamp,             // Firebase server timestamp
  updatedAt: Timestamp,             // Firebase server timestamp
}
```

## Category Mapping System

Categories are stored as normalized IDs to handle multiple name variations:

```
restaurant → restaurants, food, restaurant & food, fine dining, etc.
real-estate → property, real estate, real-estate, properties, etc.
technology → tech, it, technology & it, software development, etc.
```

The system automatically normalizes category names to their main ID during submission.

## How Businesses Appear in Different Places

### 1. Latest Businesses (Homepage)
- **File**: `components/home/latest-businesses.tsx`
- **Query**: Fetches 100 most recent businesses ordered by `createdAt`
- **Filter**: Only shows if `status` is 'approved', 'pending', or 'live'
- **Display**: Shows top 8 businesses
- **Location**: Below categories section on homepage

### 2. Category Pages
- **File**: `app/category/[categorySlug]/page.tsx`
- **Query**: Uses multiple query variants:
  - `where('categoryId', '==', categorySlug)`
  - `where('categorySlug', '==', categorySlug)`
  - `where('category', 'in', allPossibleValues)`
- **Filter**: Only shows if status is in LIVE_STATUSES set
- **Display**: Shows up to 40 businesses per category

### 3. City-Category Pages
- **File**: `app/businesses/[city]/[categorySlug]/page.tsx`
- **Query**: Filters by both city AND category
- **Display**: Shows businesses for specific city-category combination

## Ensuring Business Data Persists

Your business data is stored in Firebase Firestore and **will not be deleted**:

1. **Data Storage**: Uses `addDoc()` which creates permanent records
2. **No Delete Logic**: No code automatically removes business data
3. **Status Field**: Controls visibility (approved/pending/live = visible)
4. **Manual Deletion Only**: Data only removed if manually deleted from Firebase console

To verify data is being saved:
1. Open Firebase console → Firestore
2. Check `businesses` collection
3. Look for recently added documents
4. Verify they have `status: "approved"` and correct `category` field

## Debug Steps If Businesses Still Don't Show

### Check Console Logs
Open browser DevTools (F12) → Console tab
Look for logs starting with `[v0]`:
```
[v0] Fetching latest businesses from Firebase...
[v0] Total documents fetched: X
[v0] Business: Name, Status: approved, Category: restaurant
[v0] Filtered businesses count: X
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Total documents fetched: 0" | Check Firebase connection and permissions |
| "Filtered businesses count: 0" | Check if status field is 'approved', 'pending', or 'live' |
| Business not in category page | Check category field matches category ID (e.g., 'restaurant') |
| Data disappeared from homepage | Status might be set to 'draft' or undefined - edit and set to 'approved' |

## Category IDs & Names Reference

```
restaurants      → Fast Food, Fine Dining, Cafe, Bakery, etc.
real-estate      → Residential, Commercial, Property Management
technology       → Software Development, Web Design, IT Support
healthcare       → Hospitals, Clinics, Pharmacies, Medical
education        → Schools, Colleges, Universities, Training
retail           → Supermarkets, Clothing, Electronics, Jewelry
construction     → Contractors, Architecture, Interior Design
automotive       → Car Dealers, Mechanics, Service Centers
finance          → Banks, Insurance, Investment, Accounting
travel           → Airlines, Hotels, Tour Operators
beauty           → Salons, Spas, Gyms, Cosmetics
logistics        → Courier, Cargo, Warehousing, Transport
```

## Important Notes

- **Status Field**: Must be set to 'approved', 'pending', or 'live' to display
- **Category Field**: Must match one of the category IDs above
- **createdAt**: Automatically set to Firebase server timestamp
- **slug**: Auto-generated from business name + city
- **No Data Loss**: Submitted businesses are permanent unless manually deleted

If you're still having issues, check the browser console logs (with [v0] prefix) to see what data is being fetched and whether filtering is working correctly.
