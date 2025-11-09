import { FormControl, FormLabel, Textarea, VStack } from '@chakra-ui/react';
import type { FullReportData } from '../../api/fullReport';

interface Props {
  data: Partial<FullReportData>;
  onChange: (data: Partial<FullReportData>) => void;
}

export const Step6Resources = ({ data, onChange }: Props) => {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>ทรัพยากรที่จำเป็น (ถ้ามี)</FormLabel>
        <Textarea
          value={data.resourcesNeeded || ''}
          onChange={(e) => onChange({ resourcesNeeded: e.target.value })}
          placeholder="ระบุทรัพยากร อุปกรณ์ บุคลากร ที่ต้องการ"
          rows={5}
        />
      </FormControl>
    </VStack>
  );
};
