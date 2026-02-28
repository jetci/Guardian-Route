import { FormControl, FormLabel, Textarea, VStack } from '@chakra-ui/react';
import type { FullReportData } from '../../api/fullReport';

interface Props {
  data: Partial<FullReportData>;
  onChange: (data: Partial<FullReportData>) => void;
}

export const Step4Infrastructure = ({ data, onChange }: Props) => {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>ความเสียหายโครงสร้างพื้นฐาน (ถ้ามี)</FormLabel>
        <Textarea
          value={data.infrastructureDamage || ''}
          onChange={(e) => onChange({ infrastructureDamage: e.target.value })}
          placeholder="ระบุความเสียหายของถนน สะพาน ไฟฟ้า น้ำประปา ฯลฯ"
          rows={5}
        />
      </FormControl>
    </VStack>
  );
};
