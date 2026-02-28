import { FormControl, FormLabel, Textarea, VStack } from '@chakra-ui/react';
import type { FullReportData } from '../../api/fullReport';

interface Props {
  data: Partial<FullReportData>;
  onChange: (data: Partial<FullReportData>) => void;
}

export const Step8Recommendations = ({ data, onChange }: Props) => {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>ข้อเสนอแนะ</FormLabel>
        <Textarea
          value={data.recommendations || ''}
          onChange={(e) => onChange({ recommendations: e.target.value })}
          placeholder="ระบุข้อเสนอแนะสำหรับการแก้ไขและป้องกัน"
          rows={6}
        />
      </FormControl>
    </VStack>
  );
};
