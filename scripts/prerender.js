#!/usr/bin/env node
/**
 * CalqWise Prerenderer
 * ────────────────────
 * 1. Builds the Vite app (optional — run `vite build` first if you prefer)
 * 2. Starts `vite preview` on a random port
 * 3. Uses Puppeteer (headless Chrome) to visit every SEO-critical route
 * 4. Saves the fully-rendered HTML to dist/<route>/index.html
 * 5. Cloudflare Workers serves those files directly → Google reads full HTML
 *
 * Usage:
 *   npm run prerender          (assumes dist/ already built)
 *   npm run build:seo          (builds + prerenders in one command)
 */

import puppeteer from 'puppeteer'
import { createServer } from 'http'
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = join(ROOT, 'dist')

// ─── Routes to prerender ──────────────────────────────────────────────────────
// Priority: SEO sub-pages first (most impactful), then main calc pages

const { seoPages } = await import('../src/data/seoPages.js')

// ─── Title lookup map ─────────────────────────────────────────────────────────
// react-helmet-async cannot update document.title in headless Chrome.
// We build an exact title for every route we prerender, then inject it.

const calcTitles = {
  mortgage: {
    us: 'Mortgage Calculator US — Monthly Payment, PMI & Amortization | CalqWise',
    ca: 'Canada Mortgage Calculator — Monthly Payment & CMHC Insurance | CalqWise',
    uk: 'UK Mortgage Calculator — Monthly Repayment & Stamp Duty | CalqWise',
    au: 'Australia Mortgage Calculator — Repayment, LMI & Schedule | CalqWise',
    ie: 'Ireland Mortgage Calculator — Monthly Repayment 2026 | CalqWise',
    nz: 'NZ Mortgage Calculator — Fortnightly & Monthly Repayment | CalqWise',
  },
  tax: {
    us: 'US Income Tax Calculator 2026 — Federal + All 50 States | CalqWise',
    ca: 'Canada Income Tax Calculator 2026 — Federal + All Provinces | CalqWise',
    uk: 'UK Income Tax Calculator 2026/27 — PAYE, NI & Take-Home | CalqWise',
    au: 'Australia Income Tax Calculator 2025/26 — ATO Rates + Medicare | CalqWise',
    ie: 'Ireland Income Tax Calculator 2026 — USC, PRSI & Take-Home | CalqWise',
    nz: 'New Zealand Income Tax Calculator 2025/26 — PAYE & ACC Levy | CalqWise',
  },
  salary: {
    us: 'US Salary Calculator 2026 — Gross to Net, Hourly & Annual | CalqWise',
    ca: 'Canada Salary Calculator 2026 — Take-Home Pay, CPP & EI | CalqWise',
    uk: 'UK Salary Calculator 2026/27 — Gross to Net, NI & Tax | CalqWise',
    au: 'Australia Salary Calculator 2025/26 — Take-Home & Super | CalqWise',
    ie: 'Ireland Salary Calculator 2026 — Take-Home, USC & PRSI | CalqWise',
    nz: 'NZ Salary Calculator 2025/26 — Take-Home & KiwiSaver | CalqWise',
  },
  autoloan: {
    us: 'Auto Loan Calculator US 2026 — Monthly Payment & Total Interest | CalqWise',
    ca: 'Auto Loan Calculator Canada 2026 — Payment & Total Cost | CalqWise',
    uk: 'Car Loan Calculator UK 2026 — Monthly Payment & APR | CalqWise',
    au: 'Car Loan Calculator Australia 2026 — Monthly Payment | CalqWise',
  },
  rideprofit: {
    us: 'RideProfit Calculator US — True Uber & Lyft Earnings After Tax | CalqWise',
    ca: 'RideProfit Calculator Canada — True Uber Earnings After Tax & CPP | CalqWise',
    uk: 'RideProfit Calculator UK — True Uber Earnings After Tax | CalqWise',
    au: 'RideProfit Calculator Australia — True Rideshare Earnings | CalqWise',
  },
  affordability: {
    us: 'How Much House Can I Afford — US Affordability Calculator | CalqWise',
    ca: 'How Much Can I Borrow Canada — Mortgage Affordability | CalqWise',
    uk: 'How Much Can I Borrow UK — Mortgage Affordability Calculator | CalqWise',
    au: 'Australia Mortgage Affordability Calculator — Borrowing Power | CalqWise',
  },
  'rent-vs-buy': {
    us: 'Rent vs Buy Calculator US — True Cost Comparison | CalqWise',
    ca: 'Rent vs Buy Calculator Canada — True Cost Comparison | CalqWise',
    uk: 'Rent vs Buy Calculator UK — True Cost Comparison | CalqWise',
  },
  'loan-payoff': {
    us: 'Loan Payoff Calculator — Early Payoff & Interest Savings | CalqWise',
    ca: 'Loan Payoff Calculator Canada — Early Payoff & Interest Savings | CalqWise',
  },
  'stamp-duty': { uk: 'Stamp Duty Calculator UK 2026 — SDLT + First-Time Buyer Relief | CalqWise' },
}

