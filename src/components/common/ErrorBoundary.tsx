import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SpendIntruders Uncaught Error Boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-rose-500/40 shadow-2xl">
            <h2 className="text-xl font-bold text-rose-400 mb-2 font-mono">
              System Shield Activated
            </h2>
            <p className="text-xs text-slate-300 mb-4 font-sans leading-relaxed">
              An unexpected glitch occurred in the financial battle engine. Your local bank statement data remains secure and uncompromised.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold transition-all"
            >
              Reboot Command Engine
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
