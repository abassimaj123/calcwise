// SEO sub-pages: targeted long-tail keyword pages that embed the parent calculator
// Route: /:country/:calc/:slug  →  /ca/mortgage/cmhc-insurance

export const seoPages = [
  // ─── CA Mortgage ───────────────────────────────────────────────────────────
  {
    country: 'ca',
    calc: 'mortgage',
    slug: 'cmhc-insurance',
    title: 'CMHC Mortgage Insurance Calculator Canada 2026',
    h1: 'CMHC Mortgage Insurance Calculator',
    metaDesc: 'Calculate your CMHC mortgage insurance premium instantly. See exactly how much CMHC insurance adds to your mortgage and monthly payment — updated 2026 rates.',
    intro: `If your down payment is less than 20% in Canada, CMHC mortgage loan insurance is mandatory. The Canada Mortgage and Housing Corporation (CMHC) insures the lender against default — not you as the borrower — and charges a one-time premium ranging from 2.80% to 4.00% of your total loan amount depending on your loan-to-value (LTV) ratio. That premium is added directly to your mortgage balance, meaning you finance it at your full mortgage rate over your entire amortization period.

For a $600,000 home with a 5% down payment ($30,000), your insured loan is $570,000. CMHC applies a 4.00% premium — that's $22,800 added to your mortgage balance, bringing your total mortgage to $592,800. At a 5.0% interest rate amortized over 25 years, you'll pay an additional $38,500 in interest on that insurance premium alone. The premium looks manageable as a percentage, but the true cost is significantly higher once compounded over the full amortization.

The three CMHC premium tiers are straightforward: if your down payment is 5–9.99% (LTV 90.01–95%), the rate is 4.00%. At 10–14.99% down (LTV 85.01–90%), it drops to 3.10%. At 15–19.99% down (LTV 80.01–85%), the rate is 2.80%. This means bringing your down payment up from 5% to 10% on that same $600,000 purchase reduces your CMHC premium from $22,800 to $17,670 — saving $5,130 upfront, plus roughly $8,500 in compounded interest over 25 years.

Not all provinces treat the premium the same way. Ontario, Manitoba, Quebec, and Saskatchewan charge provincial sales tax (PST) on the CMHC premium: in Ontario, PST is 8% on the premium (not the home value), meaning $22,800 × 8% = $1,824 in PST that must be paid in cash at closing — it cannot be added to the mortgage. Quebec applies 9% QST; Manitoba 7%; Saskatchewan 6%.

CMHC is the largest of three approved mortgage insurers in Canada, but Sagen (formerly Genworth Canada) and Canada Guaranty offer identical premium rates. All three are backed by the federal government under the National Housing Act. Your lender typically chooses the insurer, but the rates are regulated and identical — you cannot shop between insurers for a better rate. What differs is that some specialty products (like flex-down mortgages or certain rental properties) may have insurer-specific eligibility rules.

Use this calculator to see your exact CMHC premium at your down payment level, how it changes as you increase your down payment, your resulting monthly payment, and the full amortization schedule showing how long the insurance adds to your repayment.`,
    faqs: [
      {
        q: 'When is CMHC insurance required in Canada?',
        a: 'CMHC mortgage loan insurance is required on all mortgages where the down payment is less than 20% of the purchase price. It is mandatory for homes priced up to $1.5 million (as of late 2024). Homes priced above $1.5 million are ineligible for CMHC insurance and therefore require a minimum 20% down payment.',
      },
      {
        q: 'What are the CMHC insurance rates for 2026?',
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
    title: 'Canadian Mortgage Stress Test Calculator 2026',
    h1: 'Canadian Mortgage Stress Test Calculator',
    metaDesc: 'Find out exactly what you qualify for under the OSFI B-20 mortgage stress test. Enter your income and see your maximum mortgage after stress test — 2026 rules.',
    intro: `Canada's mortgage stress test (OSFI Guideline B-20) requires all federally regulated lenders — banks, federal trust companies, and federal credit unions — to qualify borrowers at the higher of either the contract rate plus 2 percentage points, or 5.25%, whichever is greater. As of 2026, with typical 5-year fixed rates around 4.5–5.0%, the qualifying rate runs 6.5–7.0%. This single rule is the most significant constraint on Canadian mortgage borrowing power.

The stress test was introduced in January 2018 and expanded in June 2021 (when the floor was raised from 4.79% to 5.25%). Its purpose is to ensure borrowers can continue servicing their mortgage if rates rise materially after they close — which is exactly what happened in 2022–2023 when the Bank of Canada hiked rates 10 times. The test is administered not at the time of renewal but at origination — and again any time you switch lenders, refinance, or materially modify your mortgage.

In practice, the stress test reduces maximum borrowing capacity by roughly 20–25% relative to qualifying at the contract rate. A household earning $150,000 per year with no other debt might qualify for approximately $850,000 at a 5.0% contract rate. Under the stress test at 7.0%, that same household qualifies for roughly $665,000 — a $185,000 reduction in purchasing power from a rule that adds 2 percentage points to a theoretical qualifying rate.

The two key ratios lenders use are the Gross Debt Service (GDS) ratio and the Total Debt Service (TDS) ratio — both applied at the stress test rate, not the actual contract rate. The GDS limit is 39%: your principal, interest, property tax, heat, and 50% of condo fees cannot exceed 39% of gross income. The TDS limit is 44%: all housing costs plus car loans, credit card minimums, student loans, and other debt cannot exceed 44% of gross income. Lenders apply whichever constraint is more binding.

Adding a co-borrower is the most effective way to increase your qualifying amount — their income is added directly to the GDS/TDS calculation. Paying down revolving debt (which often has high minimum payments relative to balance) is the second most effective approach: eliminating a $400/month credit card minimum payment at the stress test rate effectively adds roughly $60,000 to your qualifying mortgage amount. Extending amortization does not improve stress test results because OSFI requires the qualifying payment to be calculated on a 25-year amortization regardless of the actual amortization you choose.

Note that provincial credit unions, private lenders, and Desjardins (provincially regulated in Quebec) are not subject to the federal B-20 stress test. However, many apply similar standards voluntarily, and provincial regulators have issued comparable guidelines. Use this calculator to enter your income, existing debts, and the current rate to see your maximum qualifying mortgage and required income for any target purchase price.`,
    faqs: [
      {
        q: 'What is the Canadian mortgage stress test rate in 2026?',
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
    title: 'First-Time Home Buyer Canada — Mortgage Calculator & Programs 2026',
    h1: 'First-Time Home Buyer Mortgage Calculator — Canada',
    metaDesc: 'Calculate your mortgage as a first-time buyer in Canada. Includes FHSA, HBP RRSP, First Home Savings Account, and CMHC insurance — all 2026 federal programs.',
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
    title: 'PMI Calculator — Private Mortgage Insurance Cost 2026',
    h1: 'PMI (Private Mortgage Insurance) Calculator',
    metaDesc: 'Calculate your monthly PMI cost and see exactly when it drops off. Find out the true cost of PMI over the life of your loan — plus strategies to avoid or cancel it.',
    intro: `Private Mortgage Insurance (PMI) is required by most U.S. lenders when your down payment is less than 20% of the home's purchase price. The annual PMI cost typically ranges from 0.50% to 1.50% of your loan amount — meaning on a $400,000 loan it costs $2,000–$6,000 per year, or $167–$500 per month added to your payment.

What many buyers don't realize: PMI doesn't last forever. Under the Homeowners Protection Act (HPA), your lender must automatically cancel PMI when your loan balance reaches 78% of the original home value. You can also request cancellation when you reach 80% — but you may need to pay for a new appraisal.

Use this calculator to see your exact PMI cost, how it's factored into your monthly payment, and at what point (date and payment number) your PMI is scheduled to drop off automatically based on your amortization schedule.`,
    faqs: [
      {
        q: 'What is the average PMI rate in 2026?',
        a: 'PMI rates typically range from 0.50% to 1.50% of the loan amount per year, depending on your credit score, down payment percentage, loan type, and lender. Borrowers with excellent credit (760+) and a 15% down payment might pay as little as 0.20–0.30%. Those with lower credit scores and a 5% down payment might pay 1.00–1.50%. Your lender is required to disclose the PMI rate in your Loan Estimate.',
      },
      {
        q: 'How do I get rid of PMI?',
        a: 'You can eliminate PMI through several paths: (1) Reach 80% LTV through regular payments and request cancellation in writing. (2) Your lender must automatically cancel at 78% LTV based on original value. (3) Refinance when you have 20%+ equity — especially if home values have risen. (4) Get a new appraisal showing your LTV is at or below 80% due to appreciation. Note that FHA loans have mortgage insurance for the life of the loan (if down payment < 10%), unlike conventional PMI.',
      },
      {
        q: 'Is PMI tax-deductible?',
        a: 'PMI deductibility has changed over the years and expired for tax years after 2021 under the Tax Cuts and Jobs Act. As of 2026, PMI is not federally tax-deductible for most homeowners. Some states may still allow deductions — check with a tax professional for your state. The mortgage interest deduction (for itemizers) is still available.',
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
    title: '30-Year Mortgage Calculator USA — Compare 15 vs 30 Year 2026',
    h1: '30-Year Mortgage Calculator — Is It the Right Choice?',
    metaDesc: 'Calculate payments on a 30-year fixed mortgage and compare total interest cost vs a 15-year loan. See exactly how much the longer term costs you — and when it makes sense.',
    intro: `The 30-year fixed-rate mortgage is America's most popular home loan — but it comes with a hidden price tag that most buyers never fully reckon with. While the lower monthly payment is undeniably attractive, the 30-year term means you pay interest for twice as long as a 15-year mortgage, resulting in dramatically more total interest paid.

On a $400,000 mortgage at 7.0%, a 30-year loan costs you $557,000 in total interest — more than the original loan amount. A 15-year loan at 6.5% costs $213,000 in interest — saving you $344,000 but increasing monthly payments by $1,057/month.

The right choice depends on your income stability, investment discipline, and life plans. If you invest the monthly payment difference at market returns, the 30-year can sometimes win. Use this calculator to model both scenarios, including your opportunity cost if you invest the payment difference.`,
    faqs: [
      {
        q: 'What is the current 30-year fixed mortgage rate in 2026?',
        a: '30-year fixed mortgage rates in the US have ranged from 6.5% to 7.5% in early 2026, depending on credit score, down payment, loan size, and lender. The Federal Reserve\'s rate decisions, inflation data, and 10-year Treasury yields are the primary drivers. Check current rates with your lender or mortgage broker as they change daily — this calculator lets you input any rate for an accurate estimate.',
      },
      {
        q: 'Should I choose a 30-year or 15-year mortgage?',
        a: 'A 15-year mortgage saves massive amounts in interest (often $150,000–$350,000 on a typical loan) and builds equity faster, but requires higher monthly payments — typically 30–40% more than a 30-year. A 30-year makes sense if: you need the lower payment flexibility, you plan to invest the difference aggressively (historically stock market returns can exceed mortgage rates), or your income is variable. A 30-year with extra principal payments is a common middle-ground approach.',
      },
      {
        q: 'What is a conforming loan limit in 2026?',
        a: 'For 2026, the conforming loan limit (set by FHFA) is $806,500 for most US counties. High-cost areas (like parts of California, New York, Colorado) have higher limits up to $1,209,750. Loans above these limits are "jumbo" mortgages with typically higher rates and stricter qualification requirements. Conforming loans can be sold to Fannie Mae or Freddie Mac, which is why they often have better rates.',
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
    title: 'Stamp Duty Calculator UK 2026 — SDLT on Residential Property',
    h1: 'Stamp Duty Land Tax (SDLT) Calculator — UK',
    metaDesc: 'Calculate your Stamp Duty Land Tax (SDLT) in England and Northern Ireland for 2026. Includes first-time buyer relief, second home surcharge, and the new SDLT bands.',
    intro: `Stamp Duty Land Tax (SDLT) is one of the largest upfront costs of buying property in England and Northern Ireland. Rates are banded — you pay different percentages on the portion of the price that falls within each band, not a flat rate on the total. This is a critical distinction that many buyers get wrong.

From April 2026, standard SDLT rates return to their pre-pandemic thresholds: 0% on the first £125,000; 2% on £125,001–£250,000; 5% on £250,001–£925,000; 10% on £925,001–£1.5 million; 12% above £1.5 million. First-time buyers receive relief on properties up to £500,000. Second homes (and buy-to-let) attract a 3% surcharge on each band.

For a £450,000 property: standard buyer pays £12,500 in SDLT. First-time buyer pays £10,000. Buying as a second home: £25,500. The difference can be enormous — enter your purchase price and status below.`,
    faqs: [
      {
        q: 'What are the Stamp Duty rates in England for 2026?',
        a: 'From April 2026, standard SDLT rates in England are: 0% on the first £125,000; 2% on £125,001–£250,000; 5% on £250,001–£925,000; 10% on £925,001–£1.5 million; 12% above £1.5 million. First-time buyers pay 0% on the first £300,000 and 5% on the portion from £300,001–£500,000 (no relief for properties above £500,000). These rates apply to residential property — commercial property SDLT is different.',
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
    title: 'Ontario Income Tax Calculator 2026 — Federal + Provincial',
    h1: 'Ontario Income Tax Calculator 2026',
    metaDesc: 'Calculate your Ontario income tax for 2026. See federal + provincial taxes, CPP, EI, and your exact net pay after all deductions with the Ontario surtax.',
    intro: `Ontario has Canada's most complex provincial income tax structure, featuring not only standard provincial tax brackets but also the Ontario surtax — an additional tax on top of your basic provincial tax that kicks in once your provincial tax exceeds certain thresholds.

For 2026, Ontario provincial rates are: 5.05% on the first $51,446; 9.15% on $51,447–$102,894; 11.16% on $102,895–$150,000; 12.16% on $150,001–$220,000; 13.16% above $220,000. The Ontario surtax adds 20% on provincial tax above $5,554 and 36% on provincial tax above $7,108.

Combined with federal tax, CPP contributions (5.70% on $68,500 earnings ceiling), and EI premiums (1.66% on $63,200 insurable earnings), a $100,000 salary in Ontario results in approximately $73,000–$75,000 net pay depending on deductions. See the full breakdown below.`,
    faqs: [
      {
        q: 'What are the 2026 Ontario provincial tax brackets?',
        a: 'Ontario 2026 provincial income tax rates: 5.05% on taxable income up to $51,446; 9.15% on $51,447–$102,894; 11.16% on $102,895–$150,000; 12.16% on $150,001–$220,000; 13.16% on income above $220,000. These rates apply to your taxable income after federal and provincial deductions. The Ontario surtax then applies an additional 20% and 36% on top of the basic provincial tax if it exceeds the surtax thresholds.',
      },
      {
        q: 'What is the Ontario surtax and how does it work?',
        a: 'The Ontario surtax is an additional levy applied on top of your basic Ontario tax. It has two tiers: an additional 20% on basic Ontario tax above $5,554; plus an additional 36% on basic Ontario tax above $7,108. The surtax effectively increases marginal rates for middle-to-high income earners — meaning $100,000–$150,000 earners face higher effective rates than the headline provincial brackets suggest.',
      },
      {
        q: 'Does Ontario have any tax credits to reduce what I owe?',
        a: 'Yes, several: Ontario Basic Personal Amount ($11,865 for 2026), Ontario Trillium Benefit (combines energy, property tax, and sales tax credits — up to $1,421 for qualifying low-income residents), Ontario Child Care Access and Relief from Expenses (CARE) tax credit, Ontario Caregiver Credit, Ontario Senior Homeowners Property Tax Grant, and Ontario Energy and Property Tax Credit. These are applied after calculating the basic Ontario tax.',
      },
      {
        q: 'What is the combined federal and Ontario marginal tax rate?',
        a: 'Combined 2026 marginal rates in Ontario: approximately 20.05% on income up to ~$16,000; 24.15% on ~$16,001–$51,446; 31.48% on $51,447–$100,392; 39.34% on $100,393–$102,894; 43.41% on $102,895–$150,000; 44.97% on $150,001–$165,430; 48.29% on $165,431–$220,000; 53.53% on income above $220,000. These are marginal rates — your average (effective) rate will be significantly lower.',
      },
      {
        q: 'How are CPP and EI calculated for Ontario residents?',
        a: 'CPP and EI are federal programs — the same rates apply in all provinces including Ontario. For 2026: CPP1 rate is 5.70% on earnings between $3,500 and $68,500 (max contribution $3,867.50). CPP2 applies an additional 4.00% on earnings between $68,500 and $73,200 (max additional $188). EI rate is 1.66% on insurable earnings up to $63,200 (max $1,049.12). Employers pay 1.4× the employee EI rate.',
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
    title: 'Quebec Income Tax Calculator 2026 — Federal + Provincial',
    h1: 'Quebec Income Tax Calculator 2026',
    metaDesc: 'Calculate Quebec income tax for 2026. Includes federal tax, Quebec provincial rates, QPP, QPIP, health contribution, and your net take-home pay.',
    intro: `Quebec has Canada's highest provincial income tax rates and a completely parallel tax system — Quebecers file two separate tax returns (federal and provincial) and pay into the Quebec Pension Plan (QPP) instead of CPP, plus Quebec Parental Insurance Plan (QPIP) premiums instead of federal EI maternity/parental benefits.

For 2026, Quebec's provincial tax brackets are: 14% on the first $51,780; 19% on $51,781–$103,545; 24% on $103,546–$126,000; 25.75% above $126,000. The combined federal + Quebec marginal top rate (53.31%) is among the highest in North America.

However, Quebec residents receive a federal tax abatement of 16.5% of basic federal tax, acknowledging that Quebec funds many programs (healthcare, education, family policy) provincially rather than federally. The Quebec Family Allowance, subsidized daycare ($10–$13.85/day for most families), and other Quebec-specific programs partially offset the higher tax burden.`,
    faqs: [
      {
        q: 'What are the 2026 Quebec provincial tax brackets?',
        a: 'Quebec 2026 provincial income tax rates: 14% on taxable income up to $51,780; 19% on $51,781–$103,545; 24% on $103,546–$126,000; 25.75% on income above $126,000. Note that Quebec uses its own personal exemption amounts and deductions — your Quebec taxable income may differ from your federal taxable income. Quebec also has its own pension plan (QPP) and parental insurance plan (QPIP).',
      },
      {
        q: 'What is the Quebec federal tax abatement?',
        a: 'The Quebec abatement reduces federal income tax by 16.5% for Quebec residents. This is because Quebec administers many programs (education, family benefits, labour programs) that are federally funded in other provinces. As a result, Quebec residents pay less federal tax than residents of other provinces at the same income level, which partially offsets Quebec\'s higher provincial tax rates.',
      },
      {
        q: 'What is QPP and how does it differ from CPP?',
        a: 'Quebec Pension Plan (QPP) replaces CPP for Quebec workers. For 2026, QPP1 rate is 5.70% on earnings between $3,500 and $68,500 (same as CPP1). QPP2 adds 4.00% on earnings between $68,500 and $73,200 (same as CPP2). Benefits at retirement are similar. The key difference: QPP is administered by Quebec (Retraite Québec) while CPP is federal. If you move provinces, your QPP contributions transfer to CPP and vice versa.',
      },
      {
        q: 'What is QPIP and who pays it?',
        a: 'Quebec Parental Insurance Plan (QPIP) provides maternity, paternity, and parental leave benefits. All Quebec workers pay QPIP premiums: employee rate is 0.494% on insurable earnings up to $94,000 (2026). Employers pay 0.692%. In exchange, EI parental/maternity premiums do not apply in Quebec (Quebec employees pay a reduced EI rate). QPIP provides more flexible and often more generous parental benefits than federal EI.',
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
    title: 'California Income Tax Calculator 2026 — State + Federal',
    h1: 'California Income Tax Calculator 2026',
    metaDesc: 'Calculate California state income tax for 2026. Includes SDI, CA brackets, federal tax, and your actual take-home pay. California has the highest state income tax rate in the US.',
    intro: `California has the highest marginal state income tax rate in the United States — 13.30% on income above $1 million (including the 1% Mental Health Services Tax surcharge), and 9.30% on income above $70,607 for single filers in 2026. For high earners in California, the combined federal and state marginal rate reaches 52.9% — among the highest effective rates in the developed world. This reality drives the ongoing outmigration of high-income households to Texas, Nevada, and Florida.

California's 10-bracket progressive structure means most residents pay far less than the top rate. On a $75,000 salary, your effective California state tax rate is roughly 5.0–5.5% — not 9.3%. The 9.3% marginal rate applies only to income above $70,607, and the lower brackets (1%, 2%, 4%, 6%, 8%) absorb the first $70,606 of income. California also has no standard deduction in the traditional federal sense, but does allow a basic standard deduction of $5,540 (single) or $11,080 (married filing jointly) for 2026.

State Disability Insurance (SDI) changed significantly in January 2024. Previously, SDI was capped at a taxable wage base (~$153,000). Now, the 1.10% SDI rate applies to all wages with no ceiling — a change that raised the annual SDI bill for a $300,000 earner from ~$1,685 to $3,300. This uncapped SDI is now the most significant structural change to California payroll taxes for high-income W-2 employees in recent years.

California taxes nearly all forms of income at ordinary rates — including capital gains. There is no preferential long-term capital gains rate in California, unlike the federal system which taxes most long-term capital gains at 0%, 15%, or 20%. A California resident selling appreciated stock faces federal capital gains tax (0–23.8% including NIIT) plus California ordinary rates up to 13.3% — a combined rate of up to 37.1% on long-term gains, which is one reason many high-income Californians time major asset sales to coincide with a year they establish residency outside the state.

On the benefit side, California does not tax Social Security income or military retirement pay. The Renter's Credit provides $60 (single) or $120 (married/HOH) for lower-income renters. The Young Child Tax Credit offers $1,117 per qualifying child under age 6 for households earning below $25,000. The California Earned Income Tax Credit (CalEITC) supplements the federal EITC for low-income workers. And Proposition 13 caps property taxes at 1% of assessed value, with increases limited to 2% per year — a meaningful offset for long-established homeowners, though it also means California's property tax bill is often lower than in Texas or New York despite higher home values.

Use this calculator to enter your salary, filing status, and deductions to see your full 2026 California + federal tax breakdown, effective rates, and take-home pay.`,
    faqs: [
      {
        q: 'What are the 2026 California state income tax brackets?',
        a: 'California 2026 tax rates for single filers: 1% on income up to $10,756; 2% on $10,757–$25,499; 4% on $25,500–$40,245; 6% on $40,246–$55,866; 8% on $55,867–$70,606; 9.30% on $70,607–$360,659; 10.30% on $360,660–$432,787; 11.30% on $432,788–$721,314; 12.30% on $721,315–$999,999; 13.30% on income above $1 million. The 1% Mental Health Services Tax applies at $1M+. Married filing jointly thresholds are double.',
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
        a: 'No. California does not allow a deduction for federal income taxes paid. However, California does allow deductions for mortgage interest, charitable contributions, and some business expenses — but these follow California\'s own rules, which sometimes differ from federal treatment. California does conform to federal standard deduction amounts for the basic deduction ($5,540 single / $11,080 married for 2026).',
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
    title: 'Uber Driver Profit Calculator Canada 2026 — True Earnings After Tax',
    h1: 'Uber Driver Profit Calculator — Canada 2026',
    metaDesc: 'Calculate your true Uber earnings in Canada after gas, depreciation, insurance, CPP, and income tax. See your real hourly rate and whether driving for Uber actually pays.',
    intro: `Uber and other rideshare platforms advertise gross earnings — but your actual take-home as a Canadian Uber driver is dramatically lower once you account for all costs. Gas typically represents 15–25% of gross earnings. Vehicle depreciation — the silent killer — can cost $0.08–$0.15 per kilometre in value lost. And as a self-employed driver, you pay both the employee and employer share of CPP contributions (10.50% combined on net self-employment income), plus income tax on profits.

CRA allows you to deduct actual vehicle expenses (gas, insurance, maintenance, depreciation) proportional to business use, or use the 2026 CRA mileage rate of $0.72/km for the first 5,000km and $0.66/km thereafter. Most active drivers are better off tracking actual expenses.

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
    title: 'Uber Driver Earnings Calculator USA 2026 — After Tax Profit',
    h1: 'Uber Driver Earnings Calculator — USA 2026',
    metaDesc: 'Calculate real Uber driver earnings after IRS deductions, self-employment tax, gas, and depreciation. See your true hourly rate driving for Uber or Lyft in 2026.',
    intro: `Uber advertises earnings of $30–$40/hour, but the reality for most US drivers is $14–$22/hour net after expenses. The gap comes from costs that aren't visible in the app: gas (15–25% of gross), vehicle depreciation ($0.08–0.15/mile in lost value), insurance, and — critically — the 15.3% self-employment tax (SE tax) that covers both employee and employer Social Security and Medicare contributions.

The IRS 2026 standard mileage rate of $0.70/mile is the simplest deduction method. At the average 20–25 miles per Uber trip, this deduction significantly reduces taxable income. Active drivers (15,000+ miles/year) often benefit from tracking actual expenses instead.

Uber, Lyft, and DoorDash drivers earning more than $600/year receive a 1099-K or 1099-NEC (1099-NEC for non-delivery work). Your net profit after deductions is subject to income tax plus the 15.3% SE tax — though you can deduct half the SE tax from your gross income. Use this calculator to model your real take-home.`,
    faqs: [
      {
        q: 'What is self-employment tax and how does it affect Uber drivers?',
        a: 'Self-employment (SE) tax is 15.3% on the first $168,600 of net self-employment income (2026), composed of 12.4% Social Security + 2.9% Medicare. Above $200,000 ($250,000 married), an additional 0.9% Medicare surtax applies. As an employee, you split these taxes 50/50 with your employer. As a self-employed Uber driver, you pay both halves. The saving grace: you deduct 50% of your SE tax from gross income on Schedule 1.',
      },
      {
        q: 'What IRS deductions can Uber drivers claim in 2026?',
        a: 'Uber drivers can deduct: mileage at $0.70/mile (2026 IRS rate) OR actual vehicle expenses (gas, insurance, maintenance, depreciation) — but not both. Also deductible: phone plan (business portion), water/snacks for passengers, car washes, parking and tolls, Uber-related fees, a portion of your phone bill, and any business-related supplies. Keep records — IRS audits Schedule C filers at higher rates than W-2 employees.',
      },
      {
        q: 'Should I use the IRS standard mileage rate or actual expenses?',
        a: 'The standard mileage rate ($0.70/mile in 2026) is simpler and often better for newer, less expensive vehicles and moderate mileage drivers (under 15,000 business miles/year). Actual expenses (gas + insurance + maintenance + depreciation via Section 179 or MACRS) are often better for high-mileage drivers with newer/more expensive vehicles, or when leasing. You must choose one method per vehicle per year; switching from actual expenses back to standard mileage has restrictions.',
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

  // ─── New high-volume pages ───────────────────────────────────────────────────

  // ─── US Tax by State ─────────────────────────────────────────────────────────
  {
    country: 'us',
    calc: 'tax',
    slug: 'new-york',
    title: 'New York Income Tax Calculator 2026 — State + Federal + NYC',
    h1: 'New York Income Tax Calculator 2026',
    metaDesc: 'Calculate NY state income tax for 2026. Covers 8 NY brackets, NYC resident surtax, SDI, and SALT deduction impact. Top combined rate 14.776% in NYC.',
    intro: `New York State operates one of the most layered income tax systems in the United States — nine state brackets, a separate New York City resident income tax for the 8.3 million people who live in the five boroughs, a state Paid Family Leave (PFL) deduction, and a State Disability Insurance (SDI) payroll deduction. Layer on top the federal tax, and a high-earning Manhattan resident faces a combined marginal rate of approximately 50.9% — making New York City one of the highest-taxed jurisdictions for individuals anywhere in the world.

New York State rates for 2026 single filers run from 4% on the first $17,150 up through 10.90% above $25 million. The critical rate jump for most middle-to-upper-middle-income earners occurs at $161,551, where the rate climbs from 5.85% to 6.25%, and again at $323,201 where it reaches 6.85%. These "regular" brackets apply to the vast majority of New York earners — the headline 9.65%–10.90% rates only affect incomes above $2.155 million. For a $120,000 salary in New York State, your effective state tax rate is roughly 6.0–6.3%, not the 10.90% often cited in news coverage.

NYC residents face an additional city income tax on top of state tax: 3.078% on the first $12,000 of taxable income, stepping up to 3.876% above $50,000. This city tax is not a flat rate — it's progressive within a narrow range. For a $100,000 NYC income, the effective city tax rate is approximately 3.7%. Non-residents who work in New York City but live in New Jersey, Connecticut, or elsewhere in New York State do not owe city tax — only state tax. This commuter dynamic (live in NJ, work in NYC) can save $3,500–$5,000+ annually for median-income households.

The SALT (State and Local Tax) deduction cap at $10,000 (enacted under TCJA, in effect through at least 2025 under current law) disproportionately affects New York taxpayers, who routinely pay $15,000–$40,000+ in combined state income tax and property tax. A Manhattan renter earning $200,000 might pay $14,000 in New York State income tax and $2,000 in city property-based taxes — $16,000 total SALT — but can only deduct $10,000 federally, effectively paying federal tax on an additional $6,000 that is also taxed at the state/city level.

For business owners, New York's Pass-Through Entity Tax (PTET) offers a partial workaround: the entity pays state tax at rates up to 10.90%, claims a federal business deduction for that payment, and the owner receives a NY credit — effectively converting non-deductible personal SALT into deductible business expense. The PTET is elective but has become widely used by S-corp and partnership owners in New York since 2021.

Paid Family Leave (PFL) contributions are 0.373% of wages up to the statewide average weekly wage cap ($89,343 annualized for 2026), with a maximum annual contribution of $333. SDI is 0.511% of wages, capped at $0.60/week ($31.20 annually) — a trivial amount. These deductions are taken pre-tax for federal purposes. Use this calculator to model your full New York tax picture — state, city (if applicable), SDI, PFL, and federal — with your actual filing status and deductions.`,
    faqs: [
      {
        q: 'What is the New York City income tax rate for 2026?',
        a: 'NYC levies its own resident income tax on top of New York State tax. For 2026, NYC rates are: 3.078% on taxable income up to $12,000 (single); 3.762% on $12,001–$25,000; 3.819% on $25,001–$50,000; 3.876% on income above $50,000. These rates apply to your NYC taxable income, which is similar to your federal adjusted gross income with NYC-specific modifications. Non-residents who work in NYC (but live outside city limits) do not pay the city tax — only the NY State tax.',
      },
      {
        q: 'Does New York State have a millionaire\'s tax?',
        a: 'Yes. New York temporarily raised rates on high earners through 2027. The top rate is 10.90% on income above $25 million (single/MFS) or $25 million (married). The 9.65% bracket starts at $2,155,350. These top rates are among the highest state income tax rates in the country. Combined with NYC\'s 3.876% and the federal top rate of 37%, New York City\'s highest earners face a combined marginal rate of approximately 50.9%.',
      },
      {
        q: 'What is New York SDI and who pays it?',
        a: 'New York State Disability Insurance (SDI) is a mandatory payroll deduction for most employees. The 2026 employee SDI rate is 0.511% of wages, capped at a maximum of $0.60/week ($31.20/year). It\'s a small but required deduction. SDI funds short-term disability benefits (up to 26 weeks at 67% of average weekly wage, capped at $1,131.72/week for 2026). Paid Family Leave (PFL) is separate: 0.373% on wages up to $89,343, also mandatory for most employees.',
      },
      {
        q: 'How does the SALT cap affect New York taxpayers?',
        a: 'The $10,000 federal SALT deduction cap (enacted in 2017 under TCJA, extended through 2025 and currently set to expire) hits New York taxpayers particularly hard. A Manhattan household paying $15,000 in state income tax and $12,000 in property taxes ($27,000 total SALT) can only deduct $10,000 federally. New York\'s Pass-Through Entity Tax (PTET) offers a workaround for business owners: the entity pays NY tax at rates up to 10.90%, deducts it as a business expense at the federal level, and owners receive a NY credit — effectively bypassing the SALT cap for eligible income.',
      },
      {
        q: 'Are there any major New York State tax credits I should know about?',
        a: 'Key New York credits include: the NY Earned Income Credit (30% of the federal EITC), the Child and Dependent Care Credit (up to 110% of the federal credit for lower-income filers), the Real Property Tax Credit (for lower-income homeowners/renters), the NYC School Tax Credit (a small flat credit of $63–$210 for NYC residents), and the NY College Tuition Credit/Deduction ($400 per qualifying student or a $10,000 deduction). Empire State Child Credit provides up to $330 per qualifying child for 2026.',
      },
    ],
    parentCalc: '/us/tax',
    relatedSubPages: [
      { to: '/us/tax/california', label: 'California Tax Calculator' },
      { to: '/us/tax/illinois', label: 'Illinois Tax Calculator' },
    ],
    relatedCalcs: [
      { to: '/us/salary', label: 'Salary Calculator' },
      { to: '/us/budget', label: 'Budget Planner' },
    ],
  },

  {
    country: 'us',
    calc: 'tax',
    slug: 'texas',
    title: 'Texas Income Tax Calculator 2026 — No State Tax + Federal',
    h1: 'Texas Income Tax Calculator 2026',
    metaDesc: 'Texas has no state income tax. Calculate federal-only tax for 2026. See what Texans pay instead: ~1.7% property tax, 8.25% sales tax, and federal rates.',
    intro: `Texas is one of nine US states with no state income tax — a major draw for high earners relocating from California, New York, or Illinois. If you live and work in Texas, your income is subject only to federal income tax, Social Security, and Medicare. There is no state withholding, no state return to file, and no state-level capital gains tax.

What Texans do pay instead: property taxes that are among the highest in the nation (effective average rate of 1.60–1.80% of assessed value, compared to California's Prop 13-capped ~0.75%). Sales tax in Texas is 6.25% state, with local jurisdictions adding up to 2% more — most major Texas cities are at the 8.25% combined cap. Texas also has the Franchise Tax (a form of business tax) for entities with gross receipts above $2.47 million.

The trade-off between no income tax and high property tax depends heavily on your situation. A renter with a $120,000 salary saves approximately $5,000–$8,000 per year versus living in California. A homeowner with a $500,000 home pays $8,000–$9,000/year in property taxes — offsetting much of the income tax saving. Use this calculator to estimate your total federal tax burden as a Texas resident.`,
    faqs: [
      {
        q: 'Does Texas really have no state income tax?',
        a: 'Correct — Texas has no personal state income tax. This is enshrined in the Texas Constitution (Article 8, Section 24), which prohibits a state income tax unless approved by voters and requires that any income tax revenue be used only for education and property tax relief. Texas funds its state government primarily through sales taxes, property taxes, and oil/gas severance taxes. You file only a federal tax return as a Texas resident.',
      },
      {
        q: 'How high are property taxes in Texas?',
        a: 'Texas property taxes are among the highest in the US. The statewide average effective rate is approximately 1.60–1.80% of market value, but individual county rates vary widely. Harris County (Houston) averages ~2.0%; Travis County (Austin) ~1.8%; Dallas County ~1.9%. On a $400,000 home, expect to pay $6,400–$8,000/year in property taxes. Texas offers a Homestead Exemption (at least $100,000 off assessed value for school district taxes for 2025+), senior exemptions ($10,000 off school district tax for those 65+), and a 10% annual cap on assessed value increases for homestead properties.',
      },
      {
        q: 'What is the Texas sales tax rate?',
        a: 'Texas state sales tax is 6.25%. Local governments (cities, counties, transit authorities, special districts) can add up to 2% in local sales tax, bringing the maximum combined rate to 8.25%. Most major cities — Houston, Dallas, San Antonio, Austin, Fort Worth — are at the 8.25% maximum. Groceries, prescription drugs, and farm equipment are generally exempt from Texas sales tax. The effective sales tax burden for a typical Texas household is $2,000–$3,500/year.',
      },
      {
        q: 'Is Texas really cheaper than California for high earners?',
        a: 'For most high earners, yes — but the gap narrows with homeownership. A single filer earning $200,000 saves roughly $15,000–$18,000/year in state income tax by living in Texas vs. California. However, a Texas homeowner with a $600,000 property pays ~$10,000/year in property taxes; a California homeowner in the same situation might pay $6,000–$7,500 (due to Prop 13 assessed value caps). The break-even depends on your income-to-home-value ratio, tenure in the home, and local service quality. Texas also has no estate or inheritance tax.',
      },
      {
        q: 'What is the Texas Franchise Tax?',
        a: 'The Texas Franchise Tax is a business privilege tax (not an income tax) on entities doing business in Texas with annualized total revenues above $2.47 million (2026 threshold). The rate is 0.75% of taxable margin for most businesses; 0.375% for retailers and wholesalers. Passive entities (holding companies) and sole proprietorships are exempt. The tax is filed annually by May 15. Businesses below the revenue threshold file a No Tax Due report but still must file.',
      },
    ],
    parentCalc: '/us/tax',
    relatedSubPages: [
      { to: '/us/tax/florida', label: 'Florida Tax Calculator' },
      { to: '/us/tax/california', label: 'California Tax Calculator' },
    ],
    relatedCalcs: [
      { to: '/us/salary', label: 'Salary Calculator' },
      { to: '/us/budget', label: 'Budget Planner' },
    ],
  },

  {
    country: 'us',
    calc: 'tax',
    slug: 'florida',
    title: 'Florida Income Tax Calculator 2026 — No State Tax + Federal',
    h1: 'Florida Income Tax Calculator 2026',
    metaDesc: 'Florida has no state income tax. See your federal-only tax for 2026. Florida residents pay ~1% property tax, 6% sales tax, and zero estate tax.',
    intro: `Florida is one of the most popular destinations for Americans escaping high-tax states, and the reason is simple: Florida has no personal state income tax, no state estate tax, and no state inheritance tax. This makes Florida particularly attractive for retirees with investment income, high-earning professionals, and anyone relocating from states like New York, California, or New Jersey.

As a Florida resident, your only income-based tax obligation is federal. Florida funds state services through its 6% base sales tax (with local surtaxes up to 2.5% in some counties — Miami-Dade is at 7%, Hillsborough at 8.5%), documentary stamp taxes on real estate transactions, and property taxes averaging approximately 0.80–1.10% of assessed value — meaningfully lower than Texas despite the similar no-income-tax structure.

Florida's Homestead Exemption reduces assessed value by $50,000 for school tax purposes ($25,000 full exemption + $25,000 additional exemption) for primary residences, and the Save Our Homes cap limits assessed value increases to 3% per year (or the CPI increase, whichever is lower) for established homeowners — a significant protection against rising property taxes in a fast-appreciating market.`,
    faqs: [
      {
        q: 'Does Florida have any state income tax at all?',
        a: 'No. Florida has no personal state income tax. The Florida Constitution (Article VII, Section 5) prohibits the imposition of personal income taxes. Florida does have a Corporate Income Tax at 5.5% on federal taxable income for C-corporations doing business in the state — but this does not affect individuals, LLC members, S-corp shareholders, or sole proprietors. As a Florida resident, you only file a federal Form 1040.',
      },
      {
        q: 'What is Florida\'s property tax rate?',
        a: 'Florida property taxes are set at the county/local level, not the state level. The statewide average effective rate is approximately 0.80–1.00% of market value, making Florida more affordable than Texas (1.60–1.80%) but higher than some low-tax western states. Miami-Dade County averages ~0.89%; Broward County ~1.07%; Palm Beach ~0.93%; Hillsborough ~0.95%. The Homestead Exemption saves most primary homeowners $500–$1,000/year in school taxes, and the Save Our Homes cap protects long-term residents from reassessment spikes.',
      },
      {
        q: 'What is Florida\'s sales tax rate?',
        a: 'Florida\'s state sales tax is 6%. Counties can add a local discretionary surtax ranging from 0.5% to 2.5%. Miami-Dade County is 7% total; Orange County (Orlando) is 6.5%; Hillsborough County is 8.5% (one of the highest). Florida exempts groceries, prescription drugs, and certain agricultural products from sales tax. Florida also has limited Sales Tax Holidays (e.g., back-to-school shopping, hurricane preparedness supplies) that temporarily exempt qualifying items.',
      },
      {
        q: 'Is Florida good for retirees from a tax perspective?',
        a: 'Florida is one of the most tax-friendly states for retirees. There is no state income tax on Social Security benefits, pension income, IRA/401(k) withdrawals, or investment income. There is no Florida estate tax or inheritance tax (Florida repealed its estate tax in 2004). Combined with the federal estate tax exemption ($13.99 million per individual for 2025), most Florida retirees pass their estate to heirs without any death taxes. The only major considerations are federal income tax on retirement distributions and property taxes on their home.',
      },
      {
        q: 'What does Florida spend tax revenue on without an income tax?',
        a: 'Florida raises over $40 billion annually primarily from: sales tax (~75% of state revenue), documentary stamp taxes (real estate transfer taxes at $0.70/$100 of consideration), communications services tax, fuel taxes, tourist development taxes, and federal transfers. Florida consistently ranks among the lower-spending states per capita for education and social services. Public universities charge relatively low in-state tuition. The trade-off is that Florida\'s public services (K-12 education per-pupil spending, Medicaid, transit) rank lower than high-tax states.',
      },
    ],
    parentCalc: '/us/tax',
    relatedSubPages: [
      { to: '/us/tax/texas', label: 'Texas Tax Calculator' },
      { to: '/us/tax/california', label: 'California Tax Calculator' },
    ],
    relatedCalcs: [
      { to: '/us/salary', label: 'Salary Calculator' },
      { to: '/us/budget', label: 'Budget Planner' },
    ],
  },

  {
    country: 'us',
    calc: 'tax',
    slug: 'illinois',
    title: 'Illinois Income Tax Calculator 2026 — Flat 4.95% State Rate',
    h1: 'Illinois Income Tax Calculator 2026',
    metaDesc: 'Calculate Illinois income tax for 2026. Flat 4.95% state rate. Covers federal tax, 10.25% Chicago sales tax, ~2.1% property taxes, and your true net pay.',
    intro: `Illinois has a flat state income tax rate of 4.95% — meaning every dollar of taxable income above the personal exemption ($2,625 for single filers in 2026) is taxed at the same rate, whether you earn $30,000 or $3 million. This makes Illinois one of 12 flat-tax states and simplifies state return filing considerably compared to states with multiple brackets.

However, flat state income tax is only part of the Illinois tax picture. Chicago residents face a combined sales tax rate of 10.25% (state 6.25% + county 1.75% + city 1.25% + Regional Transportation Authority 1.00%), among the highest in the nation. Cook County property taxes average approximately 2.10–2.50% of assessed value — with Chicago proper often even higher — making Illinois one of the highest property-tax states despite its moderate income tax.

Illinois residents also pay a separate 4.95% flat tax on retirement income, which is a notable exception to the common pattern of states exempting retirement distributions. However, Illinois does fully exempt Social Security benefits, most pension income from qualified retirement plans, and income from U.S. government obligations.`,
    faqs: [
      {
        q: 'What is the Illinois state income tax rate for 2026?',
        a: 'Illinois taxes all individual income at a flat 4.95% rate. There are no brackets — every dollar above the personal exemption is taxed identically. The personal exemption is $2,625 for single filers, $5,250 for married filing jointly, plus $2,625 per qualifying dependent. Illinois does not conform to many federal deductions — you cannot deduct mortgage interest or charitable contributions on your Illinois return. The Illinois return starts from federal adjusted gross income with Illinois-specific additions and subtractions.',
      },
      {
        q: 'Does Illinois tax retirement income?',
        a: 'Illinois has a notably complex retirement income picture. The state fully exempts: Social Security benefits, distributions from most qualified employer retirement plans (401k, 403b, pension), Illinois lottery winnings, and railroad retirement benefits. However, Illinois does tax: IRA distributions (if not rolled over from an employer plan), self-employed retirement plan distributions, and passive income. The Illinois exemption for employer-sponsored retirement plans is broader than most states, making it moderately retirement-friendly despite the flat tax.',
      },
      {
        q: 'How high are property taxes in Illinois?',
        a: 'Illinois has some of the highest property taxes in the United States. The statewide average effective rate is approximately 2.07% of market value — second only to New Jersey nationally. Cook County (Chicago metro) averages 2.10–2.50%. On a $350,000 home in Chicago, expect to pay $7,350–$8,750/year in property taxes. The Illinois property tax system is administered locally by townships and counties, with assessed values typically set at one-third of market value then multiplied by local equalization factors.',
      },
      {
        q: 'What is the Chicago combined sales tax rate?',
        a: 'The combined sales tax in Chicago is 10.25% as of 2026: Illinois state rate 6.25% + Cook County 1.75% + City of Chicago 1.25% + Regional Transportation Authority 1.00%. This is one of the highest combined sales tax rates for a major US city. Certain Chicago-specific taxes add further costs: Chicago restaurant tax (0.25% additional on food/beverage at eating establishments), streaming services tax (9%), and the Chicago personal property lease transaction tax on software/cloud services (9%).',
      },
      {
        q: 'Is there a way to reduce Illinois state income tax?',
        a: 'Illinois offers limited deductions but several credits: the Illinois Earned Income Credit (18% of federal EITC), Property Tax Credit (5% of Illinois property taxes paid, up to 5% of your income tax liability), K-12 Education Expense Credit (25% of qualifying education expenses up to $500 credit), and Residential Real Property Tax Credit. Illinois also allows a subtraction for contributions to Illinois 529 plans (Bright Start/Bright Directions) — up to $10,000/year for single filers, $20,000 for joint filers. These contributions reduce Illinois taxable income.',
      },
    ],
    parentCalc: '/us/tax',
    relatedSubPages: [
      { to: '/us/tax/new-york', label: 'New York Tax Calculator' },
      { to: '/us/tax/california', label: 'California Tax Calculator' },
    ],
    relatedCalcs: [
      { to: '/us/salary', label: 'Salary Calculator' },
      { to: '/us/budget', label: 'Budget Planner' },
    ],
  },

  {
    country: 'us',
    calc: 'tax',
    slug: 'washington',
    title: 'Washington State Income Tax Calculator 2026 — No Income Tax + Capital Gains',
    h1: 'Washington State Tax Calculator 2026',
    metaDesc: 'Washington has no income tax but taxes capital gains over $270K at 7%. Covers WA Cares Fund 0.58%, PFML, and sales tax up to 10.4% — 2026 rates.',
    intro: `Washington State has no personal income tax — but it is no longer a simple zero-income-tax state. In 2022, Washington enacted a 7% capital gains excise tax on the sale of long-term capital assets (stocks, bonds, business interests) when net gains exceed $270,000 per year. After a legal battle that reached the Washington Supreme Court (which upheld the tax in 2023), this tax is firmly in effect for 2026.

Washington also has two mandatory payroll programs that reduce take-home pay: the WA Cares Fund (long-term care insurance), which withholds 0.58% of all wages with no cap as of 2026, and the Paid Family and Medical Leave (PFML) program at a combined rate of 0.92% (employees pay 71.43% of this, or approximately 0.657%). These are not income taxes, but they meaningfully reduce net pay — particularly the WA Cares Fund which has no wage ceiling.

For most Washington residents earning wages under $270,000 with no major asset sales, the state tax burden remains primarily the 6.5% sales tax (with local additions up to 10.4% in Seattle), B&O (Business & Occupation) tax for self-employed individuals, and the payroll deductions above.`,
    faqs: [
      {
        q: 'What is Washington State\'s capital gains tax and who pays it?',
        a: 'Washington\'s 7% capital gains excise tax applies to net long-term capital gains above $270,000 per year (2026 threshold, adjusted annually for inflation). It applies to gains from stocks, bonds, partnership interests, and most business sales — but explicitly exempts: real estate (primary residence and investment property), retirement accounts (401k/IRA), agricultural land, timber/timber rights, and livestock. The tax is paid by Washington residents and non-residents who sell Washington-sourced assets. You file a WA capital gains return by April 18.',
      },
      {
        q: 'What is the WA Cares Fund and how much does it cost?',
        a: 'The WA Cares Fund is Washington\'s mandatory long-term care insurance program. The 2026 premium rate is 0.58% of all wages with no earnings cap — meaning a worker earning $200,000 pays $1,160/year into the fund. In return, eligible workers who need long-term care (after vesting: 3 years of 500+ hours/year, or 10 years total with 5 years without a break) can receive up to $36,500 in lifetime benefits (2026 amount, indexed to CPI). Exemptions exist for those with private long-term care insurance who opted out during the 2021–2023 window — but that opt-out window is now closed.',
      },
      {
        q: 'How does Washington\'s Paid Family and Medical Leave work?',
        a: 'Washington\'s PFML provides up to 12 weeks of paid family leave, 12 weeks of paid medical leave, and up to 16 weeks combined (18 weeks if pregnancy-related). Benefits pay up to 90% of weekly wages for lower earners, capped at $1,543/week (2026). The total 2026 premium rate is 0.92% of wages up to the Social Security wage base ($176,100). Employees pay 71.43% of the premium (approximately 0.657%); employers with 50+ employees pay 28.57%. Small employers (under 50) pay only the employer medical leave portion.',
      },
      {
        q: 'What is Washington\'s sales tax rate?',
        a: 'Washington state sales tax is 6.5%. Local jurisdictions (cities and counties) add between 0.5% and 4.1%, making some areas among the highest in the nation. Seattle\'s combined rate is 10.35%. Other major cities: Bellevue 10.3%, Spokane 8.9%, Tacoma 10.4%. Washington taxes most retail sales of goods and many services. Groceries are exempt from the state retail sales tax, but prepared food is taxed. Washington does not tax residential utilities.',
      },
      {
        q: 'What is the Washington B&O tax and who pays it?',
        a: 'Washington\'s Business and Occupation (B&O) tax is a gross receipts tax on the privilege of doing business in the state — it applies to revenue, not profit. This is significant: a business can owe B&O tax even when operating at a loss. Rates vary by classification: retail at 0.471%; service and other activities at 1.5%; manufacturing at 0.484%; wholesale at 0.484%. Self-employed individuals and sole proprietors are subject to B&O on their gross business receipts. There is a small business B&O tax credit that eliminates tax for businesses with annual gross income under $125,000.',
      },
    ],
    parentCalc: '/us/tax',
    relatedSubPages: [
      { to: '/us/tax/texas', label: 'Texas Tax Calculator' },
      { to: '/us/tax/florida', label: 'Florida Tax Calculator' },
    ],
    relatedCalcs: [
      { to: '/us/salary', label: 'Salary Calculator' },
      { to: '/us/budget', label: 'Budget Planner' },
    ],
  },

  // ─── US Salary sub-pages ──────────────────────────────────────────────────────
  {
    country: 'us',
    calc: 'salary',
    slug: 'hourly',
    title: 'Hourly to Salary Calculator USA 2026 — Annual & Monthly Pay',
    h1: 'Hourly to Annual Salary Calculator — USA 2026',
    metaDesc: 'Convert hourly wage to annual salary instantly for 2026. Uses the 2,080-hour standard, covers overtime, part-time hours, and the true value of benefits.',
    intro: `Converting an hourly wage to an annual salary sounds simple — multiply by 2,080 hours (40 hours/week × 52 weeks). But this formula misses overtime income, unpaid time off, variable hours, and the dramatically different value of hourly vs. salaried positions when you factor in benefits, schedule flexibility, and overtime eligibility.

The 2,080-hour standard assumes a full-time, 52-week year with no unpaid time off. In practice, most US workers take 5–15 days of vacation (sometimes unpaid), have sick days, and face holidays. A worker at $25/hour who takes 3 weeks unpaid actually earns $24,038/year, not $52,000. Conversely, an hourly worker who regularly gets 5 hours of overtime per week at 1.5× earns $60,125 — 15.6% more than the headline annual equivalent.

For part-time workers, the formula scales with actual hours. 20 hours/week at $25/hour = $26,000/year ($500/week). 30 hours/week = $39,000/year. Benefits complicate the comparison: employer-sponsored health insurance is worth $6,000–$20,000/year to the employee, employer 401(k) match another $2,000–$8,000. A $25/hour salaried job with full benefits may be worth $35–$40/hour equivalent compared to a $28/hour contractor with no benefits.`,
    faqs: [
      {
        q: 'How do I convert hourly to annual salary?',
        a: 'The standard formula is: hourly rate × 2,080 = annual salary (based on 40 hours/week × 52 weeks). Examples: $15/hour = $31,200/year; $20/hour = $41,600/year; $25/hour = $52,000/year; $30/hour = $62,400/year; $35/hour = $72,800/year; $50/hour = $104,000/year; $75/hour = $156,000/year; $100/hour = $208,000/year. For overtime weeks, add overtime hours × hourly rate × 1.5. For unpaid time off, subtract (days off × 8 × hourly rate).',
      },
      {
        q: 'What is the federal minimum wage in 2026?',
        a: 'The federal minimum wage remains $7.25/hour as of 2026 — unchanged since 2009. However, 31 states and many cities have enacted higher minimums. Notable 2026 state minimums: California $16.50/hour; New York $16.50/hour (NYC/LI/Westchester $17.00); Washington $16.66/hour; Colorado $14.81/hour; Massachusetts $15.00/hour; Illinois $15.00/hour. Many cities go higher — Seattle $19.97/hour; Denver $18.81/hour; San Jose $17.55/hour. Employers must pay the highest applicable minimum (federal, state, or local).',
      },
      {
        q: 'Do hourly workers qualify for overtime pay?',
        a: 'Under the federal Fair Labor Standards Act (FLSA), non-exempt hourly workers must receive at least 1.5× their regular rate for all hours over 40 in a workweek. Most hourly workers are non-exempt. Exempt employees (executives, professionals, administrative workers earning above $684/week — the 2026 federal salary threshold) are not entitled to federal overtime. Some states have additional overtime rules: California mandates overtime after 8 hours in a single workday (not just after 40 hours in a week), plus double time after 12 hours in a day.',
      },
      {
        q: 'What is the value of benefits in hourly vs salary comparison?',
        a: 'Benefits are a critical part of total compensation that pure hourly comparisons miss. Employer-sponsored health insurance: $6,000–$20,000/year depending on plan and coverage level. Employer 401(k) match: typically 3–6% of salary = $1,800–$4,800 on a $60,000 salary. Paid time off: 10 days = 3.85% of annual pay; 20 days = 7.7%. Dental/vision: $500–$1,500/year. Life and disability insurance: $200–$600/year. Total benefits package for a mid-level employee is commonly $15,000–$35,000/year — add this to the base salary when comparing against contract or gig rates.',
      },
      {
        q: 'How is hourly pay converted to biweekly or monthly?',
        a: 'Standard conversions: Hourly to weekly: × 40 hours. Hourly to biweekly (every 2 weeks): × 80 hours. Hourly to semi-monthly (twice per month, 24 times/year): × 86.67 hours (2,080 ÷ 24). Hourly to monthly: × 173.33 hours (2,080 ÷ 12). Example at $25/hour: weekly $1,000; biweekly $2,000; semi-monthly $2,166.67; monthly $4,333.33; annual $52,000. Note that biweekly (26 pay periods) and semi-monthly (24 pay periods) give different per-period amounts even though the annual total is the same.',
      },
    ],
    parentCalc: '/us/salary',
    relatedSubPages: [
      { to: '/us/salary/overtime', label: 'Overtime Pay Calculator' },
    ],
    relatedCalcs: [
      { to: '/us/tax', label: 'Income Tax Calculator' },
      { to: '/us/budget', label: 'Budget Planner' },
    ],
  },

  {
    country: 'us',
    calc: 'salary',
    slug: 'overtime',
    title: 'Overtime Pay Calculator USA 2026 — FLSA Rules & Weekly Earnings',
    h1: 'Overtime Pay Calculator — USA 2026',
    metaDesc: 'Calculate overtime pay under FLSA 2026 rules. 1.5× after 40 hrs/week; daily overtime in CA. Covers exemptions, blended rates, and weekly gross earnings.',
    intro: `Federal overtime law under the Fair Labor Standards Act (FLSA) requires employers to pay non-exempt employees at least 1.5 times their regular rate of pay for all hours worked beyond 40 in a single workweek. A workweek is any fixed 168-hour period — it does not need to align with the calendar week, and overtime cannot be averaged across two weeks (e.g., 30 hours one week + 50 hours the next does not eliminate the 10 overtime hours in week two).

The "regular rate of pay" is not simply the hourly rate — it includes commissions, non-discretionary bonuses, shift differentials, and on-call pay, but excludes discretionary bonuses, gifts, and expense reimbursements. This means that if you earn a $500 weekly non-discretionary production bonus and work 50 overtime hours, your overtime rate must be calculated on your total regular compensation ÷ total hours, not just the base hourly rate.

California adds daily overtime requirements that go beyond federal law: overtime (1.5×) after 8 hours in a day, double time (2×) after 12 hours in a day, and double time for all hours worked on the 7th consecutive day in a workweek. Some other states (Nevada, Alaska, Colorado) also have daily overtime rules. Always apply whichever rule — state or federal — results in greater pay to the employee.`,
    faqs: [
      {
        q: 'Who is exempt from overtime pay under the FLSA?',
        a: 'Employees are exempt from FLSA overtime if they meet both a salary basis test and a duties test. The salary threshold is $684/week ($35,568/year) for most exemptions (executive, administrative, professional — "white collar" exemptions). Highly compensated employees (HCE) are exempt at $107,432/year with a minimal duties test. Exemptions include: executive employees managing 2+ employees; administrative employees with genuine discretion; learned/creative professionals; computer employees; outside sales employees (no salary threshold). The Department of Labor periodically updates these thresholds.',
      },
      {
        q: 'How do I calculate overtime pay with a blended hourly rate?',
        a: 'When a worker is paid different rates for different types of work in the same week, the "weighted average" method applies. Step 1: Add up all straight-time earnings for all hours at all rates. Step 2: Divide total straight-time earnings by total hours worked to get the "regular rate." Step 3: Multiply the regular rate by 0.5 (the "half-time" premium) by the number of overtime hours. The reason you multiply by 0.5 (not 1.5) is that you\'ve already paid straight time for those hours in step 1. Example: 32 hours at $20 ($640) + 12 hours at $25 ($300) = $940 straight time ÷ 44 hours = $21.36 regular rate. Overtime premium = $21.36 × 0.5 × 4 OT hours = $42.72 extra.',
      },
      {
        q: 'Does overtime apply to salaried workers?',
        a: 'Yes, if the salaried worker is classified as non-exempt. Just having a salary does not automatically mean exempt status — the employee must pass both the salary level test ($684/week+) and the duties test. A salaried non-exempt employee\'s regular rate equals their weekly salary divided by actual hours worked that week. For a $1,000/week salaried worker who works 50 hours in a week: regular rate = $1,000 ÷ 50 = $20/hour; overtime owed = $20 × 0.5 × 10 hours = $100 additional. Misclassifying non-exempt workers as exempt is one of the most common and costly FLSA violations.',
      },
      {
        q: 'What are California\'s overtime rules that differ from federal?',
        a: 'California overtime rules (Labor Code §510) are more protective than federal FLSA: (1) Daily overtime: 1.5× for hours 8–12 in a single workday; (2) Double time: 2× for hours beyond 12 in a single workday; (3) Seventh-day overtime: 1.5× for the first 8 hours on the 7th consecutive day in the workweek; 2× for hours beyond 8 on the 7th day. California also requires overtime on the first day of an alternative workweek schedule if hours exceed the agreed schedule. California\'s regular rate calculation rules also differ slightly from federal rules in how certain compensation is included.',
      },
      {
        q: 'Can my employer give me comp time instead of overtime pay?',
        a: 'In the private sector, comp time (compensatory time off) cannot legally replace overtime pay under the FLSA. Private employers must pay overtime in cash (or equivalent) in the pay period when overtime is earned. Government employers can offer comp time to their employees instead of overtime pay under specific conditions. Some employees agree informally to "flex time" arrangements — working extra hours one week and fewer hours another — but this is only legal if it stays within a single workweek (overtime cannot be averaged across weeks). Formal alternative workweek schedules (like California\'s 4×10 schedule) must be properly voted on and approved.',
      },
    ],
    parentCalc: '/us/salary',
    relatedSubPages: [
      { to: '/us/salary/hourly', label: 'Hourly to Salary Calculator' },
    ],
    relatedCalcs: [
      { to: '/us/tax', label: 'Income Tax Calculator' },
      { to: '/us/budget', label: 'Budget Planner' },
    ],
  },

  // ─── UK Tax/Salary sub-pages ──────────────────────────────────────────────────
  {
    country: 'uk',
    calc: 'tax',
    slug: 'self-employed',
    title: 'Self-Employed Tax Calculator UK 2026 — NI, Income Tax & Self-Assessment',
    h1: 'Self-Employed Tax Calculator UK 2026',
    metaDesc: 'Calculate UK self-employed tax for 2026/27. Class 2 & 4 NI, income tax, payments on account, allowable expenses, and self-assessment deadlines explained.',
    intro: `Being self-employed in the UK means you pay income tax and National Insurance differently from employees. Instead of PAYE (Pay As You Earn), you pay tax through self-assessment — filing a tax return by 31 January each year for the previous tax year (6 April to 5 April). You also pay two classes of National Insurance: Class 2 NI at £3.45/week (2026/27) if profits exceed £12,570, and Class 4 NI at 9% on profits between £12,570 and £50,270, then 2% above £50,270.

The key tax-reducing strategy for the self-employed is maximizing allowable business expenses. These reduce your taxable profit before any tax is calculated. Allowable expenses include: office costs (rent, utilities, equipment), travel expenses (excluding commuting), stock and materials, marketing and advertising, accountant and professional fees, bank charges, training directly relevant to your current business, and a proportion of home costs if you work from home.

Self-assessment also introduces payments on account — a system where HMRC requires you to pay estimated tax for the current year in two installments (31 January and 31 July) based on the previous year's liability. For new self-employed workers, the first tax bill can be 1.5× the expected amount (current year's tax + first payment on account for next year), which can be a cash-flow shock.`,
    faqs: [
      {
        q: 'What National Insurance do self-employed people pay in the UK?',
        a: 'Self-employed individuals in the UK pay two types of NI for 2026/27: Class 2 NI is £3.45/week (£179.40/year) if annual profits are at or above the Small Profits Threshold of £12,570. Class 4 NI is 9% on profits between £12,570 and £50,270, then 2% on profits above £50,270. Class 4 NI is calculated on your self-assessment return and paid with your income tax. Unlike employees, self-employed people do not pay Class 1 NI and do not get employer NI contributions on their behalf — this means your NI bill is lower in absolute terms but you receive the same state pension entitlement.',
      },
      {
        q: 'What expenses can I deduct as self-employed in the UK?',
        a: 'HMRC allows deductions for expenses that are "wholly and exclusively" for business purposes. Key categories: office/workshop rent and utilities; travel costs (business mileage at 45p/mile for first 10,000 miles, 25p/mile thereafter, or actual vehicle costs); stock, materials, and equipment (or capital allowances for assets over £1,000); staff costs; professional services (accountant, solicitor); insurance; advertising and website costs; bank charges and interest; training costs. Working from home: you can claim a flat rate (£26/month for 101+ hours worked from home per month) or a proportion of actual home costs. You cannot deduct personal entertainment, clothing (unless a uniform/protective gear), or commuting.',
      },
      {
        q: 'What are payments on account for self-assessment?',
        a: 'If your previous year\'s self-assessment tax and Class 4 NI bill was over £1,000 (and more than 20% of tax wasn\'t deducted at source), HMRC requires you to make payments on account toward your current year\'s liability. Each payment on account is 50% of the prior year\'s bill, due 31 January and 31 July. Any balance owed (after the two payments on account) is due the following 31 January with your tax return. Example: you owe £4,000 for 2025/26. You also make two £2,000 payments on account for 2026/27 (due January 2026 and July 2026). In January 2027, you settle any shortfall for 2026/27 and set new payments on account for 2027/28.',
      },
      {
        q: 'When are self-assessment deadlines in the UK?',
        a: 'Key self-assessment deadlines: 5 October — register for self-assessment if you are newly self-employed (to avoid late registration penalties). 31 October — paper tax return deadline for the previous tax year (e.g., 31 October 2026 for the 2025/26 tax year). 31 January — online tax return deadline AND payment of any balance owed AND first payment on account for the current tax year. 31 July — second payment on account. Late filing penalties start at £100, escalating to £900+ after 12 months. Late payment interest accrues at the Bank of England base rate + 2.5%.',
      },
      {
        q: 'Do I charge VAT as a self-employed person in the UK?',
        a: 'You must register for VAT if your taxable turnover exceeds £90,000 in any rolling 12-month period (2026/27 threshold). Below this, VAT registration is optional (voluntary registration can be beneficial if you have significant VAT-able expenses). Once registered, you charge VAT (standard rate 20%, reduced rate 5%, zero rate 0% depending on goods/services) to your customers, and reclaim VAT on business purchases. You submit quarterly VAT returns via Making Tax Digital (MTD) compliant software. Cash accounting scheme (available if turnover under £1.35 million) lets you account for VAT when you receive/pay, not when invoiced.',
      },
    ],
    parentCalc: '/uk/tax',
    relatedSubPages: [
      { to: '/uk/salary/take-home', label: 'UK Take-Home Pay Calculator' },
    ],
    relatedCalcs: [
      { to: '/uk/salary', label: 'Salary Calculator' },
      { to: '/uk/budget', label: 'Budget Planner' },
    ],
  },

  {
    country: 'uk',
    calc: 'salary',
    slug: 'take-home',
    title: 'UK Take-Home Pay Calculator 2026 — After Tax & NI Net Salary',
    h1: 'UK Take-Home Pay Calculator 2026',
    metaDesc: 'Calculate UK take-home pay after income tax and NI for 2026/27. Covers PAYE, personal allowance taper at £100K, student loan plans 1/2/4, and pensions.',
    intro: `Your UK take-home pay depends on more than just your income tax band. The full picture includes National Insurance contributions (Class 1), any student loan repayments (Plan 1, 2, 4, or Postgraduate), pension contributions (under auto-enrolment or voluntary), and the progressive withdrawal of your Personal Allowance above £100,000.

For 2026/27, the Personal Allowance remains £12,570. Income tax rates are: 20% (basic rate) on £12,571–£50,270; 40% (higher rate) on £50,271–£125,140; 45% (additional rate) above £125,140. Employee Class 1 NI: 8% on weekly earnings between £242 and £967 (£12,570–£50,270 annually); 2% on earnings above £967/week.

The Personal Allowance taper is one of the most impactful — and least understood — features of the UK tax system. For income between £100,000 and £125,140, your Personal Allowance is reduced by £1 for every £2 of income above £100,000, creating an effective marginal tax rate of 60% in that band. Pension contributions and Gift Aid payments can reduce income below £100,000 and restore the full Personal Allowance — potentially saving £5,028 in tax (12,570 × 40%).`,
    faqs: [
      {
        q: 'What are the UK income tax rates and bands for 2026/27?',
        a: 'UK income tax rates for 2026/27 (England, Wales, Northern Ireland): Personal Allowance £12,570 at 0%; Basic Rate 20% on £12,571–£50,270 (taxable income, i.e., above the Personal Allowance); Higher Rate 40% on £50,271–£125,140; Additional Rate 45% on income above £125,140. The Personal Allowance is reduced by £1 for every £2 of adjusted net income above £100,000, disappearing entirely at £125,140. Scotland has its own bands: Starter (19%), Basic (20%), Intermediate (21%), Higher (42%), Advanced (45%), and Top (48%) applied to different thresholds.',
      },
      {
        q: 'How does National Insurance work for employees in 2026?',
        a: 'Employee Class 1 National Insurance for 2026/27: 8% on weekly earnings between the Primary Threshold (£242/week, equivalent to £12,570/year) and the Upper Earnings Limit (£967/week, equivalent to £50,270/year). 2% on all earnings above £967/week. There is no NI on earnings below the Primary Threshold. Employer Class 1 NI (not deducted from your pay) is 13.8% on earnings above the Secondary Threshold. NI is calculated weekly/monthly (not annually), so irregular income within the year can result in different NI bills vs. the same annual salary earned evenly.',
      },
      {
        q: 'How do student loan repayments affect take-home pay in the UK?',
        a: 'Student loan repayments are deducted via PAYE along with tax and NI. Repayment rates and thresholds by plan: Plan 1 (pre-2012 England/Wales, all Northern Ireland): 9% above £24,990/year. Plan 2 (2012–2022 England/Wales students): 9% above £27,295/year. Plan 4 (Scotland): 9% above £31,395/year. Plan 5 (England/Wales from 2023+): 9% above £25,000/year. Postgraduate Loan: 6% above £21,000/year. Multiple loan plans can apply simultaneously (e.g., Plan 2 + Postgraduate = 15% combined above the respective thresholds). Student loan repayments are not tax-deductible and do not reduce your income for tax purposes.',
      },
      {
        q: 'How does pension contribution affect my take-home pay?',
        a: 'Pension contributions (to workplace pensions under auto-enrolment, or personal pensions) reduce your taxable income, providing immediate tax relief. Under auto-enrolment, minimum contributions are 5% employee + 3% employer = 8% total on qualifying earnings (£6,240–£50,270 band for 2026/27). Your 5% employee contribution costs you less than 5% of gross pay: a basic rate taxpayer pays only 4% net (tax relief adds 1%); a higher rate taxpayer pays 3% net (tax relief + NI saving). Salary sacrifice pension arrangements can also save employee NI contributions. Contributions above £60,000/year (2026/27 annual allowance) or 100% of earnings trigger a tax charge.',
      },
      {
        q: 'What is the 60% marginal tax rate trap in the UK?',
        a: 'Between £100,000 and £125,140 of income, the UK effective marginal tax rate is 60%. This happens because: (1) you pay 40% Higher Rate tax on each extra £1 earned, AND (2) your £12,570 Personal Allowance is withdrawn at £1 per £2 of income above £100,000 — effectively taxing an additional 20% on the income that the lost allowance would have sheltered. The result: earning £125,140 instead of £100,000 means paying 60% marginal tax on that £25,140. The practical solution: make pension contributions or Gift Aid donations to bring adjusted net income below £100,000 and reclaim the full Personal Allowance, saving up to £5,028 in tax.',
      },
    ],
    parentCalc: '/uk/salary',
    relatedSubPages: [
      { to: '/uk/tax/self-employed', label: 'Self-Employed Tax Calculator' },
    ],
    relatedCalcs: [
      { to: '/uk/tax', label: 'Tax Calculator' },
      { to: '/uk/budget', label: 'Budget Planner' },
    ],
  },

  // ─── CA Mortgage sub-pages ────────────────────────────────────────────────────
  {
    country: 'ca',
    calc: 'mortgage',
    slug: 'alberta',
    title: 'Alberta Mortgage Calculator 2026 — No Land Transfer Tax + CMHC',
    h1: 'Alberta Mortgage Calculator 2026',
    metaDesc: 'Calculate your Alberta mortgage for 2026. No land transfer tax saves buyers thousands. Covers CMHC rules, property tax rates (~0.65%), and closing costs.',
    intro: `Alberta is unique among Canada's major provinces in having no provincial land transfer tax — a significant saving for homebuyers. In Ontario, a buyer of a $700,000 home pays approximately $10,475 in provincial land transfer tax (plus another $10,150 in Toronto's municipal LTT if buying in the city). In BC, the same buyer pays $14,000 in PTT. In Alberta, that tax is $0, leaving more cash available for the down payment, closing costs, or home improvements.

Alberta follows the same federal CMHC mortgage insurance rules as all provinces: if your down payment is less than 20%, you must purchase CMHC insurance (2.80%–4.00% of the loan amount depending on your LTV). Calgary's average home price of approximately $580,000 (2026) means most first-time buyers are putting 5%–10% down, making CMHC insurance a near-universal cost.

Property taxes in Alberta are set municipally. Calgary's 2026 residential mill rate results in an effective rate of approximately 0.64% of assessed value — low by national standards. Edmonton is similar at approximately 0.87%. This means a $600,000 Calgary home generates roughly $3,840/year in property taxes ($320/month). Alberta has no provincial income tax on the first dollar of income in the sense of having the lowest flat rate in Canada — 10% on income up to $148,269 for 2026.`,
    faqs: [
      {
        q: 'Does Alberta have a land transfer tax?',
        a: 'No. Alberta is one of only three jurisdictions in Canada without a provincial land transfer tax (along with Saskatchewan and rural Nova Scotia). Alberta charges only a small Land Title Transfer Fee administered by the Alberta Land Titles Office. The fee is $50 + $2 per $5,000 of the property value for the title transfer (approximately $290 on a $600,000 home) plus a separate mortgage registration fee of $50 + $1.50 per $5,000 of the mortgage amount (approximately $230 on a $500,000 mortgage). Total: under $600 versus thousands in other provinces.',
      },
      {
        q: 'What are CMHC mortgage insurance rules for Alberta buyers?',
        a: 'CMHC rules are federally uniform across all provinces including Alberta. You need CMHC insurance if your down payment is less than 20% and the purchase price is under $1.5 million. Premiums: 4.00% on 5%–9.99% down; 3.10% on 10%–14.99% down; 2.80% on 15%–19.99% down. The premium is added to your mortgage. In Alberta, PST does not apply on CMHC premiums (unlike Ontario, Manitoba, Quebec, Saskatchewan) — another modest saving. Alberta\'s average detached home price of ~$580,000 in Calgary means a 5% down payment ($29,000) triggers a $22,040 CMHC premium on the $551,000 insured loan.',
      },
      {
        q: 'What are property tax rates in Calgary and Edmonton?',
        a: 'Alberta property taxes are set annually by each municipality. In Calgary, the 2026 residential property tax rate results in an effective combined rate (city + provincial education levy) of approximately 0.63–0.68% of assessed value. On a $600,000 home: approximately $3,780–$4,080/year ($315–$340/month). Edmonton\'s combined rate is approximately 0.85–0.90% of assessed value — slightly higher due to greater infrastructure spending. Alberta does not have a provincial property tax in the same sense as other provinces; education is funded through a provincial education property tax levy collected alongside municipal taxes.',
      },
      {
        q: 'What other closing costs should Alberta homebuyers budget for?',
        a: 'Beyond the land title transfer fee (under $600), Alberta buyers should budget for: home inspection ($400–$600); legal/solicitor fees ($1,000–$2,000); title insurance ($150–$400); property tax adjustments at closing (proration of prepaid property taxes); GST on new construction (5% of purchase price, partially rebated for homes under $450,000); CMHC insurance premium (if applicable); moving costs; and any condominium status certificate review ($200–$400). Budget 1.5%–3% of the purchase price for total closing costs excluding CMHC insurance.',
      },
      {
        q: 'How does the Alberta First-Time Home Buyer Incentive work in 2026?',
        a: 'The federal First Home Buyer Incentive program (shared equity mortgage with CMHC) was discontinued after March 2024. However, first-time Alberta buyers can still access: the federal First Home Savings Account (FHSA) — $8,000/year contribution room (lifetime max $40,000) with full tax deductibility and tax-free qualifying withdrawals; the RRSP Home Buyers\' Plan — borrow up to $60,000 from your RRSP tax-free, repay over 15 years; and the First-Time Home Buyers\' Tax Credit — $10,000 federal claim resulting in a $1,500 tax reduction. There is no separate Alberta provincial first-time buyer program.',
      },
    ],
    parentCalc: '/ca/mortgage',
    relatedSubPages: [
      { to: '/ca/mortgage/bc', label: 'BC Mortgage Calculator' },
      { to: '/ca/mortgage/cmhc-insurance', label: 'CMHC Insurance Calculator' },
    ],
    relatedCalcs: [
      { to: '/ca/affordability', label: 'Affordability Calculator' },
      { to: '/ca/tax/alberta', label: 'Alberta Tax Calculator' },
    ],
  },

  {
    country: 'ca',
    calc: 'mortgage',
    slug: 'bc',
    title: 'BC Mortgage Calculator 2026 — Property Transfer Tax + CMHC',
    h1: 'BC Mortgage Calculator 2026',
    metaDesc: 'Calculate your BC mortgage for 2026. Covers PTT 1%/2%/3%/5%, foreign buyer tax, first-time buyer exemptions up to $835K, and CMHC on high Vancouver prices.',
    intro: `British Columbia has the most expensive real estate in Canada and one of its most complex home purchase tax structures. The BC Property Transfer Tax (PTT) applies to every property purchase and is calculated in tiers: 1% on the first $200,000; 2% on $200,001–$2,000,000; 3% on $2,000,001–$3,000,000; 5% on amounts above $3,000,000 (for residential property). On a $1,000,000 Metro Vancouver home, PTT alone is $18,000 — a significant upfront cost not included in the mortgage.

First-time buyers in BC receive a PTT exemption on purchases up to $500,000 (full exemption) with a partial exemption on the $500,001–$835,000 range. This saves qualifying first-time buyers up to $8,000. The property must be used as the buyer's principal residence and they must be a Canadian citizen or permanent resident who has never owned a principal residence anywhere in the world.

CMHC insurance interacts with BC's high prices in a critical way: for any purchase price above $1,000,000, CMHC insurance is not available — meaning a minimum 20% down payment ($200,000+ on a $1M home) is required. For Metro Vancouver where the benchmark detached price exceeds $1.8 million, most buyers must bring substantial down payments. Condos and townhouses in Vancouver average $700,000–$900,000, where CMHC insurance is still accessible.`,
    faqs: [
      {
        q: 'How much is BC Property Transfer Tax on a $800,000 home?',
        a: 'On an $800,000 BC property purchase, the PTT is calculated as: 1% on the first $200,000 = $2,000; plus 2% on the remaining $600,000 = $12,000. Total PTT = $14,000. This is due at closing and cannot be rolled into the mortgage. First-time buyers can claim a PTT exemption: full exemption under $500,000 (saves up to $8,000); partial exemption for $500,001–$835,000. On an $800,000 purchase as a first-time buyer: the partial exemption reduces the PTT significantly — approximately $6,720 PTT versus $14,000 for a non-first-time buyer.',
      },
      {
        q: 'Does BC have a foreign buyer tax on real estate?',
        a: 'Yes. BC\'s Additional Property Transfer Tax (commonly called the foreign buyer tax or foreign buyers\' tax) is 20% of the fair market value of residential property in designated areas (Metro Vancouver, Fraser Valley, Capital Regional District, Kelowna, Nanaimo, and others) for foreign nationals, foreign corporations, and taxable trustees. The tax is applied in addition to standard PTT. For a $1,000,000 property, the foreign buyer tax would be $200,000. Canadian citizens, permanent residents, and certain protected persons are exempt. The tax has been a significant factor in Metro Vancouver housing policy since 2016.',
      },
      {
        q: 'What is BC\'s speculation and vacancy tax?',
        a: 'The BC Speculation and Vacancy Tax (SVT) applies to residential properties in Metro Vancouver, Greater Victoria, Kelowna, and several other areas. BC residents who use the property as their principal residence and rent it out for at least 6 months per year are exempt. For foreign owners and satellite family members (families with most income earned outside Canada), the rate is 2% of assessed value per year. For Canadian citizens/permanent residents who are not BC residents, the rate is 0.5%. BC residents who leave property vacant pay 0.5%. The tax is designed to bring vacant homes onto the rental market.',
      },
      {
        q: 'How does the CMHC insurance cap affect Vancouver buyers?',
        a: 'CMHC insured mortgages are available only on properties with a purchase price below $1,500,000 (the 2025 update to the cap, up from $1 million). For purchases of $1.5 million or more, a minimum 20% down payment is required by law. In Metro Vancouver where detached homes average $1.8M–$2.5M, this means buyers need $360,000–$500,000 as a down payment. Even condo buyers face this: if the purchase price is between $1M and $1.5M, the minimum down payment is 20% but CMHC insurance is now available. Prices between $500,000 and $1.5M require the sliding scale minimum down payment (5% on the first $500K + 10% on the remainder).',
      },
      {
        q: 'What are the typical closing costs for a BC home purchase?',
        a: 'BC closing costs beyond PTT: Legal/notary fees $1,200–$2,500; home inspection $400–$700; title insurance $200–$500; property tax adjustments (proration at closing); strata documents review ($200–$500 if buying a strata/condo); GST on new construction (5%, partially rebated for new homes under $450,000); moving costs; CMHC insurance premium (if under 20% down). Total closing costs (excluding PTT and CMHC) typically run $3,000–$6,000. Including PTT on an $800,000 purchase ($14,000 for non-first-timers) and CMHC insurance if applicable, budget $20,000–$30,000 in transaction costs beyond the down payment.',
      },
    ],
    parentCalc: '/ca/mortgage',
    relatedSubPages: [
      { to: '/ca/mortgage/alberta', label: 'Alberta Mortgage Calculator' },
      { to: '/ca/mortgage/cmhc-insurance', label: 'CMHC Insurance Calculator' },
    ],
    relatedCalcs: [
      { to: '/ca/affordability', label: 'Affordability Calculator' },
      { to: '/ca/tax/bc', label: 'BC Tax Calculator' },
    ],
  },

  // ─── AU sub-pages ─────────────────────────────────────────────────────────────
  {
    country: 'au',
    calc: 'mortgage',
    slug: 'lmi',
    title: 'LMI Calculator Australia 2026 — Lenders Mortgage Insurance Cost',
    h1: 'Lenders Mortgage Insurance (LMI) Calculator — Australia 2026',
    metaDesc: 'Calculate LMI cost in Australia 2026. LMI required when LVR exceeds 80%. Helia/QBE rates, loan capitalization, and First Home Guarantee waiver explained.',
    intro: `Lenders Mortgage Insurance (LMI) is required in Australia when your deposit is less than 20% of the property's purchase price — meaning your Loan to Value Ratio (LVR) exceeds 80%. LMI protects the lender (not you) if you default and the property sale doesn't cover the outstanding loan balance. Despite protecting the lender, the premium is paid entirely by the borrower.

LMI in Australia is primarily provided by two insurers: Helia (formerly Genworth) and QBE LMI. Premiums are calculated as a percentage of the loan amount and vary by LVR and loan size. At 95% LVR (5% deposit), LMI typically costs 2.5%–4.5% of the loan amount for a standard loan. On a $600,000 loan at 95% LVR, LMI might be $15,000–$27,000. Most lenders allow you to capitalize (add) the LMI premium to your loan — meaning you don't pay it upfront, but you do pay interest on it over the loan term.

Several lenders offer LMI waivers for certain professions — doctors, lawyers, accountants, engineers, and some other high-income professionals can often borrow up to 90% LVR (sometimes 95%) without paying LMI, subject to meeting income and employment criteria. The First Home Guarantee (FHBG) scheme also allows eligible first home buyers to purchase with as little as 5% deposit without paying LMI, with the government guaranteeing up to 15% of the purchase price.`,
    faqs: [
      {
        q: 'How is LMI calculated in Australia?',
        a: 'LMI premiums are calculated based on the loan amount and LVR. They are not a flat rate — the premium increases significantly as LVR rises. Approximate 2026 premium ranges (as a percentage of loan amount): LVR 80.01–85%: ~0.5–1.0%; LVR 85.01–90%: ~1.0–2.0%; LVR 90.01–95%: ~2.5–4.5%; LVR above 95%: ~4.5–6.0%. These premiums also vary between Helia and QBE, and different lenders use different insurers. Stamp duty applies to LMI premiums in some states (NSW, VIC, ACT) — an additional 9–10% of the LMI premium. The capitalized LMI amount is then subject to mortgage interest over the loan term, significantly increasing the true cost.',
      },
      {
        q: 'Can I avoid LMI in Australia?',
        a: 'Yes, through several avenues: (1) Save a 20%+ deposit (80% LVR or below) — the most common path; (2) Use a guarantor (family pledge) where a family member\'s property equity secures the shortfall, allowing you to borrow at higher LVR without LMI; (3) Access the First Home Guarantee (FHBG) — 35,000 places per year for eligible first home buyers with 5% deposit, government guarantees 15%; (4) Family Home Guarantee for single parents (5,000 places, 2% deposit); (5) Profession-specific LMI waivers offered by lenders to eligible medical, legal, and financial professionals; (6) Lenders Mortgage Protection offered by some smaller lenders at lower premiums than standard LMI.',
      },
      {
        q: 'What is the First Home Guarantee (FHBG) and who qualifies?',
        a: 'The First Home Guarantee (FHBG), formerly the First Home Loan Deposit Scheme, allows eligible first home buyers to purchase with a 5% deposit without paying LMI — the government guarantees up to 15% of the property value via Housing Australia. 2026/27 eligibility: Australian citizen/PR; first home buyer (never owned property in Australia previously, including as a joint owner); income test ($125,000 for singles, $200,000 for couples); property price caps vary by location (e.g., $900,000 in Sydney/Melbourne, $800,000 in Brisbane, $600,000 regional NSW). 35,000 places available per financial year via participating lenders (major banks and smaller lenders).',
      },
      {
        q: 'Is LMI refundable if I refinance or sell quickly?',
        a: 'LMI is generally not transferable or refundable when you refinance to a new lender — even if only a short time has passed. If you refinance with the same lender, some LMI providers (Helia, QBE) offer a portability benefit where you only pay the incremental LMI premium rather than a full new premium, subject to conditions. If you sell the property and the loan is fully repaid, no refund is given. Given that LMI is capitalized into the loan and you\'re paying interest on it, the true cost of LMI becomes even higher if you refinance quickly after purchase and must pay LMI again. This "LMI penalty" on refinancing is a significant consideration when choosing initial loan terms.',
      },
      {
        q: 'What LVR do Australian lenders allow without LMI?',
        a: 'Most Australian lenders set 80% as the standard LVR threshold for LMI-free borrowing. Some lenders allow up to 85% LVR without LMI for very low-risk borrowers (excellent credit, high income, stable employment in certain professions). For medical professionals (doctors, dentists, specialists, vets), many major lenders (NAB, ANZ, Westpac, CBA, Macquarie) offer LMI-free lending up to 90% LVR — and some up to 95% — with no LMI, subject to minimum income requirements (often $90,000–$150,000+ for eligible professions). The logic: these borrowers have very low default rates and high income stability.',
      },
    ],
    parentCalc: '/au/mortgage',
    relatedSubPages: [
      { to: '/au/tax/superannuation', label: 'Superannuation Calculator' },
    ],
    relatedCalcs: [
      { to: '/au/affordability', label: 'Affordability Calculator' },
      { to: '/au/salary', label: 'Salary Calculator' },
    ],
  },

  {
    country: 'au',
    calc: 'tax',
    slug: 'superannuation',
    title: 'Superannuation Calculator Australia 2026 — Super Balance & Tax',
    h1: 'Superannuation Calculator Australia 2026',
    metaDesc: 'Calculate your super balance in Australia for 2026. Covers 11.5% SG rate, $30K concessional cap, 15% contributions tax, and retirement projections.',
    intro: `Superannuation is Australia's mandatory retirement savings system, and for most working Australians it is their largest financial asset after their home. In 2026, the Superannuation Guarantee (SG) rate is 11.5% — meaning your employer must contribute 11.5% of your ordinary time earnings into your nominated super fund on top of your salary. The SG rate increases to 12% from 1 July 2025, where it is legislated to remain.

The tax treatment of superannuation is highly concessional. Employer SG contributions and voluntary salary-sacrificed (concessional) contributions are taxed at only 15% within the fund — far below most workers' marginal income tax rate. The 2026/27 concessional contributions cap is $30,000/year. For high-income earners (income + concessional contributions above $250,000), an additional 15% Division 293 tax applies, bringing contributions tax to 30%. Non-concessional (after-tax) contributions are capped at $120,000/year (or $360,000 using the bring-forward rule over 3 years).

At retirement (preservation age 60 for those born after 1964), withdrawals from a taxed super fund are completely tax-free for members aged 60 and over. This tax-free status on both growth and withdrawals makes maximising super contributions — particularly via salary sacrifice in your highest-earning years — one of the most powerful legal tax strategies available to Australian residents.`,
    faqs: [
      {
        q: 'What is the Superannuation Guarantee rate in 2026?',
        a: 'The Superannuation Guarantee (SG) rate is 11.5% for 2025/26 (year ending 30 June 2026), rising to 12% from 1 July 2026 (for the 2026/27 year). This means your employer must contribute 11.5% (soon 12%) of your ordinary time earnings into your super fund. SG contributions must be paid at least quarterly — by 28 October, 28 January, 28 April, and 28 July. Employers who fail to pay on time face the Superannuation Guarantee Charge (SGC), which includes a 10% penalty and administration fees. Most employees can track their super contributions via myGov.',
      },
      {
        q: 'What are the 2026 superannuation contribution caps?',
        a: 'For 2026/27: Concessional contributions cap: $30,000/year. This includes your employer\'s SG contributions + any salary sacrifice + personal deductible contributions. Exceeding the cap incurs excess concessional contributions tax at your marginal rate (less a 15% offset). Non-concessional contributions cap: $120,000/year (after-tax contributions with no deduction). The bring-forward rule allows up to $360,000 over 3 years if your total super balance (TSB) is below $1.9 million. Total Super Balance of $1.68M–$1.9M reduces the non-concessional cap proportionally; above $1.9M means no non-concessional contributions allowed.',
      },
      {
        q: 'How is tax applied inside a superannuation fund?',
        a: 'Superannuation accumulation funds pay tax at 15% on: concessional contributions received; investment income (interest, dividends, rent); and capital gains (reduced to 10% effective rate for assets held more than 12 months via the 1/3 CGT discount). Fund expenses and franking credits reduce this tax. The 15% rate is concessional compared to most members\' marginal tax rates. High earners (adjusted income + concessional contributions > $250,000) pay an additional 15% Division 293 tax on their concessional contributions (total 30%). In pension phase (retirement), super funds pay 0% tax on income and capital gains supporting pension payments.',
      },
      {
        q: 'What is a Self-Managed Super Fund (SMSF) and who should consider one?',
        a: 'An SMSF is a private superannuation fund you manage yourself (up to 6 members, typically family). Benefits: control over investment strategy (including direct property, unlisted assets, individual shares); potential cost efficiency for larger balances (typically needs $250,000+ to be cost-effective); flexibility in estate planning and pension structuring. Costs: annual audit ($1,500–$3,000), administration software ($1,500–$3,000), ASIC registration, tax return ($500–$1,500). Total annual costs: $4,000–$8,000+. Trustees have significant legal responsibilities and compliance obligations under the SIS Act — SMSF penalties for breaches can be severe. Most financial advisers suggest SMSFs are appropriate for balances above $500,000.',
      },
      {
        q: 'When can I access my superannuation in Australia?',
        a: 'Superannuation is preserved until you reach your preservation age and meet a condition of release. Preservation age: born before 1 July 1960 = 55; born 1 July 1960–30 June 1961 = 56; rising by 1 year to 60 for those born on or after 1 July 1964. For most Australians working today, preservation age is 60. Conditions of release: retirement (stopping gainful employment after preservation age); turning 65 (regardless of employment status); permanent incapacity; terminal medical condition; death (paid to beneficiaries); severe financial hardship (limited access); compassionate grounds (ATO approval). Early access without meeting conditions is illegal and subject to severe penalties.',
      },
    ],
    parentCalc: '/au/tax',
    relatedSubPages: [
      { to: '/au/mortgage/lmi', label: 'LMI Calculator Australia' },
    ],
    relatedCalcs: [
      { to: '/au/salary', label: 'Salary Calculator' },
      { to: '/au/budget', label: 'Budget Planner' },
    ],
  },

  // ─── US Mortgage sub-pages ────────────────────────────────────────────────────
  {
    country: 'us',
    calc: 'mortgage',
    slug: 'fha-loan',
    title: 'FHA Loan Calculator USA 2026 — MIP, Limits & 3.5% Down Payment',
    h1: 'FHA Loan Calculator — USA 2026',
    metaDesc: 'Calculate your FHA loan payment for 2026. Covers 3.5% down, upfront MIP 1.75%, annual MIP 0.55–1.05%, 2026 loan limits, and FHA vs conventional comparison.',
    intro: `FHA loans — insured by the Federal Housing Administration — are the most popular low-down-payment mortgage option in the United States for buyers who don't qualify for conventional financing. The key advantages: minimum 3.5% down payment (for credit scores 580+), more flexible debt-to-income ratio limits (typically 43–57%), and more lenient credit score requirements than conventional loans.

The cost of FHA's lower barrier to entry is mortgage insurance premium (MIP). Unlike conventional PMI which drops off once you reach 20% equity, FHA MIP is permanent for most borrowers: if you put less than 10% down, MIP lasts the life of the loan. Upfront MIP is 1.75% of the loan amount (added to the loan balance at closing). Annual MIP ranges from 0.55% to 1.05% of the loan balance depending on loan term, LTV, and loan size — paid monthly as part of your mortgage payment.

For 2026, FHA loan limits (set by county) range from $524,225 in low-cost areas to $1,209,750 in high-cost areas (same ceiling as conforming jumbo limits). These limits were updated in January 2026. FHA loans require the property to be the borrower's primary residence; investment properties and vacation homes are ineligible.`,
    faqs: [
      {
        q: 'What is the minimum credit score for an FHA loan in 2026?',
        a: 'The FHA sets a minimum credit score of 580 for the 3.5% down payment program. Borrowers with credit scores between 500 and 579 can still get an FHA loan but must put down at least 10%. Borrowers below 500 are ineligible for FHA financing. Individual lenders often apply "overlays" — stricter minimums than FHA requires — so many FHA lenders require 620–640 in practice. Credit unions and some community banks may be more flexible. With a 580+ score and 3.5% down, the FHA program is one of the most accessible mortgage options available.',
      },
      {
        q: 'How much does FHA mortgage insurance cost?',
        a: 'FHA mortgage insurance has two components. Upfront MIP (UFMIP): 1.75% of the loan amount, paid at closing or financed into the loan. On a $350,000 loan, UFMIP = $6,125. Annual MIP: charged monthly and added to your payment. For loans with less than 10% down and a term over 15 years, annual MIP is typically 0.55% to 1.05% depending on loan size and LTV. For a $350,000 loan at 0.55% annual MIP = $1,925/year ($160/month). Unlike conventional PMI, FHA annual MIP cannot be cancelled if you put less than 10% down — it lasts for the full loan term. With 10%+ down, MIP cancels after 11 years.',
      },
      {
        q: 'What are the FHA loan limits for 2026?',
        a: 'FHA loan limits are set annually by county. For 2026: the national "floor" limit is $524,225 for a single-family home in low-cost areas. The national "ceiling" in high-cost areas (such as San Francisco, New York City, Los Angeles, Seattle, Denver) is $1,209,750 for a single-family home. Alaska and Hawaii have higher limits. Multi-unit properties have higher limits: up to $2,326,875 for a 4-unit property in high-cost areas. Check the HUD website for your specific county\'s FHA limit. If you need to borrow above the FHA limit, you\'d need a conventional jumbo loan.',
      },
      {
        q: 'Can I refinance out of an FHA loan to drop MIP?',
        a: 'Yes — refinancing from an FHA loan to a conventional loan is one of the most common mortgage refinance strategies. Once you have 20% equity (either through payments, appreciation, or both), you can refinance to a conventional loan and eliminate MIP entirely. The conventional loan will require a new appraisal to confirm value. If your home has appreciated significantly since purchase, you may reach 20% equity faster than your amortization schedule suggests. A rule of thumb: if you can get a conventional rate within 0.25–0.50% of your current FHA rate AND eliminate MIP, refinancing is likely worthwhile even with closing costs.',
      },
      {
        q: 'What is the FHA debt-to-income ratio limit?',
        a: 'FHA\'s standard DTI limits are 31% front-end (housing expenses ÷ gross income) and 43% back-end (all monthly debts ÷ gross income). However, FHA allows DTIs up to 57% for borrowers with compensating factors: large reserves (3+ months PITI in savings), excellent credit history (no late payments in 12 months), minimal payment increase, or significant residual income. Automated underwriting (TOTAL Scorecard) can approve loans with higher DTIs when strong compensating factors exist. In practice, FHA lenders often approve borrowers with back-end DTIs of 50–55% who would be declined for conventional financing.',
      },
    ],
    parentCalc: '/us/mortgage',
    relatedSubPages: [
      { to: '/us/mortgage/va-loan', label: 'VA Loan Calculator' },
      { to: '/us/mortgage/pmi-calculator', label: 'PMI Calculator' },
    ],
    relatedCalcs: [
      { to: '/us/affordability', label: 'Affordability Calculator' },
      { to: '/us/tax', label: 'Tax Calculator' },
    ],
  },

  {
    country: 'us',
    calc: 'mortgage',
    slug: 'va-loan',
    title: 'VA Loan Calculator USA 2026 — $0 Down, Funding Fee & Eligibility',
    h1: 'VA Loan Calculator — USA 2026',
    metaDesc: 'Calculate your VA loan payment for 2026. Zero down, no PMI, funding fee 1.25–3.30%, rates 0.25–0.5% below conventional. See eligibility and true costs.',
    intro: `VA loans — guaranteed by the U.S. Department of Veterans Affairs — are widely regarded as the best mortgage product available in the United States for those who qualify. The core benefits: no down payment required, no private mortgage insurance (PMI), competitive interest rates (typically 0.25–0.50% below conventional rates), no prepayment penalty, and more flexible underwriting than conventional loans. The only significant cost is the VA funding fee — a one-time charge that replaces PMI and helps fund the VA program.

For 2026, the VA funding fee for first-time use (purchase loans) is 1.25% with 10%+ down, 1.25% with 5–9.99% down, and 2.15% with no down payment. For subsequent use (borrowers who have used VA benefits before), the no-down-payment funding fee is 3.30%. The funding fee can be financed into the loan. Certain veterans (those with a service-connected disability rating of 10%+ and surviving spouses of veterans who died in service or from service-connected disability) are exempt from the funding fee entirely.

VA loan eligibility requires a Certificate of Eligibility (COE) and minimum active duty service: 90 consecutive days during wartime; 181 days during peacetime; 6 years in the National Guard or Reserves; or being the surviving spouse of a veteran. There is no VA loan limit for eligible borrowers with full entitlement — you can borrow as much as a lender will approve without a down payment requirement.`,
    faqs: [
      {
        q: 'Who is eligible for a VA home loan in 2026?',
        a: 'VA loan eligibility is based on military service requirements. You may be eligible if you are: an active duty service member with 90+ continuous days of service; a veteran with 90 days wartime service or 181 days peacetime service; a National Guard or Reserve member with 6 years of service (or 90 days under Title 32 orders); a surviving spouse of a veteran who died in service or from a service-connected disability (and you have not remarried); or a spouse of a service member missing in action or a prisoner of war. You obtain a Certificate of Eligibility (COE) through the VA, your lender, or at VA.gov. Some veterans may have reduced entitlement from a prior VA loan — a lender can help calculate remaining entitlement.',
      },
      {
        q: 'What is the VA funding fee and when is it waived?',
        a: 'The VA funding fee is a one-time charge that helps sustain the VA loan program. 2026 rates for purchase loans: Down payment under 5% — first use 2.15%, subsequent use 3.30%. Down payment 5%–9.99% — first use 1.50%, subsequent use 1.50%. Down payment 10%+ — first use 1.25%, subsequent use 1.25%. The fee is completely waived for: veterans receiving VA disability compensation; veterans eligible for compensation but receiving retirement pay; surviving spouses of veterans who died in service or from service-connected disability; Purple Heart recipients on active duty; active duty service members who have received a proposed or memorandum rating of disability. The waiver saves thousands — on a $400,000 loan at 2.15%, that\'s an $8,600 saving.',
      },
      {
        q: 'Do VA loans have a loan limit in 2026?',
        a: 'For veterans with full VA entitlement (who have never used a VA loan, or whose previous VA loan has been fully paid off and entitlement restored), there is no VA loan limit — the VA will guarantee any loan amount that the lender approves, with no down payment requirement. For veterans with partial/remaining entitlement (who have an active VA loan or unreitored entitlement from a prior loan), the VA loan limit in their county determines how much additional VA benefit is available. County limits match the conventional conforming loan limits ($806,500 base; up to $1,209,750 in high-cost areas for 2026). Borrowing above the limit with remaining entitlement requires a down payment on the excess.',
      },
      {
        q: 'How do VA loan interest rates compare to conventional rates?',
        a: 'VA loans typically offer interest rates 0.25%–0.75% below conventional 30-year fixed rates for comparable borrowers. This is because the VA guarantee (the government backs 25% of the loan) significantly reduces lender risk. At a $350,000 loan amount, a 0.50% rate advantage saves approximately $116/month and $41,700 in total interest over 30 years — far exceeding the funding fee cost for most borrowers. VA loans are also more competitively priced than FHA loans in most cases. The exact rate depends on your credit score, loan amount, and lender — always get at least 3–4 quotes from VA-approved lenders.',
      },
      {
        q: 'What are the VA minimum property requirements (MPRs)?',
        a: 'VA loans require the property to meet Minimum Property Requirements (MPRs) that ensure the home is safe, sound, and sanitary. The VA appraisal reviews MPRs including: roofing that prevents moisture entry; no active wood-destroying insect infestations or damage; working heating system; no lead-based paint hazards (for homes built before 1978); safe and adequate electrical system; working plumbing; no evidence of structural problems; adequate space for living, sleeping, and sanitation. Homes with significant deferred maintenance, foundation issues, or code violations may not meet MPRs. Unlike FHA, VA appraisals can often be more flexible — the key is that the home must be "move-in ready" from a safety standpoint.',
      },
    ],
    parentCalc: '/us/mortgage',
    relatedSubPages: [
      { to: '/us/mortgage/fha-loan', label: 'FHA Loan Calculator' },
      { to: '/us/mortgage/pmi-calculator', label: 'PMI Calculator' },
    ],
    relatedCalcs: [
      { to: '/us/affordability', label: 'Affordability Calculator' },
      { to: '/us/tax', label: 'Tax Calculator' },
    ],
  },

  // ─── CA Tax sub-pages ─────────────────────────────────────────────────────────
  {
    country: 'ca',
    calc: 'tax',
    slug: 'alberta',
    title: 'Alberta Income Tax Calculator 2026 — Lowest Provincial Tax in Canada',
    h1: 'Alberta Income Tax Calculator 2026',
    metaDesc: 'Calculate Alberta income tax for 2026. No PST, lowest provincial rates in Canada, 10% flat base rate, carbon tax rebate, and no provincial payroll tax.',
    intro: `Alberta consistently has the lowest overall tax burden of any province in Canada, driven by three structural advantages: no provincial sales tax (PST), no provincial payroll tax, and income tax rates that are competitive even among provinces with PST. The Alberta Advantage — as it's known — means a $100,000 income earner keeps approximately $3,000–$6,000 more per year in Alberta than in Ontario or BC after all taxes.

For 2026, Alberta's provincial income tax brackets are: 10% on the first $148,269; 12% on $148,270–$177,922; 13% on $177,923–$237,230; 14% on $237,231–$355,845; 15% above $355,845. The Alberta Personal Amount is $21,827 (2026), reducing the taxable income base for all Albertans. Alberta has no surtax, no health premium, and no employer health tax — simplifying payroll considerably.

The Alberta Carbon Tax Rebate (formally the Canada Carbon Rebate, paid federally to provinces under the federal backstop) delivers quarterly payments to Alberta residents: approximately $225/quarter for single adults in 2026 (amounts adjust annually). This partially offsets the federal carbon pricing that Albertans pay on fuel and home heating, though the net economic impact of carbon pricing varies by household energy consumption and commuting patterns.`,
    faqs: [
      {
        q: 'What are the Alberta provincial income tax brackets for 2026?',
        a: 'Alberta 2026 provincial income tax rates: 10% on the first $148,269; 12% on $148,270–$177,922; 13% on $177,923–$237,230; 14% on $237,231–$355,845; 15% on income above $355,845. Alberta does not have a surtax (unlike Ontario or PEI). The Alberta Personal Amount of $21,827 provides a 10% credit = $2,182.70 reduction in Alberta tax. Combined with the federal Basic Personal Amount ($16,129) and federal tax rates, a $100,000 earner in Alberta has an effective total tax rate (federal + provincial, including CPP and EI) of approximately 26–28%.',
      },
      {
        q: 'Does Alberta have a provincial sales tax?',
        a: 'No. Alberta is the only province in Canada with no provincial sales tax (PST). Residents pay only the federal 5% GST on most goods and services. This makes Alberta\'s consumption tax significantly lower than other provinces: Ontario\'s 13% HST, BC\'s 12% GST+PST, Quebec\'s 14.975% GST+QST, Manitoba\'s 12% HST, and Saskatchewan\'s 11% GST+PST. For a household spending $60,000/year on taxable goods and services, the absence of PST saves approximately $4,200–$5,400 annually compared to Ontario or BC. This is a major real disposable income advantage for Alberta families.',
      },
      {
        q: 'What is the Alberta Canada Carbon Rebate amount for 2026?',
        a: 'The Canada Carbon Rebate (CCR) for Alberta residents in 2026 (paid quarterly April, July, October, January) is approximately $225/quarter for the first adult, $112.50/quarter for a spouse or partner, $56.25/quarter per child under 19. A family of four receives approximately $450/quarter ($1,800/year). There is also a 20% rural supplement for Albertans who live outside Census Metropolitan Areas, recognizing greater fuel dependence. These amounts change annually with the carbon price. The federal carbon price in 2026 is $80/tonne of CO₂ equivalent.',
      },
      {
        q: 'Are there any Alberta-specific tax credits I should know about?',
        a: 'Key Alberta provincial credits and programs: Alberta Personal Amount non-refundable credit ($21,827 × 10% = $2,182.70 reduction in AB tax); Alberta Seniors Benefit (income-tested benefit for low-income seniors, up to $4,481/year for a single senior or $7,083 for a couple); Alberta Child and Family Benefit (ACFB) — up to $2,885/year for families with children under 18 with income under $33,675, phasing out to zero at higher incomes; Alberta Centennial Education Savings Plan (ACES) grants (previously available, currently on hold). No Alberta dividend tax credit applies to eligible Canadian dividends (unlike other provinces) — actually Alberta does offer a dividend tax credit; consult the CRA provincial rates.',
      },
      {
        q: 'How does Alberta\'s resource revenue reduce the need for taxes?',
        a: 'Alberta\'s provincial government receives substantial royalty revenue from oil sands, conventional oil and gas, and other resource extraction — historically $8–$20+ billion/year depending on commodity prices. This revenue has historically allowed Alberta to fund public services at competitive levels while maintaining the lowest overall tax structure in Canada. The Heritage Savings Trust Fund (established 1976) holds accumulated resource savings of approximately $18–$20 billion. However, Alberta\'s dependence on volatile resource revenue creates fiscal cyclicality — budget surpluses in high-price years and deficits when oil prices fall — which has led to periodic discussions about introducing a PST or other stable revenue sources.',
      },
    ],
    parentCalc: '/ca/tax',
    relatedSubPages: [
      { to: '/ca/tax/bc', label: 'BC Tax Calculator' },
      { to: '/ca/tax/ontario', label: 'Ontario Tax Calculator' },
    ],
    relatedCalcs: [
      { to: '/ca/salary', label: 'Salary Calculator' },
      { to: '/ca/mortgage/alberta', label: 'Alberta Mortgage Calculator' },
    ],
  },

  {
    country: 'ca',
    calc: 'tax',
    slug: 'bc',
    title: 'BC Income Tax Calculator 2026 — Provincial Brackets + Carbon Tax',
    h1: 'BC Income Tax Calculator 2026',
    metaDesc: 'Calculate BC income tax for 2026. Covers 7 BC brackets (5.06–20.50%), carbon tax, $400 renter\'s credit, and combined federal + BC marginal rates by income.',
    intro: `British Columbia has a seven-bracket progressive income tax system with 2026 rates ranging from 5.06% to 20.50%. Combined with federal tax, the top BC marginal rate is 53.50% on income above $252,752 — among the highest in the country, though slightly below Ontario's top effective rate when surtax is included.

For 2026, BC's provincial tax brackets are: 5.06% on the first $47,937; 7.70% on $47,938–$95,875; 10.50% on $95,876–$110,076; 12.29% on $110,077–$133,664; 14.70% on $133,665–$181,232; 16.80% on $181,233–$252,752; 20.50% above $252,752. BC's Basic Personal Amount for 2026 is $11,981. BC also levies a Speculation and Vacancy Tax on certain residential properties and a Employer Health Tax (EHT) on employers with payroll above $1.5 million (not a direct employee deduction).

The BC Carbon Tax is levied at the federal minimum rate of $80/tonne CO₂e in 2026 on fossil fuels. For BC residents not subject to the federal carbon backstop (BC has its own system that predates the federal one), the provincial carbon tax applies directly. BC residents receive a BC Climate Action Tax Credit — up to $540/year for a single adult ($270 semi-annually in January and July, income-tested). The credit phases out starting at $41,071 for singles and $50,170 for families.`,
    faqs: [
      {
        q: 'What are the BC provincial income tax brackets for 2026?',
        a: 'BC 2026 provincial income tax rates: 5.06% on the first $47,937; 7.70% on $47,938–$95,875; 10.50% on $95,876–$110,076; 12.29% on $110,077–$133,664; 14.70% on $133,665–$181,232; 16.80% on $181,233–$252,752; 20.50% on income above $252,752. BC\'s Basic Personal Amount is $11,981 for 2026, providing a non-refundable credit of $606 (at the 5.06% rate). Combined federal + BC top marginal rate: 20.50% (BC) + 33% (federal) = 53.50% — applying to income above $252,752.',
      },
      {
        q: 'What is the BC Renter\'s Tax Credit?',
        a: 'BC introduced a Renter\'s Tax Credit starting with the 2023 tax year, providing eligible renters with a refundable tax credit of up to $400/year. Eligibility: BC resident who paid rent for a principal residence in BC during the tax year; income below approximately $60,000 (the credit phases out above that threshold). The credit is refundable, meaning you receive it even if you owe no provincial tax. It is claimed on your BC income tax return. For 2025 and later years, the credit amount and thresholds may be updated — check the BC government website for current amounts when filing.',
      },
      {
        q: 'How does BC\'s carbon tax work and how does it differ from the federal system?',
        a: 'BC introduced Canada\'s first carbon tax in 2008 and has its own provincial carbon pricing system. BC\'s carbon tax applies to fossil fuel purchases at the point of sale. For 2026, BC\'s carbon tax is aligned with the federal benchmark at $80/tonne CO₂e. In practical terms: gasoline adds approximately $0.1784/litre; natural gas adds $0.1555/cubic metre; diesel adds $0.2211/litre. BC uses revenue from its carbon tax for tax reductions and the Climate Action Tax Credit. Unlike the federal backstop (which issues rebates as Canada Carbon Rebates), BC provides the Climate Action Tax Credit through the income tax system — up to $540 for a single adult, income-tested.',
      },
      {
        q: 'Does BC have a provincial health premium or payroll tax on employees?',
        a: 'BC abolished the Medical Services Plan (MSP) premiums for individuals in January 2020. Employees no longer pay a provincial health premium. BC does have an Employer Health Tax (EHT) on employers: exempt for payroll under $1.5 million; 2.925% of payroll above $1.5 million (reduced rate applies between $1.5M–$1.95M). The EHT is paid by employers and is not deducted from employee wages. This is different from Ontario\'s Employer Health Tax structure. BC employees do not have a separate provincial disability insurance premium deducted from wages (unlike Ontario\'s WSIB/EHT which operates differently).',
      },
      {
        q: 'What are the combined federal + BC marginal tax rates by income in 2026?',
        a: 'Combined federal + BC marginal rates for a BC resident in 2026: up to ~$16,129: 0% (personal amounts reduce tax to nil); $16,130–$47,937: approximately 20.06% (15% federal + 5.06% BC); $47,938–$57,375: approximately 22.70%; $57,376–$95,875: approximately 28.20%; $95,876–$110,076: approximately 33.00%; $110,077–$111,733: approximately 33.29%; $111,734–$133,664: approximately 45.80%; $133,665–$155,625: approximately 48.20%; $155,626–$181,232: approximately 51.20%; $181,233–$252,752: approximately 53.80%; above $252,752: approximately 53.50% (the 20.50% BC rate plus 33% federal). The effective (average) rate is significantly lower than these marginal rates.',
      },
    ],
    parentCalc: '/ca/tax',
    relatedSubPages: [
      { to: '/ca/tax/alberta', label: 'Alberta Tax Calculator' },
      { to: '/ca/tax/ontario', label: 'Ontario Tax Calculator' },
    ],
    relatedCalcs: [
      { to: '/ca/salary', label: 'Salary Calculator' },
      { to: '/ca/mortgage/bc', label: 'BC Mortgage Calculator' },
    ],
  },

  // ─── IE Mortgage sub-pages ────────────────────────────────────────────────────
  {
    country: 'ie',
    calc: 'mortgage',
    slug: 'first-time-buyer',
    title: 'First-Time Buyer Mortgage Calculator Ireland 2026 — Help-to-Buy & HTB',
    h1: 'First-Time Buyer Mortgage Calculator — Ireland 2026',
    metaDesc: 'First-time buyer mortgage calculator Ireland 2026. Help-to-Buy up to €30,000, Central Bank 4× income limit, First Home Scheme, and 10% deposit rules.',
    intro: `First-time buyers in Ireland face some of Europe's most restrictive mortgage rules alongside targeted government supports. The Central Bank of Ireland's macroprudential rules limit mortgage borrowing to 4× gross annual income for first-time buyers purchasing a primary residence (a change from the previous 3.5× limit, effective from January 2023). This means a couple earning €120,000 combined can borrow up to €480,000 — a significant improvement but still challenging given Dublin's average new home price of €400,000–€500,000.

The Help-to-Buy (HTB) scheme is the primary government support for first-time buyers purchasing new builds or self-builds. It provides a refund of income tax and DIRT paid over the previous four years, up to a maximum of €30,000 or 10% of the property value (whichever is less). To access the full €30,000, you need to have paid at least €30,000 in income tax/DIRT over the past 4 years and be purchasing a new home valued at €300,000 or more. HTB is not available for second-hand homes.

The First Home Scheme (launched 2022) is a shared equity scheme where the State and participating banks take an equity stake in your home — up to 30% of the purchase price — allowing you to bridge the gap between your deposit+mortgage and the property price without additional monthly payments. The State's equity share is repaid when you sell, refinance, or after 30 years. The Mortgage Credit Guarantee Scheme enables lenders to offer mortgages with deposits as low as 10% to eligible first-time buyers, with the government providing a partial guarantee.`,
    faqs: [
      {
        q: 'What are the Central Bank mortgage rules for first-time buyers in Ireland?',
        a: 'The Central Bank of Ireland\'s macroprudential mortgage rules for first-time buyers (as of January 2023): Loan-to-Income (LTI) limit of 4× gross annual income. So a couple with combined income of €100,000 can borrow up to €400,000. Loan-to-Value (LTV) limit: first-time buyers can borrow up to 90% of the property value — meaning a minimum 10% deposit is required. For a €400,000 home, the deposit needed is €40,000. A limited number of "allowances" (exceptions) are permitted by lenders — up to 15% of new lending to FTBs can exceed the LTI limit; up to 5% can exceed the LTV limit.',
      },
      {
        q: 'How does the Help-to-Buy (HTB) scheme work in 2026?',
        a: 'The Help-to-Buy scheme provides a refund of income tax and DIRT paid in the previous 4 tax years, up to the lower of: €30,000; or 10% of the purchase price of a qualifying property. Qualifying properties: new builds or self-builds with a purchase price not exceeding €500,000 (for 2026). The property must be your first home and your principal private residence. You must take out a mortgage of at least 70% of the purchase price. The HTB refund is paid directly to the developer for new builds, or to your bank account for self-builds. Application is through Revenue\'s myAccount portal. The scheme is currently extended through 31 December 2029.',
      },
      {
        q: 'What is the First Home Scheme in Ireland?',
        a: 'The First Home Scheme is a shared equity initiative introduced in 2022. The State (via the Housing Agency) and participating mortgage lenders take a shared equity stake in your home to bridge the gap between your deposit+mortgage and the purchase price. Maximum equity stake: 30% from the State; the total combined stake (State + lender) cannot exceed 30% for most purchases. Available on new builds up to €500,000 in most counties; higher limits apply in Dublin, Wicklow, Kildare, Meath, Cork city. No monthly repayments on the equity stake — but the State shares in the property\'s capital appreciation when you sell or refinance. You can buy out the equity stake at any time.',
      },
      {
        q: 'What are typical mortgage rates for first-time buyers in Ireland in 2026?',
        a: 'Irish mortgage rates have moved significantly with ECB base rate changes. As of 2026, with the ECB deposit rate in the 2.5%–3.5% range, fixed mortgage rates in Ireland for first-time buyers typically range from 3.5%–5.0% depending on the lender, fixed term, and LTV. Key Irish mortgage lenders: Bank of Ireland, AIB/EBS, Permanent TSB, Haven, Finance Ireland, Avant Money, ICS Mortgages. Avant Money and Avant/Revolut have been offering competitive fixed rates. Always use a mortgage broker — Irish broker fees are often paid by the lender, not the borrower, and they have access to rates not available to the public.',
      },
      {
        q: 'What is the Fresh Start principle for Irish mortgage borrowers?',
        a: 'The Fresh Start principle in Ireland\'s Central Bank rules means that certain borrowers who have previously owned property may be treated as first-time buyers for mortgage lending purposes. Specifically, people who have previously owned property but no longer have a financial interest in it due to: separation or divorce (the property was awarded to the ex-spouse/partner and you have no beneficial interest); insolvency arrangements (the property was repossessed or surrendered as part of an insolvency/bankruptcy process). Fresh Start applicants benefit from the same 4× LTI and 90% LTV limits as genuine first-time buyers, rather than the 3.5× LTI and 80% LTV limits that apply to second-time buyers.',
      },
    ],
    parentCalc: '/ie/mortgage',
    relatedSubPages: [],
    relatedCalcs: [
      { to: '/ie/affordability', label: 'Affordability Calculator' },
      { to: '/ie/tax', label: 'Tax Calculator' },
      { to: '/ie/salary', label: 'Salary Calculator' },
    ],
  },

  // ─── UK Mortgage sub-pages ────────────────────────────────────────────────────
  {
    country: 'uk',
    calc: 'mortgage',
    slug: 'fixed-vs-variable',
    title: 'Fixed vs Variable Mortgage UK 2026 — 2-Year vs 5-Year vs Tracker',
    h1: 'Fixed vs Variable Mortgage Calculator — UK 2026',
    metaDesc: 'Compare UK fixed vs variable mortgage rates for 2026. 2-yr vs 5-yr fixed vs SVR vs tracker. BOE base rate impact, ERCs, and when to fix vs float explained.',
    intro: `Choosing between a fixed and variable mortgage in the UK is one of the most consequential financial decisions homeowners face, and the "right" answer depends on the interest rate environment, your risk tolerance, how long you plan to stay in the property, and the size of the rate differential. In 2026, with the Bank of England base rate having moved significantly from its 2023 peak of 5.25%, the fixed vs. variable calculus has changed substantially.

Fixed-rate mortgages guarantee your monthly payment for the fixed term — typically 2 or 5 years in the UK, though 3, 7, and 10-year fixes exist. The advantage: complete certainty on payments regardless of BOE rate moves. The cost: Early Repayment Charges (ERCs) of 1%–5% of the outstanding balance if you repay or remortgage during the fixed period. Five-year fixes generally offer a slightly higher rate than 2-year fixes because they provide longer protection, and lenders price this certainty premium in.

Variable rate mortgages — tracker mortgages (set at BOE base rate + a margin, e.g., base rate + 1.5%) and Standard Variable Rates (SVRs, set at lender discretion and typically 5%–8% in 2026) — move with market conditions. Trackers usually have no or low ERCs, offering flexibility to remortgage if rates fall without penalty. SVRs are what you revert to at the end of a fixed or tracker deal if you don't remortgage — they are almost always the worst rate available from your lender and should be actively avoided.`,
    faqs: [
      {
        q: 'Should I get a 2-year or 5-year fixed mortgage in the UK in 2026?',
        a: 'The 2-year vs 5-year decision hinges on your view of interest rates, your plans to move or remortgage, and your risk tolerance. In 2026, if the BOE base rate is expected to fall further, a 2-year fix may allow you to refinance at a lower rate sooner. A 5-year fix provides longer payment certainty and is typically priced 0.1%–0.5% higher than a 2-year fix. Rule of thumb: if the rate differential between 2-year and 5-year is under 0.25%, the 5-year often makes sense for the certainty. If the gap is 0.50%+, the 2-year is more likely to be cheaper in total. Factor in ERC implications if you might sell or remortgage within the fixed period.',
      },
      {
        q: 'What is an Early Repayment Charge (ERC) on a UK mortgage?',
        a: 'An ERC is a penalty charged by the lender if you repay or significantly overpay your mortgage during the fixed or discounted period. ERCs typically range from 1%–5% of the outstanding mortgage balance and are tiered — higher in earlier years of the fixed term. Example: a 5-year fix might charge 5% ERC in year 1, 4% in year 2, 3% in year 3, 2% in year 4, 1% in year 5. On a £250,000 mortgage, a 3% ERC = £7,500. Most fixed-rate mortgages allow overpayments of up to 10% of the outstanding balance per year without triggering an ERC — use this to reduce your balance and future interest without the penalty.',
      },
      {
        q: 'How does a tracker mortgage work in the UK?',
        a: 'A tracker mortgage is a variable rate mortgage where your interest rate is set at a defined margin above the Bank of England base rate, tracking it automatically. If the BOE base rate changes, your mortgage rate changes immediately (typically from the next monthly payment). Example: BOE base rate 4.25% + your margin 1.25% = your rate 5.50%. If BOE cuts to 3.75%, your rate drops to 5.00%. Trackers usually have lower or no ERCs, offering flexibility. "Lifetime trackers" track the base rate for the entire mortgage term. "Short-term trackers" (2–3 years) operate similarly to fixed deals in term length but with variable rate. The risk: if the BOE raises rates, your payments increase without notice.',
      },
      {
        q: 'What is a Standard Variable Rate (SVR) and should I stay on it?',
        a: 'The SVR is the lender\'s default mortgage rate — what you\'re automatically moved to when your fixed or tracker deal ends. SVRs are set at the lender\'s complete discretion, move independently of the BOE base rate, and are almost always significantly higher than available remortgage rates. In 2026, typical UK lender SVRs range from 6.5% to 8.5%. On a £200,000 mortgage, the difference between a competitive 2-year fix at 4.5% and an SVR at 7.5% is approximately £265/month. Almost no homeowner should stay on their lender\'s SVR — remortgaging to a new deal (with your current or a new lender) typically saves hundreds per month. Start remortgage discussions 3–6 months before your current deal expires.',
      },
      {
        q: 'What happens to my mortgage payments if the BOE base rate changes?',
        a: 'It depends on your mortgage type. Fixed rate: no change to payments until your fixed term ends, regardless of BOE moves. Tracker: immediate change — usually from the next monthly payment date after the BOE rate change. SVR: lenders are not obliged to pass on BOE changes to SVR, but usually do so over time (often with a delay and only partial pass-through). Offset mortgages (linked to savings accounts): the savings balance offsets the loan, so you only pay interest on the net balance — BOE changes affect both the loan rate and your savings rate. For budget planning, always model a 1%–2% rate rise from today to stress-test affordability.',
      },
    ],
    parentCalc: '/uk/mortgage',
    relatedSubPages: [
      { to: '/uk/mortgage/buy-to-let', label: 'Buy-to-Let Mortgage Calculator' },
      { to: '/uk/mortgage/stamp-duty', label: 'Stamp Duty Calculator' },
    ],
    relatedCalcs: [
      { to: '/uk/affordability', label: 'Affordability Calculator' },
      { to: '/uk/salary', label: 'Salary Calculator' },
    ],
  },

  {
    country: 'uk',
    calc: 'mortgage',
    slug: 'buy-to-let',
    title: 'Buy-to-Let Mortgage Calculator UK 2026 — BTL Rates, Tax & SDLT Surcharge',
    h1: 'Buy-to-Let Mortgage Calculator — UK 2026',
    metaDesc: 'Calculate your UK buy-to-let mortgage for 2026. 25% min deposit, ICR 125–145%, Section 24 interest restriction, and 3% SDLT surcharge on second properties.',
    intro: `Buy-to-let (BTL) mortgages in the UK have become significantly more expensive and complex since 2017 due to the Section 24 mortgage interest restriction — which phases out the deductibility of mortgage interest for individual landlords, replacing it with a basic-rate (20%) tax credit on finance costs. For higher-rate taxpayers, this change alone can turn an apparently profitable rental property into a loss-making one on paper. A landlord paying £12,000 per year in mortgage interest on a property generating £18,000 in rent used to declare a £6,000 profit. Under Section 24, they now declare the full £18,000 in rental income, receive a 20% credit on the £12,000 interest (£2,400), and pay 40% tax on £18,000 less allowable non-finance expenses — a dramatically higher effective tax rate than before.

The consequence has been a significant shift toward limited company ownership of BTL properties. A corporate structure (typically a Special Purpose Vehicle, or SPV) is not subject to Section 24 — mortgage interest remains fully deductible as a business expense within the company, and profits are subject to corporation tax (25% main rate for profits over £250,000; 19% for profits under £50,000, with marginal relief between). For a higher-rate taxpayer with significant mortgage debt relative to rental income, the tax saving from incorporation can be substantial. The trade-off is higher BTL mortgage rates (typically 0.2–0.8% above personal rates), administrative overhead, and complexity around extracting profits tax-efficiently.

BTL mortgage eligibility differs significantly from residential mortgages. Most lenders require a minimum 25% deposit (75% LTV), though some specialist lenders offer 80% LTV (20% deposit) at higher rates. The key underwriting metric is the Interest Coverage Ratio (ICR): monthly rental income must cover at least 125% of the monthly mortgage interest at the lender's stress rate (typically 5.5%–7.5%, regardless of the actual rate) for basic-rate taxpayers. For higher-rate or additional-rate taxpayers, most lenders require 145% ICR to account for the Section 24 tax drag on net yield. This ICR calculation, not your personal income, often determines the maximum loan amount — which means a BTL property must generate sufficient rent to stand on its own.

SDLT (Stamp Duty Land Tax) carries a mandatory 3% surcharge on all second and subsequent residential property purchases. From April 2026, with the temporary first-time buyer relief thresholds reverting, a £300,000 BTL purchase incurs: standard SDLT of £5,000 plus the 3% surcharge on the full £300,000 (£9,000) = total SDLT of £14,000. On a £500,000 property, the surcharge alone adds £15,000. This surcharge must be funded from cash — it cannot be added to the BTL mortgage — and directly reduces your initial yield and payback period.

Energy Performance Certificate (EPC) requirements are an increasingly important cost for BTL landlords. Currently, let properties must have a minimum EPC rating of E. The government has proposed raising this to C for new tenancies by 2025 and all tenancies by 2028 (though exact implementation dates have shifted). Properties rated D or E may require significant capital investment in insulation, heating upgrades, or double glazing to achieve a C rating — costs ranging from £3,000 for a well-insulated property to £20,000+ for an older, poorly-insulated one. Factor in potential EPC improvement costs when assessing BTL purchase decisions, particularly for pre-1980s properties.

Gross rental yields in the UK average 5–8% depending on location — higher in Northern cities (Manchester, Liverpool, Leeds) and lower in London where property values are highest relative to rents. Net yield (after mortgage costs, management fees of 10–15% of rent, maintenance, insurance, and voids) typically runs 1–3% lower. Use this calculator to model your UK buy-to-let mortgage repayments, ICR coverage ratio, gross and net rental yield, and estimated tax impact under Section 24.`,
    faqs: [
      {
        q: 'What deposit do I need for a buy-to-let mortgage in the UK?',
        a: 'Most BTL mortgage lenders require a minimum deposit of 25% (75% LTV). Some lenders offer BTL mortgages at 80% LTV (20% deposit) but these are less common and typically carry higher rates. First-time buyers purchasing a BTL property (never owned a home, buying investment property first) face additional restrictions — many lenders will not offer BTL mortgages to those who don\'t already own their own home, though some specialist BTL lenders will. Portfolio landlords (4+ mortgaged properties) face additional underwriting scrutiny under PRA rules introduced in 2017 and often need to provide a full portfolio business plan.',
      },
      {
        q: 'How does Section 24 affect buy-to-let landlords\' tax?',
        a: 'Section 24 (Finance Act 2015) restricts individual landlords\' ability to deduct mortgage interest from rental income for tax purposes. Since 2020, mortgage interest is no longer directly deductible — instead, landlords receive a 20% basic rate tax credit on finance costs. For a basic-rate taxpayer this is neutral. For a higher-rate taxpayer (40%), the impact is significant: previously a £10,000 annual mortgage interest cost reduced your taxable rental profit by £10,000, saving £4,000 in tax. Now, you pay tax on the £10,000 higher profit but receive a £2,000 credit — net additional tax of £2,000/year. This effectively raises the tax rate on leveraged rental income for higher-rate taxpayers. Incorporating into a limited company (where mortgage interest remains fully deductible as a business expense) is a common response.',
      },
      {
        q: 'What is the interest coverage ratio (ICR) for BTL mortgages?',
        a: 'The Interest Coverage Ratio (ICR) is the key BTL lending metric: monthly rent must cover the monthly interest cost by a specified multiple at the lender\'s stress rate. For basic-rate (20%) taxpayers, most lenders require 125% ICR — £1,250 monthly rent to support £1,000 monthly interest at the stress rate. For higher-rate (40%) or additional rate (45%) taxpayers, most lenders require 145% ICR — £1,450 rent for £1,000 interest. The stress rate (the rate used to calculate "monthly interest" in the ICR test) is typically 5.5%–7.5%, regardless of the actual mortgage rate. This conservative stress test significantly limits BTL borrowing amounts in higher-rate environments.',
      },
      {
        q: 'Should I buy a BTL property in a limited company in the UK?',
        a: 'Buying through a limited company (special purpose vehicle, SPV) has become increasingly popular for landlords due to Section 24. Key advantages: mortgage interest remains fully deductible within a company (Section 24 does not apply to companies); profits taxed at corporation tax rates (25% main rate for 2026, 19% for profits under £50,000); profits can be retained in the company and reinvested without immediate personal income tax; potential for more tax-efficient extraction via dividends or salary. Key disadvantages: BTL mortgage rates are typically 0.2%–0.8% higher for company borrowing; more administrative overhead (annual accounts, Companies House filings, corporation tax return); mortgage interest deductibility doesn\'t help if the company makes a loss anyway.',
      },
      {
        q: 'What SDLT applies to a buy-to-let purchase in 2026?',
        a: 'Buy-to-let and second home purchases attract the standard SDLT rates plus a mandatory 3% surcharge on every band. From April 2026, with standard rates reverting, a £300,000 BTL purchase: Standard SDLT: 0% on first £125,000 = £0; 2% on next £125,000 = £2,500; 5% on final £50,000 = £2,500. Total standard = £5,000. With 3% surcharge on the full £300,000 = £9,000 additional. Total SDLT: £14,000. A limited company purchasing residential property also pays the 3% surcharge — and for companies purchasing properties worth £500,000+, an additional ATED (Annual Tax on Enveloped Dwellings) charge may apply.',
      },
    ],
    parentCalc: '/uk/mortgage',
    relatedSubPages: [
      { to: '/uk/mortgage/fixed-vs-variable', label: 'Fixed vs Variable Mortgage' },
      { to: '/uk/mortgage/stamp-duty', label: 'Stamp Duty Calculator' },
    ],
    relatedCalcs: [
      { to: '/uk/tax', label: 'Tax Calculator' },
      { to: '/uk/affordability', label: 'Affordability Calculator' },
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
