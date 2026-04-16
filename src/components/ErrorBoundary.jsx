import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    // Auto-retry once on dynamic import failures (network blip)
    if (error?.message?.includes('dynamically imported') || error?.message?.includes('Failed to fetch')) {
      if (this.state.retryCount < 1) {
        this.setState({ hasError: false, retryCount: this.state.retryCount + 1 })
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8 text-center">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-semibold text-slate-800">Failed to load this page</h2>
          <p className="text-slate-500 text-sm max-w-sm">
            This may be a network issue. Check your connection and try again.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, retryCount: 0 }) }}
            className="cw-btn text-sm"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
