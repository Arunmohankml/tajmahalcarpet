const admin = require('firebase-admin');

// Initialize only once (important for serverless/Vercel)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // dotenv stores \n as literal \\n — replace them back
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();
const COLLECTION = 'carpets';

/**
 * Fetch all carpets from Firestore, ordered by creation time.
 */
const getCarpets = async () => {
    try {
        const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'asc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Firestore getCarpets error:', error);
        return [];
    }
};

/**
 * Add a new carpet document to Firestore.
 */
const addCarpet = async (carpetData) => {
    try {
        const ref = await db.collection(COLLECTION).add({
            ...carpetData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return ref.id;
    } catch (error) {
        console.error('Firestore addCarpet error:', error);
        throw error;
    }
};

/**
 * Delete a carpet document by its Firestore document ID.
 */
const deleteCarpet = async (id) => {
    try {
        await db.collection(COLLECTION).doc(id).delete();
    } catch (error) {
        console.error('Firestore deleteCarpet error:', error);
        throw error;
    }
};

module.exports = { getCarpets, addCarpet, deleteCarpet };
