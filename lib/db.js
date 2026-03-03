const admin = require('firebase-admin');

// Initialize only once (important for serverless/Vercel)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();
const CARPETS_COL = 'carpets';
const SETTINGS_DOC = 'siteSettings';
const SETTINGS_COL = 'config';

// ── CARPETS ──────────────────────────────────────────────

const getCarpets = async () => {
    try {
        const snapshot = await db.collection(CARPETS_COL).orderBy('createdAt', 'asc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Firestore getCarpets error:', error);
        return [];
    }
};

const addCarpet = async (carpetData) => {
    try {
        const ref = await db.collection(CARPETS_COL).add({
            ...carpetData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return ref.id;
    } catch (error) {
        console.error('Firestore addCarpet error:', error);
        throw error;
    }
};

const deleteCarpet = async (id) => {
    try {
        await db.collection(CARPETS_COL).doc(id).delete();
    } catch (error) {
        console.error('Firestore deleteCarpet error:', error);
        throw error;
    }
};

// ── SITE SETTINGS ────────────────────────────────────────

const defaultSettings = {
    // Heritage / About page images
    img_heritage: 'https://images.unsplash.com/photo-1596707323565-5c1cf4c4391b?auto=format&fit=crop&w=1000&q=80',
    img_weaving: 'https://images.unsplash.com/photo-1601053073740-456015b6d7a4?auto=format&fit=crop&w=1000&q=80',
    img_sustainable: 'https://images.unsplash.com/photo-1620612450529-68d7124fcae1?auto=format&fit=crop&w=1000&q=80',
    // Factory / Craftsmanship gallery
    img_factory1: '',
    img_factory2: '',
    img_factory3: '',
    img_factory4: '',
};

const getSettings = async () => {
    try {
        const doc = await db.collection(SETTINGS_COL).doc(SETTINGS_DOC).get();
        if (doc.exists) {
            return { ...defaultSettings, ...doc.data() };
        }
        return defaultSettings;
    } catch (error) {
        console.error('Firestore getSettings error:', error);
        return defaultSettings;
    }
};

const saveSettings = async (settingsData) => {
    try {
        await db.collection(SETTINGS_COL).doc(SETTINGS_DOC).set(settingsData, { merge: true });
    } catch (error) {
        console.error('Firestore saveSettings error:', error);
        throw error;
    }
};

module.exports = { getCarpets, addCarpet, deleteCarpet, getSettings, saveSettings };
