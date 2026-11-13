import React, { Component, ReactNode } from "react";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Global error boundary that catches JavaScript errors anywhere in its child component tree,
 * logs them, shows a user‑friendly UI and displays a toast notification.
 *
 * Wrapping the root <Outlet /> with this component prevents unhandled exceptions from
 * bubbling up and causing the entire app to render a blank white screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an external service here.
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    toast.error(error.message || "An unexpected error occurred");
    this.setState({ error });
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-8">
          <div className="max-w-lg text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              The application encountered an unexpected error. Please try refreshing the page or
              contact support.
            </p>
            <details className="text-left whitespace-pre-wrap bg-muted rounded p-4 border border-border text-sm overflow-auto max-h-60">
              {this.state.error?.stack || "No stack trace available"}
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
