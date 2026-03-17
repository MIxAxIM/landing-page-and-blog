---
name: seo-setup
description: Set up comprehensive SEO for Next.js client websites. Use this when starting a new client project or updating an existing site's SEO. Implements sitemap, robots.txt, metadata with keywords, Open Graph tags, Twitter card, canonical/hreflang tags for dual-language sites, and generates post-deployment checklist.
trigger: <seo-setup>
---

# SEO Setup Skill

**Invoke this skill:** Use `<seo-setup>` when setting up SEO for client websites

**File location:** `@technical/skills/seo-setup/SKILL.md`

Automates comprehensive SEO implementation for client websites. Saves 30-45 minutes per project.

## When to Use

- Starting a new client project (during technical setup phase)
- Updating existing client site's SEO
- Client requests improved search visibility
- Before deploying to production

## Prerequisites

Gather this information before starting:

- Client domain (e.g., `www.andamio.com`)
- Business name
- Business type/industry
- Location (city, region, country)
- Primary services (2-5 key services)
- Language setup (single EN or dual EN/FR)
- Site structure (single-page or multi-page with page list)
- OG image available? (1200x630px, ideally in `/public`) — if not, note it as a TODO
- Any private/admin routes to block from crawlers (e.g. `/admin`)

## Implementation Steps

### 1. Gather Client Information

Ask user for all prerequisites above. Use AskUserQuestion for structured input.

### 2. Generate Keywords

Based on business type, suggest keywords:

**Tradesmen** (carpet fitter, electrician, plumber):
- `[service] [city]`
- `professional [service] [city]`
- `[service] [region]`
- `best [service] [city]`
- `[service] near me`

**Professional Services** (photographer, accountant):
- `[profession] [city]`
- `professional [service] [city]`
- `[specialty] [profession]`
- `[service] [city] reviews`

**Restaurants/Hospitality**:
- `restaurant [city]`
- `[cuisine] [city]`
- `best [cuisine] restaurant [city]`
- `[neighborhood] restaurant`

**French keywords**: Translate primary keywords for dual-language sites.

Present suggestions and ask user to confirm/modify.

### 3. Create Sitemap

**File:** `app/sitemap.js` (or `src/app/sitemap.js` depending on project structure)

**Single-page, single-language:**
```javascript
export default function sitemap() {
  const baseUrl = 'https://[CLIENT_DOMAIN]'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
```

**Single-page, dual-language:**
```javascript
export default function sitemap() {
  const baseUrl = 'https://[CLIENT_DOMAIN]'

  return [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/fr`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
```

**Multi-page:** Add entries for each page with appropriate priority (0.8 for main pages, 0.7 for contact).

### 4. Create Robots.txt

**File:** `public/robots.txt`

Always disallow private/admin routes. Common routes to block: `/admin`, `/api`, `/dashboard`.

```txt
# Allow all search engines
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

# Sitemap location
Sitemap: https://[CLIENT_DOMAIN]/sitemap.xml
```

Only include `Disallow` lines that are relevant to the project.

### 5. Update Layout Metadata

**IMPORTANT:** Always include `metadataBase` — without it, Next.js cannot resolve absolute URLs for OG images and canonical tags.

**Single-language sites** - Use static metadata:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://[CLIENT_DOMAIN]'),
  title: '[BUSINESS_TYPE] [LOCATION] | [PRIMARY_SERVICE] | [BUSINESS_NAME]',
  description: '[150-160 char description with keywords, benefits, call-to-action]',
  keywords: [
    '[keyword1]', '[keyword2]', '[keyword3]', '[keyword4]',
    '[keyword5]', '[keyword6]', '[keyword7]', '[keyword8]',
  ],
  authors: [{ name: '[BUSINESS_NAME]' }],
  alternates: {
    canonical: 'https://[CLIENT_DOMAIN]',
  },
  openGraph: {
    title: '[BUSINESS_NAME] - [PRIMARY_SERVICE]',
    description: '[Brief description ~100 chars]',
    url: 'https://[CLIENT_DOMAIN]',
    siteName: '[BUSINESS_NAME]',
    locale: 'en_GB', // or 'en_US', 'fr_FR' etc
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // 1200x630px, place in /public
        width: 1200,
        height: 630,
        alt: '[BUSINESS_NAME] - [PRIMARY_SERVICE]',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '[BUSINESS_NAME] - [PRIMARY_SERVICE]',
    description: '[Brief description ~100 chars]',
    images: ['/og-image.jpg'],
  },
};
```

**Dual-language sites** - Use generateMetadata function:

