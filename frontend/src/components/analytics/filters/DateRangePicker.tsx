/**
 * DateRangePicker Component
 * Custom date range picker with Thai Buddhist Calendar display
 */

import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import {
  formatThaiDateShort,
  getDateRangeLabel,
  toBuddhistYear,
} from '../../../utils/thaiCalendar';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
}

export const DateRangePicker = ({
  startDate,
  endDate,
  onDateChange,
}: DateRangePickerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  // Convert Date to input value (YYYY-MM-DD)
  const dateToInputValue = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Convert input value to Date
  const inputValueToDate = (value: string): Date => {
    return new Date(value + 'T00:00:00');
  };

  const handleApply = () => {
    // Validate: start must be before end
    if (tempStartDate > tempEndDate) {
      // Swap if needed
      onDateChange(tempEndDate, tempStartDate);
    } else {
      onDateChange(tempStartDate, tempEndDate);
    }
    onClose();
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    onClose();
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <Button
          leftIcon={<CalendarIcon />}
          variant="outline"
          size="sm"
          colorScheme="blue"
        >
          {getDateRangeLabel(startDate, endDate)}
        </Button>
      </PopoverTrigger>
      <PopoverContent width="350px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody p={4}>
          <VStack align="stretch" spacing={4}>
            <Text fontWeight="bold" fontSize="sm">
              เลือกช่วงเวลา
            </Text>

            {/* Start Date */}
            <Box>
              <Text fontSize="sm" mb={1} color="gray.600">
                วันที่เริ่มต้น
              </Text>
              <Input
                type="date"
                size="sm"
                value={dateToInputValue(tempStartDate)}
                onChange={(e) => setTempStartDate(inputValueToDate(e.target.value))}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {formatThaiDateShort(tempStartDate)} (พ.ศ. {toBuddhistYear(tempStartDate.getFullYear())})
              </Text>
            </Box>

            {/* End Date */}
            <Box>
              <Text fontSize="sm" mb={1} color="gray.600">
                วันที่สิ้นสุด
              </Text>
              <Input
                type="date"
                size="sm"
                value={dateToInputValue(tempEndDate)}
                onChange={(e) => setTempEndDate(inputValueToDate(e.target.value))}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {formatThaiDateShort(tempEndDate)} (พ.ศ. {toBuddhistYear(tempEndDate.getFullYear())})
              </Text>
            </Box>

            {/* Action Buttons */}
            <HStack spacing={2} justify="flex-end">
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                ยกเลิก
              </Button>
              <Button size="sm" colorScheme="blue" onClick={handleApply}>
                ตกลง
              </Button>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
