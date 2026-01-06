import React, { ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

// --- Type Definitions ---

// 1. Define the component's state structure
interface ErrorBoundaryState {
  hasError: boolean;
}

// 2. Define the component's props
// children: ReactNode allows any valid React element (or array of elements)
interface ErrorBoundaryProps {
  children: ReactNode;
  // Optional: You could add a fallback component prop here if you wanted a more flexible boundary
}

// ---

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  // Initialize the state
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * getDerivedStateFromError is called after an error has been thrown by a descendant component.
   * It returns a value to update state.
   */
  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /**
   * componentDidCatch is called after an error has been thrown by a descendant component.
   * It is used for logging error information.
   * @param error The error that was thrown.
   * @param errorInfo An object with a componentStack key containing the component stack trace.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Optional: Log error to an external service like Sentry or Crashlytics here.
  }

  render() {
    if (this.state.hasError) {
      // Render the fallback UI when an error is caught.
      return <Text style={styles.errorText}>Something went wrong.</Text>;
    }

    // Render children normally if no error was caught.
    return this.props.children;
  }
}

export default ErrorBoundary;

// Basic styles for the fallback text
const styles = StyleSheet.create({
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  } as TextStyle,
});
