import React from 'react';

/**
 * App-wide error boundary — a render crash anywhere inside shows this
 * friendly fallback instead of a white screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-surface">
          <div className="w-full max-w-md p-10 text-center border bg-surface-card rounded-[2rem] border-surface-border shadow-modern">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-3xl rounded-full bg-rose-50">⚠️</div>
            <h1 className="mb-2 text-2xl font-extrabold text-ink-main">Something went wrong</h1>
            <p className="mb-6 font-medium text-ink-muted">
              The page hit an unexpected problem. Reloading usually fixes it — your bookings and data are safe on the server.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-3.5 font-bold text-white transition-all bg-brand rounded-xl hover:bg-brand-dark active:scale-95"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
