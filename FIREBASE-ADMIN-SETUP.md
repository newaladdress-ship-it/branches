# Firebase Admin SDK Setup - Complete Solution

## 🔧 **Fix: Environment Variable 'FIREBASE_ADMIN_PRIVATE_KEY' Error**

### **Root Cause**
The error occurs because Vercel is trying to reference a secret `firebase_admin_private_key` that doesn't exist in your Vercel project. Your `vercel.json` file references secrets using `@secret_name` syntax, but these secrets haven't been created.

---

## **Step 1: Get Firebase Service Account Credentials**

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: `branches-app-ff0a2`
3. **Navigate**: Project Settings → Service accounts
4. **Click**: "Generate new private key"
5. **Download** the JSON file
6. **Open** the JSON file and copy these values:
   - `private_key` (includes BEGIN/END lines)
   - `client_email`
   - `project_id`

---

## **Step 2: Add Environment Variables in Vercel**

### **Method A: Using Vercel Dashboard (Recommended)**

1. **Go to**: https://vercel.com/dashboard
2. **Select your project**
3. **Go to**: Settings → Environment Variables
4. **Add these variables**:

#### **Public Variables (NEXT_PUBLIC_*)**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1dRJtLFMhBqieIj6JrtZsd4j0jd1xM_Y
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=branches-app-ff0a2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=branches-app-ff0a2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=branches-app-ff0a2.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=817543103901
NEXT_PUBLIC_FIREBASE_APP_ID=1:817543103901:web:0f1de5eacc949505dc9b74
```

#### **Private Variables (Firebase Admin)**
```
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
[YOUR_ACTUAL_PRIVATE_KEY_HERE]
-----END PRIVATE KEY-----

FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@branches-app-ff0a2.iam.gserviceaccount.com
FIREBASE_ADMIN_PROJECT_ID=branches-app-ff0a2
```

### **Method B: Using Vercel CLI**
```bash
# Add public variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID

# Add private variables
vercel env add FIREBASE_ADMIN_PRIVATE_KEY
vercel env add FIREBASE_ADMIN_CLIENT_EMAIL
vercel env add FIREBASE_ADMIN_PROJECT_ID
```

---

## **Step 3: Local Development Setup**

### **Create `.env.local` file**
```env
# Firebase Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1dRJtLFMhBqieIj6JrtZsd4j0jd1xM_Y
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=branches-app-ff0a2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=branches-app-ff0a2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=branches-app-ff0a2.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=817543103901
NEXT_PUBLIC_FIREBASE_APP_ID=1:817543103901:web:0f1de5eacc949505dc9b74

# Firebase Admin Configuration (Private)
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@branches-app-ff0a2.iam.gserviceaccount.com
FIREBASE_ADMIN_PROJECT_ID=branches-app-ff0a2
```

---

## **Step 4: Firebase Admin SDK Code**

### **File: `lib/firebase-admin.ts`**
```typescript
import admin from 'firebase-admin';

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  try {
    // Initialize Firebase Admin with environment variables
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!privateKey || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PROJECT_ID) {
      throw new Error('Missing Firebase Admin environment variables');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      }),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
}

// Export Firebase Admin services
export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
export const adminStorage = admin.storage();

export default admin;
```

---

## **Step 5: Install Firebase Admin SDK**

```bash
npm install firebase-admin
# or
pnpm add firebase-admin
# or
yarn add firebase-admin
```

---

## **Step 6: Usage Examples**

### **API Route Example**
```typescript
// pages/api/admin/user.ts
import { adminAuth } from '../../../lib/firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid } = req.body;
    const user = await adminAuth.getUser(uid);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### **Server-side Component Example**
```typescript
// app/admin/page.tsx
import { adminFirestore } from '../../lib/firebase-admin';

async function getUsers() {
  const usersSnapshot = await adminFirestore.collection('users').get();
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function AdminPage() {
  const users = await getUsers();
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {users.map(user => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
}
```

---

## **Common Mistakes & Solutions**

### **❌ Mistake 1: Incorrect Private Key Format**
```bash
# WRONG - Missing newlines
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----MIIEvQIBADAN...-----END PRIVATE KEY-----"

# CORRECT - With proper newlines
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADAN...\n-----END PRIVATE KEY-----\n"
```

### **❌ Mistake 2: Using Secret References Without Creating Secrets**
```json
// WRONG - References non-existent secrets
"FIREBASE_ADMIN_PRIVATE_KEY": "@firebase_admin_private_key"

// CORRECT - Direct value or properly created secret
"FIREBASE_ADMIN_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\n..."
```

### **❌ Mistake 3: Missing Environment Variables**
```typescript
// WRONG - No error handling
admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  }),
});

// CORRECT - With validation and error handling
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!privateKey || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PROJECT_ID) {
  throw new Error('Missing Firebase Admin environment variables');
}
```

---

## **Step 7: Verification**

### **Test Locally**
```bash
npm run dev
# Check console for Firebase Admin initialization success
```

### **Test in Production**
1. **Deploy to Vercel**
2. **Check deployment logs** for initialization success
3. **Test Admin functionality** (API routes, server components)

### **Debugging Tips**
```typescript
// Add this to your firebase-admin.ts for debugging
console.log('Environment variables check:', {
  hasPrivateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  hasClientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  hasProjectId: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
});
```

---

## **Final Checklist**

- [ ] Firebase service account JSON downloaded
- [ ] Private key copied with BEGIN/END lines
- [ ] Environment variables added in Vercel dashboard
- [ ] `.env.local` created for local development
- [ ] Firebase Admin SDK installed
- [ ] `lib/firebase-admin.ts` created
- [ ] Private key format with `\n` newlines
- [ ] All environments selected (Production, Preview, Development)
- [ ] Project redeployed
- [ ] Admin functionality tested

---

**🎉 Once completed, your Firebase Admin SDK will work correctly in both development and production!**