```typescript
export async function generateMetadata({ params }) {
  const { locale } = await params
  const baseUrl = 'https://[CLIENT_DOMAIN]'

  return {
    metadataBase: new URL(baseUrl),
    title: '[BUSINESS_TYPE] [LOCATION] | [PRIMARY_SERVICE] | [BUSINESS_NAME]',
    description: '[150-160 char description]',
    keywords: [
      // English keywords
      '[keyword1]', '[keyword2]', '[keyword3]',
      // French keywords
      '[mot-clé1]', '[mot-clé2]', '[mot-clé3]',
    ],
    authors: [{ name: '[BUSINESS_NAME]' }],

    // Canonical and hreflang
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
      },
    },

    openGraph: {
      title: '[BUSINESS_NAME] - [PRIMARY_SERVICE]',
      description: '[Brief description ~100 chars]',
      url: `${baseUrl}/${locale}`,
      siteName: '[BUSINESS_NAME]',
      locale: locale === 'en' ? 'en_GB' : 'fr_FR',
      type: 'website',
      images: [
        {
          url: '/og-image.jpg', // 1200x630px, place in /public
          width: 1200,
          height: 630,
          alt: '[BUSINESS_NAME] - [PRIMARY_SERVICE]',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: '[BUSINESS_NAME] - [PRIMARY_SERVICE]',
      description: '[Brief description ~100 chars]',
      images: ['/og-image.jpg'],
    },
  }
}
```

**Title formula:** `[Business Type] [Location] | [Service] | [Business Name]`

**Description formula:** Service description + location + benefits + CTA (150-160 chars total)

**OG image notes:**
- Ideal size: 1200x630px
- Place in `/public/og-image.jpg`
- For photographers/visual businesses: use a strong hero/portfolio image
- If no image available yet, add as a TODO and leave the `images` array out for now

### 6. Add JSON-LD Structured Data (REQUIRED)

Add a `<script type="application/ld+json">` tag in the layout `<body>`.

**Choose the right schema @type:**
- Tradesman → `HomeAndConstructionBusiness`
- Restaurant → `Restaurant`
- Photographer → `Photographer`
- Professional service → `ProfessionalService`
- Shop → `Store`
- Health/Wellness → `HealthAndBeautyBusiness`
- Beauty salon → `BeautySalon`

**Must include:**
- `name`, `description`, `url`
- `address` with locality, region, country
- `areaServed` (where they operate)
- `hasOfferCatalog` with their services listed
- `sameAs` with social media links
- `telephone` and/or `email`
- `priceRange`

**For photographers/galleries:** Consider also adding an `ImageGallery` schema alongside the `Photographer` schema to describe the portfolio sections.

**For dual-language sites:** Use the `locale` variable to set description in the correct language.

**Full examples and templates:** See `technical/guides/SEO_SETUP_GUIDE.md` Section 5.

**After deployment, validate at:** https://search.google.com/test/rich-results

### 7. AI Search Optimization (AEO/GEO)

Traditional SEO targets Google. AI search optimization targets tools like ChatGPT, Perplexity, Google AI Overviews, Claude, and Bing Copilot. These crawl and cite sites differently — structured facts and clear prose matter more than keyword density.

#### 7a. Create llms.txt

`llms.txt` is an emerging standard (like `robots.txt` for LLMs) — a plain-text file that gives AI models a clean, structured summary of the business. Place it at `public/llms.txt` so it's served at `https://[CLIENT_DOMAIN]/llms.txt`.

**Format:**
```txt
# [BUSINESS_NAME]

> [One-sentence description of who they are and what they do]

## Services

- **[Service 1]**: [Clear description, price if applicable]
- **[Service 2]**: [Clear description, price if applicable]
- **[Service 3]**: [Clear description]

## Location & Service Areas

Based in [Town], [Region], [Country]. Serving:
- [Country/Region 1]: [towns/areas]
- [Country/Region 2]: [towns/areas]

## Contact

- Email: [email]
- Website: https://[CLIENT_DOMAIN]
- [Social links]

## Key Facts

- [Relevant business fact, e.g. registration number, languages, payment terms]
- [Unique selling point]
- [Timeline / process fact]
```

**Tips:**
- Write for a model reading it cold — be explicit, not clever
- Include prices, timelines, areas served — facts AI gets asked about
- Keep it under ~500 words for fast parsing
- No HTML, no Markdown headings beyond `#` — plain prose

#### 7b. Update robots.txt for AI Crawlers

The current `User-agent: *` already allows AI bots, but adding explicit entries signals intent and ensures future-proofing as AI crawlers evolve.

Add below the existing rules in `public/robots.txt`:

```txt
# AI Search Crawlers (allow for AI search visibility)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

# LLM context file
LLMs: https://[CLIENT_DOMAIN]/llms.txt
```

**Note:** If the client does NOT want their content used to train AI models, replace `Allow: /` with `Disallow: /` for the relevant bots (especially `GPTBot` for OpenAI training). The distinction is: *crawling for AI answers* (Perplexity, Google AI Overviews) vs *training data* (GPTBot). For most small businesses wanting discoverability, allow all.

#### 7c. Add FAQ Schema (JSON-LD)

FAQ schema is heavily used by AI overviews to pull direct answers. Add a second `<script type="application/ld+json">` tag in the layout `<body>` alongside the existing business schema.

**Choose 4-6 questions that customers actually ask:**

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "[Question 1?]",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "[Clear, complete answer in 1-3 sentences]"
          }
        },
        {
          "@type": "Question",
          "name": "[Question 2?]",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "[Clear, complete answer in 1-3 sentences]"
          }
        }
      ]
    })
  }}
