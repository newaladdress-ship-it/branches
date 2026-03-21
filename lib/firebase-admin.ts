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
