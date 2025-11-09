import { useState } from 'react';
import { FormControl, FormLabel, VStack, Textarea, Button, Box, Text, Spinner } from '@chakra-ui/react';
import { FiZap } from 'react-icons/fi';
import type { FullReportData } from '../../api/fullReport';
import { fullReportApi } from '../../api/fullReport';

interface Props {
  data: Partial<FullReportData>;
  onChange: (data: Partial<FullReportData>) => void;
}

export const Step10AIAnalysis = ({ data, onChange }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleGenerateAI = async () => {
    if (!data.title || !data.incidentDescription || !data.severity) {
      alert('กรุณากรอกข้อมูลขั้นตอนที่ 1-2 ก่อน');
      return;
    }

    try {
      setLoading(true);
      const analysis = await fullReportApi.requestAIAnalysis({
        title: data.title,
        description: data.incidentDescription,
        severity: data.severity,
        affectedHouseholds: data.affectedHouseholds || 0,
        affectedPopulation: data.affectedPopulation || 0,
        infrastructureDamage: data.infrastructureDamage,
        casualties: data.casualties,
        injuries: data.injuries,
      });
      onChange({ aiAnalysis: analysis, aiAnalysisEdited: analysis });
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการวิเคราะห์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <Button
          leftIcon={<FiZap />}
          onClick={handleGenerateAI}
          isLoading={loading}
          colorScheme="purple"
          size="sm"
          mb={2}
        >
          สร้างการวิเคราะห์ด้วย AI
        </Button>
        <Text fontSize="xs" color="gray.500">
          ใช้ Gemini AI วิเคราะห์และให้คำแนะนำ
        </Text>
      </Box>

      {loading && (
        <Box textAlign="center" py={4}>
          <Spinner />
          <Text mt={2} fontSize="sm">กำลังวิเคราะห์...</Text>
        </Box>
      )}

      {data.aiAnalysis && (
        <FormControl>
          <FormLabel>ผลการวิเคราะห์จาก AI (สามารถแก้ไขได้)</FormLabel>
          <Textarea
            value={data.aiAnalysisEdited || data.aiAnalysis}
            onChange={(e) => onChange({ aiAnalysisEdited: e.target.value })}
            rows={12}
          />
        </FormControl>
      )}
    </VStack>
  );
};