/>
```

**Good FAQ topics by business type:**
- Tradesman: What does [service] cost? How long does it take? Do you cover [area]? Are you insured?
- Web designer: What's included? How long to build? Do I own my site? Are there monthly fees?
- Restaurant: Do you take reservations? Do you have vegetarian options? What are your hours?
- Photographer: How many photos? How long for delivery? Do you travel?

**Validate at:** https://search.google.com/test/rich-results (FAQPage should appear)

### 8. Verify next-intl Config (Dual-Language Only)

Check these files exist and are correct:

**`i18n/request.js`:**
```javascript
import { notFound } from "next/navigation";
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'fr'];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;
  if (!locale || !locales.includes(locale)) notFound();
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

**`next.config.mjs`:**
```javascript
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n/request.js');
export default withNextIntl(nextConfig);
```

Update if incorrect.

### 9. Validation

Before completing, verify:

- [ ] Sitemap file created with correct domain
- [ ] Robots.txt created with correct sitemap URL
- [ ] Robots.txt disallows all private/admin routes
- [ ] `metadataBase` set in layout metadata
- [ ] Title is 50-60 characters
- [ ] Description is 150-160 characters
- [ ] Keywords array has 10-20 entries
- [ ] Authors metadata present
- [ ] `alternates.canonical` set (all sites, not just dual-language)
- [ ] Open Graph tags present with `images` array (1200x630)
- [ ] Twitter card metadata present
- [ ] JSON-LD structured data added with correct @type for business
- [ ] JSON-LD includes services, address, area served
- [ ] Hreflang tags present (dual-language only)
- [ ] i18n config correct (dual-language only)
- [ ] `llms.txt` created at `/public/llms.txt` with business summary
- [ ] robots.txt includes explicit AI crawler entries (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- [ ] robots.txt references `llms.txt` via `LLMs:` directive
- [ ] FAQPage JSON-LD added with 4-6 relevant questions
- [ ] FAQ schema validated at Rich Results Test

### 10. Generate Post-Deployment Checklist

Output this checklist for user:

```markdown
# SEO Post-Deployment - [CLIENT_NAME]

**Domain:** https://[CLIENT_DOMAIN]
**Deployed:** [DATE]

## Day 1
- [ ] Verify sitemap: https://[CLIENT_DOMAIN]/sitemap.xml
- [ ] Verify robots.txt: https://[CLIENT_DOMAIN]/robots.txt
- [ ] Check /admin is blocked: https://[CLIENT_DOMAIN]/robots.txt should show Disallow: /admin
- [ ] Verify llms.txt: https://[CLIENT_DOMAIN]/llms.txt
- [ ] Test OG image: paste URL into https://developers.facebook.com/tools/debug/
- [ ] Test Twitter card: paste URL into https://cards-dev.twitter.com/validator
- [ ] Validate FAQ schema: https://search.google.com/test/rich-results
- [ ] Google Search Console:
  - [ ] Add property
  - [ ] Verify ownership (HTML tag)
  - [ ] Submit sitemap
  - [ ] Request indexing

## Week 1
- [ ] Check indexing status
- [ ] Test: search "site:[CLIENT_DOMAIN]"
- [ ] Set up Google Business Profile (if local)

## Ongoing
- [ ] Monitor Search Console monthly
- [ ] Track rankings for: [list keywords]
```

## Success Output

```
✓ SEO Setup Complete - [CLIENT_NAME]

Files Created/Updated:
- app/sitemap.js
- public/robots.txt
- app/layout.tsx

Components Implemented:
✓ Sitemap generation
✓ Robots.txt (with admin/private routes blocked)
✓ metadataBase
✓ Meta title & description
✓ Keywords ([X] total)
✓ Canonical URL
✓ Open Graph tags (with OG image)
✓ Twitter card
✓ JSON-LD structured data (@type: [BusinessType])
✓ FAQPage schema ([X] questions)
✓ llms.txt (AI search context file)
✓ AI crawler rules (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
[✓ Hreflang (dual-language)]

Primary Keywords: [list top 5]

Next: Deploy, then follow post-deployment checklist
Time to indexing: 24-48 hours
```

## Troubleshooting

**Sitemap not at /sitemap.xml:**
- Verify file at `app/sitemap.js` (not src/app for App Router)
- Clear cache: `rm -rf .next && npm run build`

**OG image not showing when link shared:**
- Check `metadataBase` is set in layout metadata
- Verify image exists at `/public/og-image.jpg`
- Clear Facebook/LinkedIn cache using their debugger tools

**Duplicate content (dual-language):**
- Use `generateMetadata()` function, not static metadata
- Verify canonical and hreflang tags

**Pages not indexing:**
- Check robots.txt allows crawling
- Submit sitemap in Search Console
- Use URL Inspection to request indexing



**Version:** 1.1
**Updated:** March 2026
**Time:** 10-15 minutes with client info ready
