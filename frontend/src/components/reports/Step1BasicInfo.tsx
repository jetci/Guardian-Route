import { FormControl, FormLabel, Input, Textarea, VStack } from '@chakra-ui/react';
import type { FullReportData } from '../../api/fullReport';

interface Props {
  data: Partial<FullReportData>;
  onChange: (data: Partial<FullReportData>) => void;
}

export const Step1BasicInfo = ({ data, onChange }: Props) => {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>หัวข้อรายงาน</FormLabel>
        <Input
          value={data.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="ระบุหัวข้อรายงาน"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>สรุปสั้น</FormLabel>
        <Textarea
          value={data.summary || ''}
          onChange={(e) => onChange({ summary: e.target.value })}
          placeholder="สรุปสถานการณ์โดยย่อ"
          rows={4}
        />
      </FormControl>
    </VStack>
  );
};
