import React, { ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface IStyle {
  errorText: TextStyle;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

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
      return <Text style={styles.errorText}>Something went wrong.</Text>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

const styles = StyleSheet.create<IStyle>({
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  } as TextStyle,
});
