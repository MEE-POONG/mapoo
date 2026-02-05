# SiamSausage - Wholesale E-Commerce (Next.js Version)

This is a **Next.js 14** implementation of the SiamSausage wholesale platform design.
It utilizes **Tailwind CSS** for styling and **React** components.

## 📂 Project Structure

- `src/app/page.tsx` - Homepage.
- `src/app/products/page.tsx` - Product Listing page.
- `src/components/` - Reusable UI components (Navbar, Footer).
- `src/app/globals.css` - Global styles and custom colors.
- `tailwind.config.ts` - Theme configuration (colors, fonts).

## 🚀 Getting Started

Since this is a fresh Next.js project scaffolded manually, you need to install dependencies first.

1. **Install Dependencies**
   Open your terminal in this directory and run:
   ```bash
   npm install
   ```
   *Note: This will install Next.js, React, Tailwind CSS, and Lucide Icons.*

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the site.

## 🎨 Design Notes

- **Font**: Google Fonts 'Prompt' is automatically loaded via `next/font`.
- **Icons**: Using `lucide-react` for modern, clean SVG icons.
- **Images**: Using Unsplash placeholders (configured in `next.config.js`).

## 🗄️ Database

See `docs/database_schema.md` (if available in backup) for the planned database structure.
