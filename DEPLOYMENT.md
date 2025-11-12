# Deployment Guide

## Pre-Deployment Checklist

### 1. Update Content
- [ ] Replace placeholder images in `/public/images/`
- [ ] Update studio information in `/data/studios.json`
- [ ] Update equipment list in `/data/equipment.json`
- [ ] Update props inventory in `/data/props.json`
- [ ] Verify all prices are in AED
- [ ] Update SEO metadata in `/data/seo.json`

### 2. Update Contact Information
- [ ] WhatsApp number in `/components/WhatsAppChat.tsx`
- [ ] Contact details in `/components/Footer.tsx`
- [ ] Contact page information in `/app/contact/page.tsx`
- [ ] Structured data in `/data/seo.json`

### 3. Configure Domain
- [ ] Update `NEXT_PUBLIC_SITE_URL` in environment variables
- [ ] Update `baseUrl` in `/app/sitemap.ts`
- [ ] Update `metadataBase` in `/app/layout.tsx`

### 4. Add Real Images
Download images from Instagram and organize them:

```
public/
├── images/
│   ├── studios/
│   │   ├── boss-unit-1.jpg
│   │   ├── boss-unit-2.jpg
│   │   ├── boss-unit-3.jpg
│   │   ├── boss-frame-1.jpg
│   │   └── ... (more studio images)
│   ├── equipment/
│   │   ├── led-panel.jpg
│   │   ├── softbox-kit.jpg
│   │   └── ... (equipment images)
│   └── props/
│       ├── leather-chair.jpg
│       ├── white-sofa.jpg
│       └── ... (props images)
```

### 5. Test Everything
- [ ] Test all navigation links
- [ ] Test booking form submission
- [ ] Test contact form submission
- [ ] Test WhatsApp integration
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Check page load speeds
- [ ] Verify SEO tags with tools

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Production Deployment**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Deploy**
```bash
netlify deploy --prod
```

### Option 3: Traditional Hosting

1. **Build the project**
```bash
npm run build
```

2. **Start the server**
```bash
npm start
```

3. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start npm --name "superboss" -- start
pm2 save
pm2 startup
```

## Environment Variables

Set these on your hosting platform:

```
NEXT_PUBLIC_SITE_URL=https://superbossstudio.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+971561561570
NEXT_PUBLIC_CONTACT_EMAIL=info@superbossstudio.com
NEXT_PUBLIC_CONTACT_PHONE=+971561561570
```

## Post-Deployment

### 1. Verify SEO
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify structured data with Google Rich Results Test
- [ ] Check Open Graph tags with Facebook Debugger
- [ ] Test Twitter Cards with Twitter Card Validator

### 2. Set Up Analytics (Optional)
- [ ] Add Google Analytics
- [ ] Set up Google Tag Manager
- [ ] Configure conversion tracking

### 3. Performance Monitoring
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Monitor page load times
- [ ] Set up uptime monitoring

### 4. Social Media
- [ ] Update Instagram bio with website link
- [ ] Create Instagram story highlights
- [ ] Share website launch post

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS or use Netlify DNS

## SSL Certificate

Both Vercel and Netlify provide automatic SSL certificates. For traditional hosting:

1. Use Let's Encrypt (free)
2. Or purchase SSL certificate
3. Configure in your web server (Nginx/Apache)

## Backup Strategy

1. **Code**: Keep repository on GitHub/GitLab
2. **Content**: Backup JSON files regularly
3. **Images**: Keep originals in cloud storage
4. **Database**: If you add a database later, set up automated backups

## Maintenance

### Regular Updates
- Update dependencies monthly: `npm update`
- Check for security vulnerabilities: `npm audit`
- Update content as needed
- Monitor analytics and user feedback

### Content Updates
To update content without redeploying:
1. Edit JSON files in `/data/`
2. Commit and push changes
3. Hosting platform will auto-deploy

## Support

For technical issues:
- Check Next.js documentation: https://nextjs.org/docs
- Vercel support: https://vercel.com/support
- Create issue in repository

For content updates:
- Edit JSON files in `/data/` directory
- Follow the structure of existing entries

