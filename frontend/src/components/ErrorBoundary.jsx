import React from 'react';
import { Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="p-4">
          <Alert variant="danger">
            <Alert.Heading>Something went wrong</Alert.Heading>
            <p>An error occurred in this component. Details:</p>
            <pre className="mt-3 p-3 bg-light text-dark rounded" style={{ maxHeight: '200px', overflow: 'auto' }}>
              {this.state.error && this.state.error.toString()}
            </pre>
            {this.state.errorInfo && (
              <details className="mt-3">
                <summary>Component Stack</summary>
                <pre className="p-3 bg-light text-dark rounded" style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <hr />
            <div className="d-flex justify-content-end">
              <Button 
                variant="outline-primary" 
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 