import React, { type ErrorInfo, type ReactNode } from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Mock a remote logging function
const logErrorToService = (error: Error, info: ErrorInfo) => {
  console.error('--- REMOTE LOGGING MOCK ---');
  console.error('Error caught by Error Boundary:', error);
  console.error('Component Stack:', info.componentStack);
  console.error('---------------------------');
  // In a real app, this would send the error to Sentry, LogRocket, etc.
};

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    logErrorToService(error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box
          p={8}
          textAlign="center"
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
        >
          <VStack spacing={4} p={8} bg="white" boxShadow="xl" borderRadius="lg">
            <Heading size="xl" color="red.500">
              Application Error
            </Heading>
            <Text fontSize="lg">
              Something went wrong. We've been notified and are working on a fix.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Error Details: {this.state.error?.message || 'Unknown Error'}
            </Text>
            <Button colorScheme="red" onClick={this.handleReload}>
              Reload Application
            </Button>
            <Text fontSize="xs" color="gray.400">
              Please try reloading. If the issue persists, contact support.
            </Text>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
