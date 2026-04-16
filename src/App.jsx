import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
const Home = lazy(() => import('./pages/Home'))
const CountryHub = lazy(() => import('./pages/CountryHub'))
const About = lazy(() => import('./pages/About'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Calculators
const MortgageCalc = lazy(() => import('./calculators/mortgage/MortgageCalc'))
const TaxCalc = lazy(() => import('./calculators/tax/TaxCalc'))
const AutoLoanCalc = lazy(() => import('./calculators/autoloan/AutoLoanCalc'))
const SalaryCalc = lazy(() => import('./calculators/salary/SalaryCalc'))
const RideProfitCalc = lazy(() => import('./calculators/rideprofit/RideProfitCalc'))
const RentVsBuyCalc = lazy(() => import('./calculators/rentvsbuy/RentVsBuyCalc'))
const LoanPayoffCalc = lazy(() => import('./calculators/loanpayoff/LoanPayoffCalc'))
const CreditCardCalc = lazy(() => import('./calculators/creditcard/CreditCardCalc'))
const HelocCalc = lazy(() => import('./calculators/heloc/HelocCalc'))
const StudentLoanCalc = lazy(() => import('./calculators/studentloan/StudentLoanCalc'))
const PropertyROICalc = lazy(() => import('./calculators/propertyrei/PropertyROICalc'))
const RefinanceCalc = lazy(() => import('./calculators/refinance/RefinanceCalc'))
const AffordabilityCalc = lazy(() => import('./calculators/affordability/AffordabilityCalc'))
const StampDutyCalc = lazy(() => import('./calculators/stampduty/StampDutyCalc'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
)

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Country Hubs */}
            <Route path="/us" element={<CountryHub country="us" />} />
            <Route path="/ca" element={<CountryHub country="ca" />} />
            <Route path="/uk" element={<CountryHub country="uk" />} />
            <Route path="/au" element={<CountryHub country="au" />} />
            <Route path="/ie" element={<CountryHub country="ie" />} />
            <Route path="/nz" element={<CountryHub country="nz" />} />

            {/* US Calculators */}
            <Route path="/us/mortgage" element={<MortgageCalc country="us" />} />
            <Route path="/us/tax" element={<TaxCalc country="us" />} />
            <Route path="/us/autoloan" element={<AutoLoanCalc country="us" />} />
            <Route path="/us/rent-vs-buy" element={<RentVsBuyCalc country="us" />} />
            <Route path="/us/salary" element={<SalaryCalc country="us" />} />
            <Route path="/us/loan-payoff" element={<LoanPayoffCalc country="us" />} />
            <Route path="/us/credit-card" element={<CreditCardCalc country="us" />} />
            <Route path="/us/heloc" element={<HelocCalc country="us" />} />
            <Route path="/us/student-loan" element={<StudentLoanCalc country="us" />} />
            <Route path="/us/property-roi" element={<PropertyROICalc country="us" />} />
            <Route path="/us/refinance" element={<RefinanceCalc country="us" />} />
            <Route path="/us/affordability" element={<AffordabilityCalc country="us" />} />

            {/* CA Calculators */}
            <Route path="/ca/mortgage" element={<MortgageCalc country="ca" />} />
            <Route path="/ca/tax" element={<TaxCalc country="ca" />} />
            <Route path="/ca/autoloan" element={<AutoLoanCalc country="ca" />} />
            <Route path="/ca/salary" element={<SalaryCalc country="ca" />} />
            <Route path="/ca/rent-vs-buy" element={<RentVsBuyCalc country="ca" />} />
            <Route path="/ca/rideprofit" element={<RideProfitCalc country="ca" />} />
            <Route path="/ca/loan-payoff" element={<LoanPayoffCalc country="ca" />} />
            <Route path="/ca/credit-card" element={<CreditCardCalc country="ca" />} />
            <Route path="/ca/affordability" element={<AffordabilityCalc country="ca" />} />
            <Route path="/ca/property-roi" element={<PropertyROICalc country="ca" />} />
            <Route path="/ca/refinance" element={<RefinanceCalc country="ca" />} />

            {/* UK Calculators */}
            <Route path="/uk/mortgage" element={<MortgageCalc country="uk" />} />
            <Route path="/uk/tax" element={<TaxCalc country="uk" />} />
            <Route path="/uk/autoloan" element={<AutoLoanCalc country="uk" />} />
            <Route path="/uk/salary" element={<SalaryCalc country="uk" />} />
            <Route path="/uk/rent-vs-buy" element={<RentVsBuyCalc country="uk" />} />
            <Route path="/uk/rideprofit" element={<RideProfitCalc country="uk" />} />
            <Route path="/uk/affordability" element={<AffordabilityCalc country="uk" />} />
            <Route path="/uk/loan-payoff" element={<LoanPayoffCalc country="uk" />} />
            <Route path="/uk/credit-card" element={<CreditCardCalc country="uk" />} />
            <Route path="/uk/property-roi" element={<PropertyROICalc country="uk" />} />
            <Route path="/uk/refinance" element={<RefinanceCalc country="uk" />} />
            <Route path="/uk/stamp-duty" element={<StampDutyCalc />} />

            {/* AU Calculators */}
            <Route path="/au/mortgage" element={<MortgageCalc country="au" />} />
            <Route path="/au/tax" element={<TaxCalc country="au" />} />
            <Route path="/au/salary" element={<SalaryCalc country="au" />} />
            <Route path="/au/rideprofit" element={<RideProfitCalc country="au" />} />
            <Route path="/au/autoloan" element={<AutoLoanCalc country="au" />} />
            <Route path="/au/rent-vs-buy" element={<RentVsBuyCalc country="au" />} />
            <Route path="/au/loan-payoff" element={<LoanPayoffCalc country="au" />} />
            <Route path="/au/credit-card" element={<CreditCardCalc country="au" />} />
            <Route path="/au/affordability" element={<AffordabilityCalc country="au" />} />

            {/* IE Calculators */}
            <Route path="/ie/mortgage" element={<MortgageCalc country="ie" />} />
            <Route path="/ie/tax" element={<TaxCalc country="ie" />} />
            <Route path="/ie/salary" element={<SalaryCalc country="ie" />} />
            <Route path="/ie/rideprofit" element={<RideProfitCalc country="ie" />} />
            <Route path="/ie/autoloan" element={<AutoLoanCalc country="ie" />} />
            <Route path="/ie/rent-vs-buy" element={<RentVsBuyCalc country="ie" />} />
            <Route path="/ie/loan-payoff" element={<LoanPayoffCalc country="ie" />} />
            <Route path="/ie/credit-card" element={<CreditCardCalc country="ie" />} />
            <Route path="/ie/affordability" element={<AffordabilityCalc country="ie" />} />

            {/* NZ Calculators */}
            <Route path="/nz/mortgage" element={<MortgageCalc country="nz" />} />
            <Route path="/nz/tax" element={<TaxCalc country="nz" />} />
            <Route path="/nz/salary" element={<SalaryCalc country="nz" />} />
            <Route path="/nz/rideprofit" element={<RideProfitCalc country="nz" />} />
            <Route path="/nz/autoloan" element={<AutoLoanCalc country="nz" />} />
            <Route path="/nz/rent-vs-buy" element={<RentVsBuyCalc country="nz" />} />
            <Route path="/nz/loan-payoff" element={<LoanPayoffCalc country="nz" />} />
            <Route path="/nz/credit-card" element={<CreditCardCalc country="nz" />} />
            <Route path="/nz/affordability" element={<AffordabilityCalc country="nz" />} />

            {/* Static Pages */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
