#!/usr/bin/env node
// Usage: node scripts/generate-sitemap.js
// Generates public/sitemap.xml from route definitions + seoPages data

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Import seo pages (ESM)
const { seoPages } = await import('../src/data/seoPages.js')

const BASE = 'https://calqwise.com'
const TODAY = new Date().toISOString().split('T')[0] + 'T00:00:00Z'

// ─── Static + hub routes ──────────────────────────────────────────────────────
const staticRoutes = [
  { loc: '/',        priority: '1.0', changefreq: 'weekly' },
  { loc: '/us',      priority: '0.9', changefreq: 'weekly' },
  { loc: '/ca',      priority: '0.9', changefreq: 'weekly' },
  { loc: '/uk',      priority: '0.9', changefreq: 'weekly' },
  { loc: '/au',      priority: '0.9', changefreq: 'weekly' },
  { loc: '/ie',      priority: '0.9', changefreq: 'weekly' },
  { loc: '/nz',      priority: '0.9', changefreq: 'weekly' },
  { loc: '/about',   priority: '0.6', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.4', changefreq: 'monthly' },
  { loc: '/embed',   priority: '0.5', changefreq: 'monthly' },
  // Privacy is noindex — omit from sitemap
]

// ─── Calculator routes ────────────────────────────────────────────────────────
const calcRoutes = []
const countries = ['us', 'ca', 'uk', 'au', 'ie', 'nz']

const calcsByCountry = {
  us: ['mortgage','tax','autoloan','salary','rideprofit','rent-vs-buy','loan-payoff','credit-card','heloc','student-loan','property-roi','refinance','affordability','savings','retirement','net-worth','debt-payoff','budget'],
  ca: ['mortgage','tax','autoloan','salary','rideprofit','rent-vs-buy','loan-payoff','credit-card','affordability','property-roi','refinance','savings','retirement','net-worth','debt-payoff','budget'],
  uk: ['mortgage','tax','autoloan','salary','rideprofit','rent-vs-buy','affordability','loan-payoff','credit-card','property-roi','refinance','stamp-duty','savings','retirement','net-worth','debt-payoff','budget'],
  au: ['mortgage','tax','salary','rideprofit','autoloan','rent-vs-buy','loan-payoff','credit-card','affordability','savings','retirement','net-worth','debt-payoff','budget'],
  ie: ['mortgage','tax','salary','rideprofit','autoloan','rent-vs-buy','loan-payoff','credit-card','affordability','savings','retirement','net-worth','debt-payoff','budget'],
  nz: ['mortgage','tax','salary','rideprofit','autoloan','rent-vs-buy','loan-payoff','credit-card','affordability','savings','retirement','net-worth','debt-payoff','budget'],
}

for (const [country, calcs] of Object.entries(calcsByCountry)) {
  for (const calc of calcs) {
    calcRoutes.push({ loc: `/${country}/${calc}`, priority: '0.9', changefreq: 'weekly' })
  }
}

// ─── SEO sub-page routes (from seoPages.js) ───────────────────────────────────
const seoRoutes = seoPages.map(p => ({
  loc: `/${p.country}/${p.calc}/${p.slug}`,
  priority: '0.85',
  changefreq: 'monthly',
}))

// ─── Build XML ────────────────────────────────────────────────────────────────
function urlEntry({ loc, priority, changefreq }) {
  return `  <url>\n    <loc>${BASE}${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Home + Country Hubs -->
${staticRoutes.map(urlEntry).join('\n')}

  <!-- Calculator Pages (${calcRoutes.length}) -->
${calcRoutes.map(urlEntry).join('\n')}

  <!-- SEO Sub-pages (${seoRoutes.length}) -->
${seoRoutes.map(urlEntry).join('\n')}

</urlset>
`

const outPath = resolve(__dirname, '../public/sitemap.xml')
writeFileSync(outPath, xml, 'utf-8')
console.log(`✓ sitemap.xml written — ${staticRoutes.length + calcRoutes.length + seoRoutes.length} URLs`)
