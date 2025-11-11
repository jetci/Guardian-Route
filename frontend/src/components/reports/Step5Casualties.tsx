import { FormControl, FormLabel, VStack, NumberInput, NumberInputField } from '@chakra-ui/react';
import type { FullReportData } from '../../api/fullReport';

interface Props {
  data: Partial<FullReportData>;
  onChange: (data: Partial<FullReportData>) => void;
}

export const Step5Casualties = ({ data, onChange }: Props) => {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>จำนวนผู้เสียชีวิต (ถ้ามี)</FormLabel>
        <NumberInput
          value={data.casualties || 0}
          onChange={(_, value) => onChange({ casualties: value })}
          min={0}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel>จำนวนผู้บาดเจ็บ (ถ้ามี)</FormLabel>
        <NumberInput
          value={data.injuries || 0}
          onChange={(_, value) => onChange({ injuries: value })}
          min={0}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>
    </VStack>
  );
};
