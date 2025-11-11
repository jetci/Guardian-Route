import { FormControl, FormLabel, Textarea, VStack, NumberInput, NumberInputField } from '@chakra-ui/react';
import type { FullReportData } from '../../api/fullReport';

interface Props {
  data: Partial<FullReportData>;
  onChange: (data: Partial<FullReportData>) => void;
}

export const Step3AffectedArea = ({ data, onChange }: Props) => {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>จำนวนครัวเรือนที่ได้รับผลกระทบ</FormLabel>
        <NumberInput
          value={data.affectedHouseholds || 0}
          onChange={(_, value) => onChange({ affectedHouseholds: value })}
          min={0}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>จำนวนประชากรที่ได้รับผลกระทบ</FormLabel>
        <NumberInput
          value={data.affectedPopulation || 0}
          onChange={(_, value) => onChange({ affectedPopulation: value })}
          min={0}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>รายละเอียดพื้นที่ที่ได้รับผลกระทบ</FormLabel>
        <Textarea
          value={data.affectedAreaDescription || ''}
          onChange={(e) => onChange({ affectedAreaDescription: e.target.value })}
          placeholder="อธิบายพื้นที่และลักษณะความเสียหาย"
          rows={4}
        />
      </FormControl>
    </VStack>
  );
};
