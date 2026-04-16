import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-4xl font-display font-bold mb-4">Page Not Found</h1>
      <p className="text-slate-500 mb-8">This calculator doesn't exist yet. Try one of our popular ones.</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link to="/" className="cw-btn">Back to Home</Link>
        <Link to="/us/mortgage" className="cw-btn-ghost">
          Mortgage Calculator
        </Link>
      </div>
    </div>
  )
}
