import { FormControl, FormLabel, Textarea, Select, VStack } from '@chakra-ui/react';
import type { FullReportData } from '../../api/fullReport';

interface Props {
  data: Partial<FullReportData>;
  onChange: (data: Partial<FullReportData>) => void;
}

export const Step2IncidentDetails = ({ data, onChange }: Props) => {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>รายละเอียดเหตุการณ์</FormLabel>
        <Textarea
          value={data.incidentDescription || ''}
          onChange={(e) => onChange({ incidentDescription: e.target.value })}
          placeholder="อธิบายเหตุการณ์โดยละเอียด"
          rows={6}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>ระดับความรุนแรง</FormLabel>
        <Select
          value={data.severity || ''}
          onChange={(e) => onChange({ severity: e.target.value as any })}
        >
          <option value="">เลือกระดับความรุนแรง</option>
          <option value="LOW">ต่ำ</option>
          <option value="MEDIUM">ปานกลาง</option>
          <option value="HIGH">สูง</option>
          <option value="CRITICAL">วิกฤต</option>
        </Select>
      </FormControl>
    </VStack>
  );
};
