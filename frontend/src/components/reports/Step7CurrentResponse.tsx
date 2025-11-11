import { FormControl, FormLabel, Textarea, VStack } from '@chakra-ui/react';
import type { FullReportData } from '../../api/fullReport';

interface Props {
  data: Partial<FullReportData>;
  onChange: (data: Partial<FullReportData>) => void;
}

export const Step7CurrentResponse = ({ data, onChange }: Props) => {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>การตอบสนองปัจจุบัน (ถ้ามี)</FormLabel>
        <Textarea
          value={data.currentResponse || ''}
          onChange={(e) => onChange({ currentResponse: e.target.value })}
          placeholder="ระบุมาตรการที่ได้ดำเนินการไปแล้ว"
          rows={5}
        />
      </FormControl>
    </VStack>
  );
};
