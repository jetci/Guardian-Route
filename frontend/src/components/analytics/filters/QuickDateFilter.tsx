/**
 * QuickDateFilter Component
 * Quick date range selection buttons
 */

import { HStack, Button } from '@chakra-ui/react';
import { getQuickDateRanges } from '../../../utils/thaiCalendar';
import type { DateRange } from '../../../utils/thaiCalendar';

interface QuickDateFilterProps {
  selectedRange?: string;
  onRangeSelect: (rangeKey: string, range: DateRange) => void;
}

export const QuickDateFilter = ({
  selectedRange,
  onRangeSelect,
}: QuickDateFilterProps) => {
  const quickRanges = getQuickDateRanges();

  // Define which ranges to show (most commonly used)
  const displayRanges = [
    'today',
    'last7Days',
    'last30Days',
    'thisMonth',
    'thisQuarter',
  ];

  return (
    <HStack spacing={2} flexWrap="wrap">
      {displayRanges.map((key) => {
        const range = quickRanges[key];
        if (!range) return null;

        return (
          <Button
            key={key}
            size="sm"
            variant={selectedRange === key ? 'solid' : 'outline'}
            colorScheme="blue"
            onClick={() => onRangeSelect(key, range)}
          >
            {range.label}
          </Button>
        );
      })}
    </HStack>
  );
};

export default QuickDateFilter;
