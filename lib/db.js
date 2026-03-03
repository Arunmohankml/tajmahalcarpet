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

const updateCarpet = async (id, carpetData) => {
    try {
        // Remove undefined fields
        const clean = Object.fromEntries(Object.entries(carpetData).filter(([_, v]) => v !== undefined));
        await db.collection(CARPETS_COL).doc(id).update(clean);
    } catch (error) {
        console.error('Firestore updateCarpet error:', error);
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
    // Contact Info
    contact_address: 'Carpet Manufacturers & Exporters\nChauri Road, Bhadohi - 221401\nUttar Pradesh, India',
    contact_phone1: '+91 8299501435, +91 9918003355',
    contact_phone2: '+91 9839915423, +91 9415225423',
    contact_email: 'tmproducts.bhadohi@gmail.com',
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

// ── MESSAGES ─────────────────────────────────────────────

const MESSAGES_COL = 'messages';

const addMessage = async (messageData) => {
    try {
        await db.collection(MESSAGES_COL).add({
            ...messageData,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Firestore addMessage error:', error);
        throw error;
    }
};

const getMessages = async () => {
    try {
        const snapshot = await db.collection(MESSAGES_COL).orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Firestore getMessages error:', error);
        return [];
    }
};

const deleteMessage = async (id) => {
    try {
        await db.collection(MESSAGES_COL).doc(id).delete();
    } catch (error) {
        console.error('Firestore deleteMessage error:', error);
        throw error;
    }
};

module.exports = {
    getCarpets, addCarpet, deleteCarpet, updateCarpet,
    getSettings, saveSettings,
    addMessage, getMessages, deleteMessage
};
