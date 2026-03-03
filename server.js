require('dotenv').config();
const express = require('express');
const path = require('path');
const { getCarpets, addCarpet, deleteCarpet, getSettings, saveSettings } = require('./lib/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make settings available to ALL templates (including partials like footer)
app.use(async (req, res, next) => {
    try {
        res.locals.settings = await getSettings();
    } catch (e) {
        res.locals.settings = {};
    }
    next();
});

// ── PAGE ROUTES ──────────────────────────────────────────

app.get('/', async (req, res) => {
    const [carpets, settings] = await Promise.all([getCarpets(), getSettings()]);
    const featured = carpets.slice(0, 4);
    res.render('index', { featured, settings });
});

app.get('/about', async (req, res) => {
    const settings = await getSettings();
    res.render('about', { settings });
});

app.get('/products', async (req, res) => {
    const carpets = await getCarpets();
    res.render('products', { carpets });
});

app.get('/craftsmanship', async (req, res) => {
    const settings = await getSettings();
    res.render('craftsmanship', { settings });
});

app.get('/contact', async (req, res) => {
    const settings = await getSettings();
    res.render('contact', { success: false, settings });
});

app.post('/contact', async (req, res) => {
    const settings = await getSettings();
    console.log('Contact form submitted:', req.body);
    res.render('contact', { success: true, settings });
});

// ── ADMIN ROUTES ─────────────────────────────────────────

app.get('/admin', async (req, res) => {
    const [carpets, settings] = await Promise.all([getCarpets(), getSettings()]);
    res.render('admin', { carpets, settings });
});

app.post('/api/carpets', async (req, res) => {
    const {
        name, category, imageUrl, description,
        material, origin, knots, washing, face, sizes
    } = req.body;

    // sizes can be an array (multiple checkboxes) or a string
    const sizesArr = Array.isArray(sizes) ? sizes : (sizes ? [sizes] : []);

    await addCarpet({ name, category, imageUrl, description, material, origin, knots, washing, face, sizes: sizesArr });
    res.redirect('/admin');
});

app.post('/api/carpets/delete/:id', async (req, res) => {
    await deleteCarpet(req.params.id);
    res.redirect('/admin');
});

// ── SETTINGS ROUTE ───────────────────────────────────────

app.post('/api/settings', async (req, res) => {
    await saveSettings(req.body);
    res.redirect('/admin?saved=1');
});

// ── SERVER ───────────────────────────────────────────────

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server started. Visit http://localhost:${PORT}`);
    });
}

module.exports = app;
