import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state = { hasError: false, errorMessage: "" };

  // Updates state on error occurrence.
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  // Logs error details to console.
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.log("Logged error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Error: {this.state.errorMessage}</h1>;
    }
    return this.props.children; // If there's no error, render the children
  }
}

export default ErrorBoundary;