const hubTitles = {
  us: 'United States Financial Calculators 2026 | CalqWise',
  ca: 'Canada Financial Calculators 2026 | CalqWise',
  uk: 'United Kingdom Financial Calculators 2026 | CalqWise',
  au: 'Australia Financial Calculators 2026 | CalqWise',
  ie: 'Ireland Financial Calculators 2026 | CalqWise',
  nz: 'New Zealand Financial Calculators 2026 | CalqWise',
}

// SEO sub-page titles from seoPages data
const seoTitleMap = Object.fromEntries(
  seoPages.map(p => [`/${p.country}/${p.calc}/${p.slug}`, `${p.title} | CalqWise`])
)

function getTitleForRoute(route) {
  // SEO sub-pages
  if (seoTitleMap[route]) return seoTitleMap[route]
  // Country hubs
  const hubMatch = route.match(/^\/([a-z]{2})$/)
  if (hubMatch && hubTitles[hubMatch[1]]) return hubTitles[hubMatch[1]]
  // Calc pages
  const calcMatch = route.match(/^\/([a-z]{2})\/([a-z-]+)$/)
  if (calcMatch) {
    const [, country, calc] = calcMatch
    return calcTitles[calc]?.[country] ?? null
  }
  return null
}

const SEO_ROUTES = seoPages.map(p => `/${p.country}/${p.calc}/${p.slug}`)

const CALC_ROUTES = [
  // Country hubs
  '/us', '/ca', '/uk', '/au', '/ie', '/nz',
  // US
  '/us/mortgage', '/us/tax', '/us/salary', '/us/autoloan', '/us/rideprofit',
  '/us/affordability', '/us/rent-vs-buy', '/us/loan-payoff',
  // CA
  '/ca/mortgage', '/ca/tax', '/ca/salary', '/ca/autoloan', '/ca/rideprofit',
  '/ca/affordability', '/ca/rent-vs-buy',
  // UK
  '/uk/mortgage', '/uk/tax', '/uk/salary', '/uk/autoloan',
  '/uk/affordability', '/uk/stamp-duty',
  // AU
  '/au/mortgage', '/au/tax', '/au/salary',
  // IE
  '/ie/mortgage', '/ie/tax', '/ie/salary',
  // NZ
  '/nz/mortgage', '/nz/tax', '/nz/salary',
  // Static
  '/about', '/contact', '/embed',
]

const ALL_ROUTES = [...SEO_ROUTES, ...CALC_ROUTES]

// ─── Local file server (serves dist/ as SPA) ──────────────────────────────────
function startServer() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      let urlPath = req.url.split('?')[0]
      if (urlPath === '/') urlPath = '/index.html'

      // Try exact file first, then index.html inside directory, then SPA fallback
      const candidates = [
        join(DIST, urlPath),
        join(DIST, urlPath, 'index.html'),
        join(DIST, 'index.html'), // SPA fallback
      ]

      for (const candidate of candidates) {
        if (existsSync(candidate) && !candidate.endsWith('/')) {
          try {
            const content = readFileSync(candidate)
            const ext = candidate.split('.').pop()
            const mime = {
              html: 'text/html', js: 'application/javascript',
              css: 'text/css', svg: 'image/svg+xml',
              json: 'application/json', png: 'image/png',
              ico: 'image/x-icon', webp: 'image/webp',
            }[ext] || 'application/octet-stream'
            res.writeHead(200, { 'Content-Type': mime })
            res.end(content)
            return
          } catch { continue }
        }
      }

      // Final fallback: index.html
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(readFileSync(join(DIST, 'index.html')))
    })

    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port })
    })
    server.on('error', reject)
  })
}

