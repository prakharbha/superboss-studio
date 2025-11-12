# SuperBoss Film Production & Studio Website

A modern, elegant Next.js website for SuperBoss Film Production & Studio in Dubai.

## Features

- **6 Studio Pages**: Individual pages for Boss Unit, Boss Frame, Boss Cell, Super Cell, Super Frame, and Boss Arena
- **Equipment Rental**: Searchable catalog with 20+ professional equipment items
- **Props Rental**: Extensive collection of 25+ props with filtering by category and style
- **Multi-Step Booking System**: Easy-to-use booking flow for studios, equipment, and props
- **WhatsApp Integration**: Auto-popup chatbot for instant customer support
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **SEO Optimized**: Comprehensive meta tags, structured data, and sitemap
- **Smooth Animations**: Subtle Framer Motion animations throughout
- **Contact Form**: Integrated contact page with map location

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Icons**: Lucide React

## Design System

- **Colors**: 
  - White (#FFFFFF) - 60%
  - Grey (#E5E5E5, #9CA3AF) - 20%
  - Black (#000000) - 20%
- **Typography**: Inter font family
- **Spacing**: Generous whitespace for breathing room

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
superboss/
├── app/                    # Next.js app directory
│   ├── book/              # Booking page
│   ├── contact/           # Contact page
│   ├── equipment/         # Equipment listing
│   ├── props/             # Props listing
│   ├── rules/             # Studio rules
│   ├── studios/           # Studios pages
│   │   └── [slug]/       # Dynamic studio pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── sitemap.ts         # Sitemap generator
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── Navigation.tsx     # Header navigation
│   ├── Footer.tsx         # Footer
│   ├── WhatsAppChat.tsx   # WhatsApp chatbot
│   ├── AnimatedSection.tsx # Animation wrapper
│   └── StructuredData.tsx # SEO structured data
├── data/                  # JSON data files
│   ├── studios.json       # Studio information
│   ├── equipment.json     # Equipment catalog
│   ├── props.json         # Props inventory
│   └── seo.json          # SEO metadata
├── lib/                   # Utility functions
│   └── utils.ts
└── public/               # Static assets
    ├── logo-black.png    # Black logo
    ├── logo-white.png    # White logo
    └── images/           # Image directories

```

## Data Management

All content is managed through JSON files in the `/data` directory:

- **studios.json**: Update studio details, pricing, and features
- **equipment.json**: Add/edit equipment items and pricing
- **props.json**: Manage props inventory
- **seo.json**: Configure SEO metadata for all pages

## Customization

### Update Contact Information

Edit the following files:
- `/data/seo.json` - Update phone, email, address
- `/components/Footer.tsx` - Update footer contact details
- `/components/WhatsAppChat.tsx` - Update WhatsApp number

### Update Prices

Edit the respective JSON files:
- Studios: `/data/studios.json`
- Equipment: `/data/equipment.json`
- Props: `/data/props.json`

### Add Images

Replace placeholder images in `/public/images/`:
- Studios: `/public/images/studios/`
- Equipment: `/public/images/equipment/`
- Props: `/public/images/props/`

## SEO Features

- ✅ Meta tags for all pages
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data (LocalBusiness schema)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Semantic HTML
- ✅ Image optimization with next/image

## Performance

- Server-side rendering (SSR)
- Static site generation (SSG) for studio pages
- Image optimization
- Code splitting
- Lazy loading
- Optimized fonts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Deployment

This project can be deployed on:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any Node.js hosting

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Contact

SuperBoss Film Production & Studio
- **Address**: Umm Ramool, St. 17, Warehouse No. 4, Dubai
- **Phone**: +971 56 156 1570
- **Email**: info@superbossstudio.com
- **Instagram**: [@superbossproduction](https://www.instagram.com/superbossproduction)

## License

© 2024 SuperBoss Film Production & Studio. All rights reserved.
