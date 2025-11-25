/**
 * ChartContainer Component
 * Reusable wrapper for charts with loading, error, and empty states
 */

import { Box, Skeleton, Alert, AlertIcon, Text, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface ChartContainerProps {
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  height?: number;
  title?: string;
  children: ReactNode;
}

export const ChartContainer = ({
  loading = false,
  error = null,
  isEmpty = false,
  height = 300,
  title,
  children,
}: ChartContainerProps) => {
  // Loading state
  if (loading) {
    return (
      <Box>
        {title && (
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            {title}
          </Text>
        )}
        <Skeleton height={`${height}px`} borderRadius="md" />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box>
        {title && (
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            {title}
          </Text>
        )}
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <Box>
        {title && (
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            {title}
          </Text>
        )}
        <VStack
          height={`${height}px`}
          justify="center"
          align="center"
          bg="gray.50"
          borderRadius="md"
          border="1px dashed"
          borderColor="gray.300"
        >
          <Text color="gray.500" fontSize="lg">
            ไม่มีข้อมูล
          </Text>
          <Text color="gray.400" fontSize="sm">
            ลองเปลี่ยนช่วงเวลาหรือตัวกรองอื่น
          </Text>
        </VStack>
      </Box>
    );
  }

  // Normal state with chart
  return (
    <Box>
      {title && (
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          {title}
        </Text>
      )}
      <Box height={`${height}px`}>{children}</Box>
    </Box>
  );
};

export default ChartContainer;
