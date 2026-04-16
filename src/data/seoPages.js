// SEO sub-pages: targeted long-tail keyword pages that embed the parent calculator
// Route: /:country/:calc/:slug  →  /ca/mortgage/cmhc-insurance

export const seoPages = [
  // ─── CA Mortgage ───────────────────────────────────────────────────────────
  {
    country: 'ca',
    calc: 'mortgage',
    slug: 'cmhc-insurance',
    title: 'CMHC Mortgage Insurance Calculator Canada 2025',
    h1: 'CMHC Mortgage Insurance Calculator',
    metaDesc: 'Calculate your CMHC mortgage insurance premium instantly. See exactly how much CMHC insurance adds to your mortgage and monthly payment — updated 2025 rates.',
    intro: `If your down payment is less than 20% in Canada, CMHC mortgage loan insurance is mandatory. The premium ranges from 2.80% to 4.00% of your loan amount depending on your loan-to-value ratio — and it's added directly to your mortgage, meaning you pay interest on it over the full amortization period.

For a $600,000 home with a 5% down payment ($30,000), CMHC charges 4.00% on the insured loan of $570,000 — that's $22,800 added to your mortgage balance. At a 5% rate over 25 years, the true cost of that insurance including interest is over $38,000.

Use this calculator to see your exact CMHC premium, how it's added to your balance, your true monthly payment including insurance, and how the premium changes as your down payment increases. Increasing your down payment to 10% drops the CMHC rate from 4.00% to 3.10% — a meaningful saving on large mortgages.`,
    faqs: [
      {
        q: 'When is CMHC insurance required in Canada?',
        a: 'CMHC mortgage loan insurance is required on all mortgages where the down payment is less than 20% of the purchase price. It is mandatory for homes priced up to $1.5 million (as of late 2024). Homes priced above $1.5 million are ineligible for CMHC insurance and therefore require a minimum 20% down payment.',
      },
      {
        q: 'What are the CMHC insurance rates for 2025?',
        a: 'CMHC premiums are based on your loan-to-value (LTV) ratio: 4.00% for LTV 90.01–95%, 3.10% for LTV 85.01–90%, 2.80% for LTV 80.01–85%. The premium is calculated on the total loan amount and added to your mortgage balance. You also pay PST on the premium in some provinces (Ontario, Manitoba, Quebec, Saskatchewan) — this must be paid upfront.',
      },
      {
        q: 'Can I avoid CMHC insurance?',
        a: 'Yes — the only way to avoid CMHC insurance is to have a down payment of 20% or more. Alternatively, some lenders offer conventional (uninsured) mortgages with slightly higher rates. Note that CMHC insurance actually allows you to access better interest rates because lenders face less risk — so the total cost comparison is not always straightforward.',
      },
      {
        q: 'Is CMHC insurance a one-time cost or monthly?',
        a: 'The CMHC premium itself is a one-time charge calculated at closing and added to your mortgage principal. You do not pay it upfront (except PST in applicable provinces). However, because it increases your mortgage balance, you pay mortgage interest on it monthly over your entire amortization period, making the true total cost significantly higher than the headline premium.',
      },
      {
        q: 'Does CMHC insurance protect me as the borrower?',
        a: 'No. Despite the name, CMHC mortgage insurance protects the lender, not you. If you default on your mortgage, CMHC compensates the lender. As the borrower you are still responsible for any shortfall. Separate mortgage life/disability insurance products exist to protect borrowers.',
      },
    ],
    parentCalc: '/ca/mortgage',
    relatedSubPages: [
      { to: '/ca/mortgage/stress-test', label: 'Stress Test Calculator' },
      { to: '/ca/mortgage/first-time-buyer', label: 'First-Time Buyer Guide' },
    ],
    relatedCalcs: [
      { to: '/ca/affordability', label: 'Affordability Calculator' },
      { to: '/ca/rent-vs-buy', label: 'Rent vs Buy' },
    ],
  },

  {
    country: 'ca',
    calc: 'mortgage',
    slug: 'stress-test',
    title: 'Canadian Mortgage Stress Test Calculator 2025',
    h1: 'Canadian Mortgage Stress Test Calculator',
    metaDesc: 'Find out exactly what you qualify for under the OSFI B-20 mortgage stress test. Enter your income and see your maximum mortgage after stress test — 2025 rules.',
    intro: `Canada's mortgage stress test (OSFI Guideline B-20) requires all federally regulated lenders to qualify borrowers at the higher of either the contract rate + 2%, or 5.25% — whichever is greater. As of 2025, with typical 5-year fixed rates around 4.5–5.0%, the qualifying rate is typically 6.5–7.0%.

This means your maximum mortgage is determined not by what you can afford today, but by what you'd afford if rates rise by 2 percentage points. In practice, the stress test reduces your maximum borrowing power by roughly 20–25% compared to qualifying at the contract rate alone.

For example: a household earning $150,000/year might qualify for up to $800,000 at the contract rate, but only $640,000 after the stress test. Use this calculator to enter your gross annual income, existing debts, and current rates to see your exact qualifying amount under B-20 rules.`,
    faqs: [
      {
        q: 'What is the Canadian mortgage stress test rate in 2025?',
        a: 'The qualifying rate is the higher of: your contract interest rate plus 2 percentage points, or the Bank of Canada 5-year benchmark rate (currently 5.25%). So if you negotiate a 4.8% mortgage, you qualify at 6.8%. The stress test applies to all new mortgages, renewals with a new lender, and refinances with federally regulated lenders.',
      },
      {
        q: 'Does the stress test apply to mortgage renewals?',
        a: 'The stress test applies when you switch lenders at renewal (you must re-qualify at the new lender). If you renew with your existing lender without changing terms, you are generally not required to pass the stress test again. However, if you refinance, add a co-borrower, or increase your loan amount, the stress test applies regardless of lender.',
      },
      {
        q: 'What GDS and TDS ratios are used in the stress test?',
        a: 'Lenders use Gross Debt Service (GDS) and Total Debt Service (TDS) ratios. The GDS limit is typically 39% — your housing costs (mortgage P&I + property tax + heat + 50% of condo fees) cannot exceed 39% of gross income. The TDS limit is 44% — total debt payments (housing + all other debts) cannot exceed 44% of gross income. Both are calculated at the stress test qualifying rate.',
      },
      {
        q: 'Does the stress test apply to credit unions and private lenders?',
        a: 'The OSFI B-20 stress test applies only to federally regulated lenders (banks, federal credit unions). Provincial credit unions and private lenders are regulated provincially and may not apply the federal stress test. However, many choose to apply similar standards, and provincial regulators have their own guidelines.',
      },
      {
        q: 'How can I pass the stress test with a lower income?',
        a: 'Strategies include: adding a co-borrower (their income is included in qualifying calculations), paying down existing debts to reduce your TDS ratio, increasing your down payment to reduce the loan amount, or purchasing a lower-priced property. Note that extending amortization does not help with the stress test since qualifying payments are calculated on a 25-year amortization regardless.',
      },
    ],
    parentCalc: '/ca/mortgage',
    relatedSubPages: [
      { to: '/ca/mortgage/cmhc-insurance', label: 'CMHC Insurance Calculator' },
      { to: '/ca/mortgage/first-time-buyer', label: 'First-Time Buyer Guide' },
    ],
    relatedCalcs: [
      { to: '/ca/affordability', label: 'Affordability Calculator' },
      { to: '/ca/salary', label: 'Salary Calculator' },
    ],
  },

  {
    country: 'ca',
    calc: 'mortgage',
    slug: 'first-time-buyer',
    title: 'First-Time Home Buyer Canada — Mortgage Calculator & Programs 2025',
    h1: 'First-Time Home Buyer Mortgage Calculator — Canada',
    metaDesc: 'Calculate your mortgage as a first-time buyer in Canada. Includes FHSA, HBP RRSP, First Home Savings Account, and CMHC insurance — all 2025 federal programs.',
    intro: `Buying your first home in Canada comes with a unique set of programs, incentives, and rules that can save you tens of thousands of dollars — or cost you dearly if you don't use them strategically.

The First Home Savings Account (FHSA) lets you contribute up to $8,000/year (lifetime max $40,000) with a full tax deduction, and withdrawals for a first home purchase are completely tax-free. Combined with the RRSP Home Buyers' Plan (HBP) — which lets you borrow up to $60,000 from your RRSP tax-free — a couple can access up to $100,000 in tax-advantaged funds for their down payment.

First-time buyers also receive: a land transfer tax rebate (up to $4,000 in Ontario, up to $8,000 in BC), the First-Time Home Buyers' Tax Credit ($10,000 federal credit = $1,500 refund), and GST/HST New Housing Rebate if purchasing a new build. Use this calculator to model your total purchasing power including these programs.`,
    faqs: [
      {
        q: 'What is the First Home Savings Account (FHSA) and how does it work?',
        a: 'The FHSA is a registered account for first-time home buyers (those who have not owned a home in the current year or previous 4 calendar years). You can contribute $8,000/year (lifetime max $40,000) and deduct contributions from your taxable income — like an RRSP. Qualifying withdrawals for a first home purchase are 100% tax-free — like a TFSA. Unused room carries forward. You can open an FHSA even before you plan to buy.',
      },
      {
        q: 'Can I use both the FHSA and the RRSP Home Buyers\' Plan together?',
        a: 'Yes. The FHSA and RRSP Home Buyers\' Plan (HBP) can be combined. HBP allows you to withdraw up to $60,000 from your RRSP tax-free (as of 2024; up from $35,000) as long as you repay it over 15 years. A couple can each use $40,000 (FHSA) + $60,000 (HBP) = $200,000 combined in tax-advantaged funds for their down payment — a powerful combination.',
      },
      {
        q: 'What is the minimum down payment for first-time buyers in Canada?',
        a: 'The minimum down payment depends on purchase price: 5% for homes up to $500,000; 5% on the first $500,000 + 10% on the remaining amount for homes between $500,000 and $999,999; 20% for homes $1 million and above ($1.5M as of December 2024 program changes). With less than 20% down, CMHC mortgage insurance is mandatory.',
      },
      {
        q: 'What is the First-Time Home Buyers\' Tax Credit?',
        a: 'The First-Time Home Buyers\' Tax Credit (HBTC) is a non-refundable federal tax credit. You claim $10,000 on your tax return in the year you purchase (or your spouse/partner can, or it can be split). At the 15% federal tax rate, this results in a $1,500 tax reduction. You must be a first-time buyer and the home must be your principal residence.',
      },
      {
        q: 'Do first-time buyers get a land transfer tax rebate?',
        a: 'Land transfer tax rebates for first-time buyers vary by province: Ontario offers up to $4,000 (homes up to $368,000 are fully exempt; partial rebate up to $4,000 for higher-priced homes). Toronto has an additional municipal land transfer tax with a separate first-time buyer rebate of up to $4,475. BC offers up to $8,000 for homes under $835,000. Other provinces have their own rules — use the mortgage calculator with the property tax fields to estimate.',
      },
    ],
    parentCalc: '/ca/mortgage',
    relatedSubPages: [
      { to: '/ca/mortgage/cmhc-insurance', label: 'CMHC Insurance Calculator' },
      { to: '/ca/mortgage/stress-test', label: 'Stress Test Calculator' },
    ],
    relatedCalcs: [
      { to: '/ca/affordability', label: 'Affordability Calculator' },
      { to: '/ca/savings', label: 'Savings Calculator' },
    ],
  },

  // ─── US Mortgage ────────────────────────────────────────────────────────────
  {
    country: 'us',
    calc: 'mortgage',
    slug: 'pmi-calculator',
    title: 'PMI Calculator — Private Mortgage Insurance Cost 2025',
    h1: 'PMI (Private Mortgage Insurance) Calculator',
    metaDesc: 'Calculate your monthly PMI cost and see exactly when it drops off. Find out the true cost of PMI over the life of your loan — plus strategies to avoid or cancel it.',
    intro: `Private Mortgage Insurance (PMI) is required by most U.S. lenders when your down payment is less than 20% of the home's purchase price. The annual PMI cost typically ranges from 0.50% to 1.50% of your loan amount — meaning on a $400,000 loan it costs $2,000–$6,000 per year, or $167–$500 per month added to your payment.

What many buyers don't realize: PMI doesn't last forever. Under the Homeowners Protection Act (HPA), your lender must automatically cancel PMI when your loan balance reaches 78% of the original home value. You can also request cancellation when you reach 80% — but you may need to pay for a new appraisal.

Use this calculator to see your exact PMI cost, how it's factored into your monthly payment, and at what point (date and payment number) your PMI is scheduled to drop off automatically based on your amortization schedule.`,
    faqs: [
      {
        q: 'What is the average PMI rate in 2025?',
        a: 'PMI rates typically range from 0.50% to 1.50% of the loan amount per year, depending on your credit score, down payment percentage, loan type, and lender. Borrowers with excellent credit (760+) and a 15% down payment might pay as little as 0.20–0.30%. Those with lower credit scores and a 5% down payment might pay 1.00–1.50%. Your lender is required to disclose the PMI rate in your Loan Estimate.',
      },
      {
        q: 'How do I get rid of PMI?',
        a: 'You can eliminate PMI through several paths: (1) Reach 80% LTV through regular payments and request cancellation in writing. (2) Your lender must automatically cancel at 78% LTV based on original value. (3) Refinance when you have 20%+ equity — especially if home values have risen. (4) Get a new appraisal showing your LTV is at or below 80% due to appreciation. Note that FHA loans have mortgage insurance for the life of the loan (if down payment < 10%), unlike conventional PMI.',
      },
      {
        q: 'Is PMI tax-deductible?',
        a: 'PMI deductibility has changed over the years and expired for tax years after 2021 under the Tax Cuts and Jobs Act. As of 2025, PMI is not federally tax-deductible for most homeowners. Some states may still allow deductions — check with a tax professional for your state. The mortgage interest deduction (for itemizers) is still available.',
      },
      {
        q: 'What is lender-paid PMI (LPMI)?',
        a: 'With lender-paid PMI, the lender covers the PMI premium in exchange for a higher interest rate on your mortgage. This eliminates the separate monthly PMI line item but increases your rate permanently (unlike borrower-paid PMI which eventually drops off). LPMI can make sense if you plan to sell or refinance within a few years, but borrower-paid PMI is usually better long-term.',
      },
      {
        q: 'What is a piggyback loan and how does it avoid PMI?',
        a: 'An 80-10-10 piggyback loan structure uses a primary 80% mortgage, a 10% second mortgage (HELOC or home equity loan), and a 10% down payment. Because the first mortgage is at exactly 80% LTV, no PMI is required. The second loan typically has a higher rate. This can be cost-effective but adds complexity — use the calculator to compare total costs including second mortgage interest.',
      },
    ],
    parentCalc: '/us/mortgage',
    relatedSubPages: [
      { to: '/us/mortgage/30-year', label: '30-Year vs 15-Year Mortgage' },
    ],
    relatedCalcs: [
      { to: '/us/affordability', label: 'Affordability Calculator' },
      { to: '/us/refinance', label: 'Refinance Calculator' },
    ],
  },

  {
    country: 'us',
    calc: 'mortgage',
    slug: '30-year',
    title: '30-Year Mortgage Calculator USA — Compare 15 vs 30 Year 2025',
    h1: '30-Year Mortgage Calculator — Is It the Right Choice?',
    metaDesc: 'Calculate payments on a 30-year fixed mortgage and compare total interest cost vs a 15-year loan. See exactly how much the longer term costs you — and when it makes sense.',
    intro: `The 30-year fixed-rate mortgage is America's most popular home loan — but it comes with a hidden price tag that most buyers never fully reckon with. While the lower monthly payment is undeniably attractive, the 30-year term means you pay interest for twice as long as a 15-year mortgage, resulting in dramatically more total interest paid.

On a $400,000 mortgage at 7.0%, a 30-year loan costs you $557,000 in total interest — more than the original loan amount. A 15-year loan at 6.5% costs $213,000 in interest — saving you $344,000 but increasing monthly payments by $1,057/month.

The right choice depends on your income stability, investment discipline, and life plans. If you invest the monthly payment difference at market returns, the 30-year can sometimes win. Use this calculator to model both scenarios, including your opportunity cost if you invest the payment difference.`,
    faqs: [
      {
        q: 'What is the current 30-year fixed mortgage rate in 2025?',
        a: '30-year fixed mortgage rates in the US have ranged from 6.5% to 7.5% in early 2025, depending on credit score, down payment, loan size, and lender. The Federal Reserve\'s rate decisions, inflation data, and 10-year Treasury yields are the primary drivers. Check current rates with your lender or mortgage broker as they change daily — this calculator lets you input any rate for an accurate estimate.',
      },
      {
        q: 'Should I choose a 30-year or 15-year mortgage?',
        a: 'A 15-year mortgage saves massive amounts in interest (often $150,000–$350,000 on a typical loan) and builds equity faster, but requires higher monthly payments — typically 30–40% more than a 30-year. A 30-year makes sense if: you need the lower payment flexibility, you plan to invest the difference aggressively (historically stock market returns can exceed mortgage rates), or your income is variable. A 30-year with extra principal payments is a common middle-ground approach.',
      },
      {
        q: 'What is a conforming loan limit in 2025?',
        a: 'For 2025, the conforming loan limit (set by FHFA) is $806,500 for most US counties. High-cost areas (like parts of California, New York, Colorado) have higher limits up to $1,209,750. Loans above these limits are "jumbo" mortgages with typically higher rates and stricter qualification requirements. Conforming loans can be sold to Fannie Mae or Freddie Mac, which is why they often have better rates.',
      },
      {
        q: 'Can I pay off a 30-year mortgage early?',
        a: 'Yes, and it can save enormous amounts of interest. Adding just $200/month extra to principal on a $350,000 30-year loan at 7% can save over $90,000 in interest and pay off the loan 6 years early. Most conventional mortgages have no prepayment penalties. Always specify that extra payments apply to principal (not future payments) when making them.',
      },
      {
        q: 'What does PITI stand for in a mortgage payment?',
        a: 'PITI stands for Principal, Interest, Taxes, and Insurance — the four components typically included in a monthly mortgage payment. Principal reduces your loan balance. Interest is the lender\'s cost. Property taxes are often collected by the lender in escrow and paid to the government. Homeowners insurance (and PMI if applicable) is also often escrowed. Our calculator shows the breakdown of all four components.',
      },
    ],
    parentCalc: '/us/mortgage',
    relatedSubPages: [
      { to: '/us/mortgage/pmi-calculator', label: 'PMI Calculator' },
    ],
    relatedCalcs: [
      { to: '/us/refinance', label: 'Refinance Calculator' },
      { to: '/us/affordability', label: 'Affordability Calculator' },
    ],
  },

  // ─── UK Mortgage ────────────────────────────────────────────────────────────
  {
    country: 'uk',
    calc: 'mortgage',
    slug: 'stamp-duty',
    title: 'Stamp Duty Calculator UK 2025 — SDLT on Residential Property',
    h1: 'Stamp Duty Land Tax (SDLT) Calculator — UK',
    metaDesc: 'Calculate your Stamp Duty Land Tax (SDLT) in England and Northern Ireland for 2025. Includes first-time buyer relief, second home surcharge, and the new SDLT bands.',
    intro: `Stamp Duty Land Tax (SDLT) is one of the largest upfront costs of buying property in England and Northern Ireland. Rates are banded — you pay different percentages on the portion of the price that falls within each band, not a flat rate on the total. This is a critical distinction that many buyers get wrong.

From April 2025, standard SDLT rates return to their pre-pandemic thresholds: 0% on the first £125,000; 2% on £125,001–£250,000; 5% on £250,001–£925,000; 10% on £925,001–£1.5 million; 12% above £1.5 million. First-time buyers receive relief on properties up to £500,000. Second homes (and buy-to-let) attract a 3% surcharge on each band.

For a £450,000 property: standard buyer pays £12,500 in SDLT. First-time buyer pays £10,000. Buying as a second home: £25,500. The difference can be enormous — enter your purchase price and status below.`,
    faqs: [
      {
        q: 'What are the Stamp Duty rates in England for 2025?',
        a: 'From April 2025, standard SDLT rates in England are: 0% on the first £125,000; 2% on £125,001–£250,000; 5% on £250,001–£925,000; 10% on £925,001–£1.5 million; 12% above £1.5 million. First-time buyers pay 0% on the first £300,000 and 5% on the portion from £300,001–£500,000 (no relief for properties above £500,000). These rates apply to residential property — commercial property SDLT is different.',
      },
      {
        q: 'What is the second home stamp duty surcharge?',
        a: 'If you are purchasing an additional residential property (a second home, buy-to-let, or holiday home) and you already own another residential property, you pay an additional 3% surcharge on top of standard SDLT rates at every band. So on a £300,000 second property: standard SDLT would be £2,500, but with the surcharge it becomes £11,500. The surcharge also applies to company purchases of residential property.',
      },
      {
        q: 'Is there Stamp Duty in Scotland and Wales?',
        a: 'Scotland has its own Land and Buildings Transaction Tax (LBTT) with different thresholds and rates. Wales has Land Transaction Tax (LTT), also with different rules. The SDLT calculator applies to England and Northern Ireland only. Rates and first-time buyer reliefs differ in each nation — use this calculator for English/Northern Irish properties and consult the Revenue Scotland or Welsh Revenue Authority websites for Scottish/Welsh properties.',
      },
      {
        q: 'When do I pay Stamp Duty and who pays it?',
        a: 'SDLT must be paid within 14 days of completing a property purchase. It is always paid by the buyer (never the seller). Your solicitor or conveyancer will typically calculate the amount, submit the SDLT return, and arrange payment from your funds at completion. Failure to pay on time results in interest charges and penalties — this is not something to delay.',
      },
      {
        q: 'Can I get a stamp duty refund?',
        a: 'You may be able to reclaim the 3% surcharge if you sell your previous main residence within 3 years of buying the new property (and you paid the surcharge because you temporarily owned two properties). You can claim a refund from HMRC up to 12 months after selling the previous property. First-time buyer relief can also sometimes be reclaimed if applied incorrectly.',
      },
    ],
    parentCalc: '/uk/mortgage',
    relatedSubPages: [],
    relatedCalcs: [
      { to: '/uk/affordability', label: 'Affordability Calculator' },
      { to: '/uk/stamp-duty', label: 'Full Stamp Duty Calculator' },
      { to: '/uk/rent-vs-buy', label: 'Rent vs Buy UK' },
    ],
  },

  // ─── CA Tax ─────────────────────────────────────────────────────────────────
  {
    country: 'ca',
    calc: 'tax',
    slug: 'ontario',
    title: 'Ontario Income Tax Calculator 2025 — Federal + Provincial',
    h1: 'Ontario Income Tax Calculator 2025',
    metaDesc: 'Calculate your Ontario income tax for 2025. See federal + provincial taxes, CPP, EI, and your exact net pay after all deductions with the Ontario surtax.',
    intro: `Ontario has Canada's most complex provincial income tax structure, featuring not only standard provincial tax brackets but also the Ontario surtax — an additional tax on top of your basic provincial tax that kicks in once your provincial tax exceeds certain thresholds.

For 2025, Ontario provincial rates are: 5.05% on the first $51,446; 9.15% on $51,447–$102,894; 11.16% on $102,895–$150,000; 12.16% on $150,001–$220,000; 13.16% above $220,000. The Ontario surtax adds 20% on provincial tax above $5,554 and 36% on provincial tax above $7,108.

Combined with federal tax, CPP contributions (5.70% on $68,500 earnings ceiling), and EI premiums (1.66% on $63,200 insurable earnings), a $100,000 salary in Ontario results in approximately $73,000–$75,000 net pay depending on deductions. See the full breakdown below.`,
    faqs: [
      {
        q: 'What are the 2025 Ontario provincial tax brackets?',
        a: 'Ontario 2025 provincial income tax rates: 5.05% on taxable income up to $51,446; 9.15% on $51,447–$102,894; 11.16% on $102,895–$150,000; 12.16% on $150,001–$220,000; 13.16% on income above $220,000. These rates apply to your taxable income after federal and provincial deductions. The Ontario surtax then applies an additional 20% and 36% on top of the basic provincial tax if it exceeds the surtax thresholds.',
      },
      {
        q: 'What is the Ontario surtax and how does it work?',
        a: 'The Ontario surtax is an additional levy applied on top of your basic Ontario tax. It has two tiers: an additional 20% on basic Ontario tax above $5,554; plus an additional 36% on basic Ontario tax above $7,108. The surtax effectively increases marginal rates for middle-to-high income earners — meaning $100,000–$150,000 earners face higher effective rates than the headline provincial brackets suggest.',
      },
      {
        q: 'Does Ontario have any tax credits to reduce what I owe?',
        a: 'Yes, several: Ontario Basic Personal Amount ($11,865 for 2025), Ontario Trillium Benefit (combines energy, property tax, and sales tax credits — up to $1,421 for qualifying low-income residents), Ontario Child Care Access and Relief from Expenses (CARE) tax credit, Ontario Caregiver Credit, Ontario Senior Homeowners Property Tax Grant, and Ontario Energy and Property Tax Credit. These are applied after calculating the basic Ontario tax.',
      },
      {
        q: 'What is the combined federal and Ontario marginal tax rate?',
        a: 'Combined 2025 marginal rates in Ontario: approximately 20.05% on income up to ~$16,000; 24.15% on ~$16,001–$51,446; 31.48% on $51,447–$100,392; 39.34% on $100,393–$102,894; 43.41% on $102,895–$150,000; 44.97% on $150,001–$165,430; 48.29% on $165,431–$220,000; 53.53% on income above $220,000. These are marginal rates — your average (effective) rate will be significantly lower.',
      },
      {
        q: 'How are CPP and EI calculated for Ontario residents?',
        a: 'CPP and EI are federal programs — the same rates apply in all provinces including Ontario. For 2025: CPP1 rate is 5.70% on earnings between $3,500 and $68,500 (max contribution $3,867.50). CPP2 applies an additional 4.00% on earnings between $68,500 and $73,200 (max additional $188). EI rate is 1.66% on insurable earnings up to $63,200 (max $1,049.12). Employers pay 1.4× the employee EI rate.',
      },
    ],
    parentCalc: '/ca/tax',
    relatedSubPages: [
      { to: '/ca/tax/quebec', label: 'Quebec Tax Calculator' },
    ],
    relatedCalcs: [
      { to: '/ca/salary', label: 'Salary Calculator' },
      { to: '/ca/budget', label: 'Budget Planner' },
    ],
  },

  {
    country: 'ca',
    calc: 'tax',
    slug: 'quebec',
    title: 'Quebec Income Tax Calculator 2025 — Federal + Provincial',
    h1: 'Quebec Income Tax Calculator 2025',
    metaDesc: 'Calculate Quebec income tax for 2025. Includes federal tax, Quebec provincial rates, QPP, QPIP, health contribution, and your net take-home pay.',
    intro: `Quebec has Canada's highest provincial income tax rates and a completely parallel tax system — Quebecers file two separate tax returns (federal and provincial) and pay into the Quebec Pension Plan (QPP) instead of CPP, plus Quebec Parental Insurance Plan (QPIP) premiums instead of federal EI maternity/parental benefits.

For 2025, Quebec's provincial tax brackets are: 14% on the first $51,780; 19% on $51,781–$103,545; 24% on $103,546–$126,000; 25.75% above $126,000. The combined federal + Quebec marginal top rate (53.31%) is among the highest in North America.

However, Quebec residents receive a federal tax abatement of 16.5% of basic federal tax, acknowledging that Quebec funds many programs (healthcare, education, family policy) provincially rather than federally. The Quebec Family Allowance, subsidized daycare ($10–$13.85/day for most families), and other Quebec-specific programs partially offset the higher tax burden.`,
    faqs: [
      {
        q: 'What are the 2025 Quebec provincial tax brackets?',
        a: 'Quebec 2025 provincial income tax rates: 14% on taxable income up to $51,780; 19% on $51,781–$103,545; 24% on $103,546–$126,000; 25.75% on income above $126,000. Note that Quebec uses its own personal exemption amounts and deductions — your Quebec taxable income may differ from your federal taxable income. Quebec also has its own pension plan (QPP) and parental insurance plan (QPIP).',
      },
      {
        q: 'What is the Quebec federal tax abatement?',
        a: 'The Quebec abatement reduces federal income tax by 16.5% for Quebec residents. This is because Quebec administers many programs (education, family benefits, labour programs) that are federally funded in other provinces. As a result, Quebec residents pay less federal tax than residents of other provinces at the same income level, which partially offsets Quebec\'s higher provincial tax rates.',
      },
      {
        q: 'What is QPP and how does it differ from CPP?',
        a: 'Quebec Pension Plan (QPP) replaces CPP for Quebec workers. For 2025, QPP1 rate is 5.70% on earnings between $3,500 and $68,500 (same as CPP1). QPP2 adds 4.00% on earnings between $68,500 and $73,200 (same as CPP2). Benefits at retirement are similar. The key difference: QPP is administered by Quebec (Retraite Québec) while CPP is federal. If you move provinces, your QPP contributions transfer to CPP and vice versa.',
      },
      {
        q: 'What is QPIP and who pays it?',
        a: 'Quebec Parental Insurance Plan (QPIP) provides maternity, paternity, and parental leave benefits. All Quebec workers pay QPIP premiums: employee rate is 0.494% on insurable earnings up to $94,000 (2025). Employers pay 0.692%. In exchange, EI parental/maternity premiums do not apply in Quebec (Quebec employees pay a reduced EI rate). QPIP provides more flexible and often more generous parental benefits than federal EI.',
      },
      {
        q: 'Does Quebec have a health contribution (health levy)?',
        a: 'Quebec abolished the flat-rate health contribution (which was up to $150/year) in 2019. However, Quebec does have a Health Services Fund (HSF) contribution paid by employers — not employees directly. Some self-employed workers pay the HSF contribution. For employees, the main deductions are provincial income tax, QPP, QPIP, and federal EI and income tax.',
      },
    ],
    parentCalc: '/ca/tax',
    relatedSubPages: [
      { to: '/ca/tax/ontario', label: 'Ontario Tax Calculator' },
    ],
    relatedCalcs: [
      { to: '/ca/salary', label: 'Salary Calculator' },
      { to: '/ca/budget', label: 'Budget Planner' },
    ],
  },

  // ─── US Tax ─────────────────────────────────────────────────────────────────
  {
    country: 'us',
    calc: 'tax',
    slug: 'california',
    title: 'California Income Tax Calculator 2025 — State + Federal',
    h1: 'California Income Tax Calculator 2025',
    metaDesc: 'Calculate California state income tax for 2025. Includes SDI, CA brackets, federal tax, and your actual take-home pay. California has the highest state income tax rate in the US.',
    intro: `California has the highest marginal state income tax rate in the United States — 13.30% on income above $1 million, and 9.30% on income above approximately $68,000 (single filers). For high earners, the combined federal + California marginal rate reaches 52.90% — the second highest in the developed world after some Scandinavian countries.

California's progressive rate structure means most residents pay significantly less than the top rate. A $75,000 salary in California faces a marginal state rate of 9.30% but an effective state rate of roughly 5–6%, plus SDI (State Disability Insurance) at 1.10% on all wages.

California also has no standard deduction equivalent to the federal deduction — instead, California has its own set of deductions and credits, including the renter's credit ($60/$120) and the young child tax credit ($1,117 per child under 6 for qualifying taxpayers). Property taxes (Proposition 13) are capped at 1% of assessed value — an important offset for homeowners.`,
    faqs: [
      {
        q: 'What are the 2025 California state income tax brackets?',
        a: 'California 2025 tax rates for single filers: 1% on income up to $10,756; 2% on $10,757–$25,499; 4% on $25,500–$40,245; 6% on $40,246–$55,866; 8% on $55,867–$70,606; 9.30% on $70,607–$360,659; 10.30% on $360,660–$432,787; 11.30% on $432,788–$721,314; 12.30% on $721,315–$999,999; 13.30% on income above $1 million. The 1% Mental Health Services Tax applies at $1M+. Married filing jointly thresholds are double.',
      },
      {
        q: 'What is California SDI and who pays it?',
        a: 'California State Disability Insurance (SDI) is a payroll deduction that funds short-term disability and Paid Family Leave benefits. From January 1, 2024, the SDI withholding rate is 1.10% with no taxable wage ceiling — meaning it applies to all wages regardless of income level. This change (eliminating the prior wage base cap of ~$153,000) significantly increased SDI costs for high earners.',
      },
      {
        q: 'Does California tax Social Security benefits?',
        a: 'No. California is one of the few states that does not tax Social Security benefits. California also does not tax military retirement pay. However, California does fully tax most other retirement income including pension distributions, IRA withdrawals, and 401(k) distributions at the same rates as ordinary income. California also taxes capital gains as ordinary income with no preferential rate.',
      },
      {
        q: 'Can I deduct federal taxes on my California return?',
        a: 'No. California does not allow a deduction for federal income taxes paid. However, California does allow deductions for mortgage interest, charitable contributions, and some business expenses — but these follow California\'s own rules, which sometimes differ from federal treatment. California does conform to federal standard deduction amounts for the basic deduction ($5,540 single / $11,080 married for 2025).',
      },
      {
        q: 'What is California\'s exit tax for people leaving the state?',
        a: 'California does not have a formal "exit tax" in the traditional sense, but it does aggressively enforce residency rules. If you leave California, the FTB may assert you are still a California resident if you maintain connections to the state (property, family, business). California also taxes deferred compensation, stock options, and RSUs based on the proportion of time worked in California when the equity was earned — this can create California tax liability even after you move.',
      },
    ],
    parentCalc: '/us/tax',
    relatedSubPages: [],
    relatedCalcs: [
      { to: '/us/salary', label: 'Salary Calculator' },
      { to: '/us/budget', label: 'Budget Planner' },
    ],
  },

  // ─── CA RideProfit ───────────────────────────────────────────────────────────
  {
    country: 'ca',
    calc: 'rideprofit',
    slug: 'uber',
    title: 'Uber Driver Profit Calculator Canada 2025 — True Earnings After Tax',
    h1: 'Uber Driver Profit Calculator — Canada 2025',
    metaDesc: 'Calculate your true Uber earnings in Canada after gas, depreciation, insurance, CPP, and income tax. See your real hourly rate and whether driving for Uber actually pays.',
    intro: `Uber and other rideshare platforms advertise gross earnings — but your actual take-home as a Canadian Uber driver is dramatically lower once you account for all costs. Gas typically represents 15–25% of gross earnings. Vehicle depreciation — the silent killer — can cost $0.08–$0.15 per kilometre in value lost. And as a self-employed driver, you pay both the employee and employer share of CPP contributions (10.50% combined on net self-employment income), plus income tax on profits.

CRA allows you to deduct actual vehicle expenses (gas, insurance, maintenance, depreciation) proportional to business use, or use the 2025 CRA mileage rate of $0.72/km for the first 5,000km and $0.66/km thereafter. Most active drivers are better off tracking actual expenses.

After all deductions, many Uber drivers earn an effective hourly rate of $12–$18/hour — sometimes below minimum wage when accounting for time spent waiting for rides, cleaning the vehicle, and doing tax paperwork. Use this calculator to see your real numbers.`,
    faqs: [
      {
        q: 'Do Uber drivers pay GST/HST in Canada?',
        a: 'Yes. All Uber (and rideshare) drivers in Canada are required to register for and collect GST/HST regardless of income level — the $30,000 small supplier exemption does not apply to ridesharing. You must register before your first trip. In Ontario, HST is 13%; in Quebec, GST is 5% + QST 9.975%. Uber remits HST on your behalf in most provinces, but you are still legally responsible for registration and your GST/HST return.',
      },
      {
        q: 'What CRA vehicle expenses can Uber drivers deduct?',
        a: 'As a self-employed driver, you can deduct the business-use portion of: fuel and oil, insurance, registration and licence, repairs and maintenance, car washes, lease payments (subject to limits) or CCA (depreciation) on a purchased vehicle, parking, tolls, and interest on a vehicle loan. You must track total vs. business kilometres to calculate the deductible percentage. Keep a logbook — CRA audits rideshare drivers fairly frequently.',
      },
      {
        q: 'Is Uber income taxed as business income or employment income in Canada?',
        a: 'Uber drivers are classified as self-employed (independent contractors) in Canada, not employees. This means you report income on Schedule T2125 (Business Income) on your T1 return. You pay tax on net profit (income minus expenses). You also pay CPP contributions at a combined employee+employer rate of 10.50% on net self-employment income between $3,500 and $68,500. There is no EI coverage for self-employed rideshare drivers (unless you opted into the voluntary EI program).',
      },
      {
        q: 'Does Uber provide a T4 or T4A slip in Canada?',
        a: 'Uber provides a T4A slip (Statement of Pension, Retirement, Annuity and Other Income) reporting your gross fares, not a T4 (employment income). This confirms your self-employment status. Uber also provides an annual tax summary showing your total trips, kilometres, and gross earnings to help you file. Note: the T4A shows gross earnings before Uber\'s service fee — your actual income (after Uber\'s cut) is what you report as revenue.',
      },
      {
        q: 'What is the most tax-efficient way to structure Uber income in Canada?',
        a: 'For high-volume drivers, incorporating can reduce self-employment CPP exposure and allow income splitting with a spouse. However, incorporation adds complexity and cost. Most casual drivers are better off as unincorporated sole proprietors. Maximizing RRSP contributions (deducting from net income), contributing to a TFSA, and claiming all legitimate vehicle and business expenses are the primary tax minimization strategies for unincorporated drivers.',
      },
    ],
    parentCalc: '/ca/rideprofit',
    relatedSubPages: [
      { to: '/us/rideprofit/uber', label: 'Uber Earnings Calculator (US)' },
    ],
    relatedCalcs: [
      { to: '/ca/tax', label: 'Tax Calculator' },
      { to: '/ca/budget', label: 'Budget Planner' },
    ],
  },

  // ─── US RideProfit ───────────────────────────────────────────────────────────
  {
    country: 'us',
    calc: 'rideprofit',
    slug: 'uber',
    title: 'Uber Driver Earnings Calculator USA 2025 — After Tax Profit',
    h1: 'Uber Driver Earnings Calculator — USA 2025',
    metaDesc: 'Calculate real Uber driver earnings after IRS deductions, self-employment tax, gas, and depreciation. See your true hourly rate driving for Uber or Lyft in 2025.',
    intro: `Uber advertises earnings of $30–$40/hour, but the reality for most US drivers is $14–$22/hour net after expenses. The gap comes from costs that aren't visible in the app: gas (15–25% of gross), vehicle depreciation ($0.08–0.15/mile in lost value), insurance, and — critically — the 15.3% self-employment tax (SE tax) that covers both employee and employer Social Security and Medicare contributions.

The IRS 2025 standard mileage rate of $0.70/mile is the simplest deduction method. At the average 20–25 miles per Uber trip, this deduction significantly reduces taxable income. Active drivers (15,000+ miles/year) often benefit from tracking actual expenses instead.

Uber, Lyft, and DoorDash drivers earning more than $600/year receive a 1099-K or 1099-NEC (1099-NEC for non-delivery work). Your net profit after deductions is subject to income tax plus the 15.3% SE tax — though you can deduct half the SE tax from your gross income. Use this calculator to model your real take-home.`,
    faqs: [
      {
        q: 'What is self-employment tax and how does it affect Uber drivers?',
        a: 'Self-employment (SE) tax is 15.3% on the first $168,600 of net self-employment income (2025), composed of 12.4% Social Security + 2.9% Medicare. Above $200,000 ($250,000 married), an additional 0.9% Medicare surtax applies. As an employee, you split these taxes 50/50 with your employer. As a self-employed Uber driver, you pay both halves. The saving grace: you deduct 50% of your SE tax from gross income on Schedule 1.',
      },
      {
        q: 'What IRS deductions can Uber drivers claim in 2025?',
        a: 'Uber drivers can deduct: mileage at $0.70/mile (2025 IRS rate) OR actual vehicle expenses (gas, insurance, maintenance, depreciation) — but not both. Also deductible: phone plan (business portion), water/snacks for passengers, car washes, parking and tolls, Uber-related fees, a portion of your phone bill, and any business-related supplies. Keep records — IRS audits Schedule C filers at higher rates than W-2 employees.',
      },
      {
        q: 'Should I use the IRS standard mileage rate or actual expenses?',
        a: 'The standard mileage rate ($0.70/mile in 2025) is simpler and often better for newer, less expensive vehicles and moderate mileage drivers (under 15,000 business miles/year). Actual expenses (gas + insurance + maintenance + depreciation via Section 179 or MACRS) are often better for high-mileage drivers with newer/more expensive vehicles, or when leasing. You must choose one method per vehicle per year; switching from actual expenses back to standard mileage has restrictions.',
      },
      {
        q: 'Do I need to pay quarterly estimated taxes as an Uber driver?',
        a: 'If you expect to owe at least $1,000 in federal taxes from your Uber income, you are required to make quarterly estimated tax payments (due April 15, June 16, September 15, and January 15). Failing to pay quarterly can result in underpayment penalties. Use IRS Form 1040-ES to calculate. Many drivers also need to pay state estimated taxes. The calculator can help you estimate what to set aside quarterly.',
      },
      {
        q: 'Can I deduct my car purchase or lease for Uber driving?',
        a: 'Yes, the business-use portion of your vehicle is deductible. For a purchased vehicle, you can use bonus depreciation (Section 168k), Section 179 expensing (subject to luxury vehicle limits), or regular MACRS depreciation. For a leased vehicle, you deduct the business-use percentage of lease payments (with an inclusion amount that reduces the deduction for expensive vehicles). The business-use percentage is your Uber miles divided by total miles driven in the year.',
      },
    ],
    parentCalc: '/us/rideprofit',
    relatedSubPages: [
      { to: '/ca/rideprofit/uber', label: 'Uber Earnings Calculator (Canada)' },
    ],
    relatedCalcs: [
      { to: '/us/tax', label: 'Tax Calculator' },
      { to: '/us/budget', label: 'Budget Planner' },
    ],
  },
]

// Build a lookup map keyed by "country/calc/slug"
export const seoPageMap = Object.fromEntries(
  seoPages.map(p => [`${p.country}/${p.calc}/${p.slug}`, p])
)

// Build sub-page index keyed by "country/calc" for showing "Explore topics" on parent pages
export const subPagesByCalc = seoPages.reduce((acc, p) => {
  const key = `${p.country}/${p.calc}`
  if (!acc[key]) acc[key] = []
  acc[key].push({ to: `/${p.country}/${p.calc}/${p.slug}`, label: p.h1 })
  return acc
}, {})
