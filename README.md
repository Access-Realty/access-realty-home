# Access Realty - Marketing Site

Marketing website and landing pages for Access Realty, deployed at [access.realty](https://access.realty).

## Overview

This repository contains the public-facing marketing site for Access Realty. It serves as:
- Company homepage and brand presence
- Privacy Policy and Terms of Service
- Future: Paid advertising landing pages for lead capture

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel
- **Database:** Supabase (shared with main app)

## Architecture

This is part of the Access Realty multi-repo platform:
1. **`access-realty-app`** (`app.access.realty`) - Main application for property submissions and management
2. **`access-realty-home`** (`access.realty`) - THIS REPO - Marketing site and landing pages

See `PLATFORM_ARCHITECTURE.md` in the main app repo for complete platform documentation.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
access-realty-home/
├── app/
│   ├── page.tsx           # Homepage
│   ├── privacy/page.tsx   # Privacy Policy
│   ├── terms/page.tsx     # Terms of Service
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── public/                # Static assets
└── README.md
```

## Deployment

Deployed automatically to Vercel on push to `main` branch.

**Production:** https://access.realty
**Vercel Project:** `access-realty-home`

## Environment Variables

See Vercel project settings for environment variables. No environment variables required for basic site functionality.

## Related Repositories

- [access-realty-app](https://github.com/Bmiller4evr/access-realty-app) - Main application
- access-realty-seo (future) - SEO property pages

## Contact

**Access Realty**
5755 Rufe Snow Dr STE 160
North Richland Hills, TX 76180
[https://access.realty](https://access.realty)
