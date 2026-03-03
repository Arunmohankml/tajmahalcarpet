# Tajmahal Products - Website Documentation

Welcome to the documentation for the Tajmahal Products luxury carpet website. This modern, lightweight web application is built with Node.js, Express, and EJS, designed for high performance, premium aesthetics, and easy management.

---

## 🚀 Quick Start (Local Setup)

To run this website on your own computer:

1. **Install Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/).
2. **Open Terminal/Command Prompt**: Navigate to the project folder (`carpet`).
3. **Install Dependencies**: Run the following command:
   ```bash
   npm install
   ```
4. **Start the Server**: Run the following command:
   ```bash
   node server.js
   ```
5. **View the Website**: Open your browser and go to `http://localhost:3000`.

---

## 🖼️ How to Manage Carpets (Admin Guide)

You do **not** need to touch any code to add, edit, or remove carpets from the website. There is a built-in admin dashboard.

1. Go to **`http://localhost:3000/admin`** (or click "Admin Login" in the website footer).
2. To add a new carpet:
   - Enter the name, category, material, origin, and description.
   - For the **Image URL**, simply paste a direct link to an image.
   - *Tip: If you don't have a web host for images, you can upload your carpet photos to a free service like Imgur or Google Drive, and paste the direct image link here.*
3. Click **"Save Carpet"**. The new carpet will instantly appear on the "Home" and "Collections" pages.
4. To remove a carpet, click the red **"Delete"** button next to it in the catalog list.

---

## 📁 Project Structure

This project uses a flat, easy-to-understand structure:

- **`server.js`**: The core backend file that handles routing and data saving.
- **`data/carpets.json`**: This is where your carpet catalog is saved. The Admin panel updates this file automatically.
- **`public/`**: Contains all static files sent to the user's browser.
  - **`css/style.css`**: All the luxury styling, colors, and fonts.
  - **`js/main.js`**: Controls the scroll animations, mobile menu, and product filtering.
- **`views/`**: Contains the HTML templates for the pages.
  - **`partials/`**: Reusable header (navbar) and footer.
  - **`index.ejs`**: The Homepage.
  - **`about.ejs`**: The Heritage page.
  - **`products.ejs`**: The Collections page.
  - **`craftsmanship.ejs`**: The Craftsmanship page.
  - **`contact.ejs`**: The Contact page.
  - **`admin.ejs`**: The Admin Dashboard.

---

## 🌍 How to Deploy to Production

Since this is a standard Node.js/Express app, it can be deployed almost anywhere for free or very cheap.

### Option A: Railway or Render (Recommended)
1. Push this entire folder to a **GitHub repository**.
2. Create an account on [Railway.app](https://railway.app/) or [Render.com](https://render.com/).
3. Connect your GitHub account and select the repository.
4. Set the build command to `npm install` and the start command to `node server.js`.
5. The platform will automatically build and host the website, and provide you with a live URL.

### Option B: VPS (DigitalOcean, AWS, Linode)
If you have a Linux server:
1. Upload the files.
2. Install Node.js on the server.
3. Install `pm2` globally (`npm install -g pm2`).
4. Run the app in the background: `pm2 start server.js --name tajmahal`.
5. Set up Nginx as a reverse proxy to forward traffic from port 80/443 to your app on port 3000.

---

## 🎨 Changing Colors or Fonts

If you ever need to tweak the design, all the main variables are located at the very top of `public/css/style.css`.

```css
:root {
    --color-dark: #111111;
    --color-gold: #c9a84c;
    /* Change these hex codes to update the whole site globally */
}
```

---

*For further technical assistance, please consult a web developer or check the Express.js documentation.*
