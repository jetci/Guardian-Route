import React from 'react';
import { Box } from '@chakra-ui/react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout Component
 * 
 * Main layout wrapper with navigation
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navigation />
      <Box as="main">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