// ─── Dedup head meta tags ─────────────────────────────────────────────────────
// react-helmet-async appends new tags rather than replacing — so the prerendered
// HTML has both the base index.html tags AND the per-page tags. We keep the last
// occurrence of each (the react-helmet one) and remove the earlier duplicates.
function deduplicateHead(html) {
  // Extract <head>...</head>
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/)
  if (!headMatch) return html

  let head = headMatch[1]

  // Deduplicate <title>
  const titles = [...head.matchAll(/<title>[^<]*<\/title>/g)]
  if (titles.length > 1) {
    for (let i = 0; i < titles.length - 1; i++) {
      head = head.replace(titles[i][0], '')
    }
  }

  // Deduplicate <meta name="..."> — keep last per name
  const metaNames = [...head.matchAll(/<meta\s+name="([^"]+)"[^>]*>/gi)]
  const seenName = new Map()
  for (const m of metaNames) {
    const name = m[1].toLowerCase()
    if (seenName.has(name)) {
      // Remove the earlier occurrence
      head = head.replace(seenName.get(name), '')
    }
    seenName.set(name, m[0])
  }

  // Deduplicate <meta property="og:..."> — keep last per property
  const metaProps = [...head.matchAll(/<meta\s+property="([^"]+)"[^>]*>/gi)]
  const seenProp = new Map()
  for (const m of metaProps) {
    const prop = m[1].toLowerCase()
    if (seenProp.has(prop)) {
      head = head.replace(seenProp.get(prop), '')
    }
    seenProp.set(prop, m[0])
  }

  // Deduplicate <link rel="canonical"> — keep last
  const canonicals = [...head.matchAll(/<link\s+rel="canonical"[^>]*>/gi)]
  if (canonicals.length > 1) {
    for (let i = 0; i < canonicals.length - 1; i++) {
      head = head.replace(canonicals[i][0], '')
    }
  }

  return html.replace(headMatch[1], head)
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!existsSync(DIST)) {
    console.error('❌  dist/ not found. Run `vite build` first.')
    process.exit(1)
  }

  console.log('🚀  Starting local server…')
  const { server, port } = await startServer()
  const BASE = `http://127.0.0.1:${port}`
  console.log(`    Serving dist/ on ${BASE}`)

  console.log('🌐  Launching headless Chrome…')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })

  // Suppress console noise from the app
  page.on('console', () => {})
  page.on('pageerror', () => {})

  let success = 0
  let failed = 0

  for (const route of ALL_ROUTES) {
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 30000 })

      // Wait for React root to render
      await page.waitForSelector('#root > *', { timeout: 10000 }).catch(() => {})

      // Wait for react-helmet-async to update og:title (runs via useEffect after paint)
      const defaultTitle = 'CalqWise - Free Financial Calculators for Mortgage, Tax, Salary 2026'
      await page.waitForFunction(
        (def) => {
          const og = document.querySelector('meta[property="og:title"]')
          return og && og.getAttribute('content') !== def
        },
        { timeout: 5000 },
        defaultTitle
      ).catch(() => {})

      // Extra settle time
      await new Promise(r => setTimeout(r, 200))

      const rawHtml = await page.content()

      // Deduplicate first, then inject correct title last (so dedup can't overwrite it)
      let html = deduplicateHead(rawHtml)

      // react-helmet-async cannot update document.title in headless Chrome.
      // Use our pre-computed title map instead — applied AFTER dedup.
      const correctTitle = getTitleForRoute(route)
      if (correctTitle) {
        html = html.replace(/<title>[^<]*<\/title>/, `<title>${correctTitle}</title>`)
      }

      // Write to dist/<route>/index.html
      const outDir = join(DIST, route)
      mkdirSync(outDir, { recursive: true })
      writeFileSync(join(outDir, 'index.html'), html, 'utf-8')

      console.log(`  ✓  ${route}`)
      success++
    } catch (err) {
      console.warn(`  ✗  ${route}  — ${err.message.slice(0, 80)}`)
      failed++
    }
  }

  await browser.close()
  server.close()

  console.log(`\n✅  Prerender complete: ${success} pages saved, ${failed} failed`)
  console.log(`    Total dist size includes ${success} prerendered HTML files`)
  console.log(`    Deploy dist/ to Cloudflare — Google will read full HTML instantly`)

  if (failed > 0) process.exit(1)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
