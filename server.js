require('dotenv').config();
const express = require('express');
const path = require('path');
const { getCarpets, addCarpet, deleteCarpet } = require('./lib/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup EJS and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Page Routes ---

app.get('/', async (req, res) => {
    const carpets = await getCarpets();
    const featured = carpets.slice(0, 4);
    res.render('index', { featured });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/products', async (req, res) => {
    const carpets = await getCarpets();
    res.render('products', { carpets });
});

app.get('/craftsmanship', (req, res) => {
    res.render('craftsmanship');
});

app.get('/contact', (req, res) => {
    res.render('contact', { success: false });
});

app.post('/contact', (req, res) => {
    console.log('Contact form submitted:', req.body);
    res.render('contact', { success: true });
});

// --- Admin Routes ---

app.get('/admin', async (req, res) => {
    const carpets = await getCarpets();
    res.render('admin', { carpets });
});

app.post('/api/carpets', async (req, res) => {
    const { name, category, imageUrl, description, material, origin } = req.body;
    await addCarpet({ name, category, imageUrl, description, material, origin });
    res.redirect('/admin');
});

app.post('/api/carpets/delete/:id', async (req, res) => {
    await deleteCarpet(req.params.id);
    res.redirect('/admin');
});

// Only start the server locally; Vercel handles listening in production
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server started. Visit http://localhost:${PORT}`);
    });
}

module.exports = app;
