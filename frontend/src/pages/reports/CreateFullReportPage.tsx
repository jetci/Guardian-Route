import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Progress,
  VStack,
  HStack,
  Button,
  useToast,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight, FiSave } from 'react-icons/fi';
import { Step1BasicInfo } from '../../components/reports/Step1BasicInfo';
import { Step2IncidentDetails } from '../../components/reports/Step2IncidentDetails';
import { Step3AffectedArea } from '../../components/reports/Step3AffectedArea';
import { Step4Infrastructure } from '../../components/reports/Step4Infrastructure';
import { Step5Casualties } from '../../components/reports/Step5Casualties';
import { Step6Resources } from '../../components/reports/Step6Resources';
import { Step7CurrentResponse } from '../../components/reports/Step7CurrentResponse';
import { Step8Recommendations } from '../../components/reports/Step8Recommendations';
import { Step9Photos } from '../../components/reports/Step9Photos';
import { Step10AIAnalysis } from '../../components/reports/Step10AIAnalysis';
import { fullReportApi, type FullReportData } from '../../api/fullReport';

export const CreateFullReportPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FullReportData>>({
    taskId: taskId || '',
  });
  const [loading, setLoading] = useState(false);

  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (data: Partial<FullReportData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      await fullReportApi.create(formData as FullReportData);
      toast({
        title: 'บันทึกแบบร่างสำเร็จ',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถบันทึกแบบร่างได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const report = await fullReportApi.create(formData as FullReportData);
      await fullReportApi.submit(report.id);
      
      toast({
        title: 'ส่งรายงานสำเร็จ',
        description: 'รายงานอยู่ระหว่างการตรวจสอบ',
        status: 'success',
        duration: 3000,
      });
      
      navigate('/reports');
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งรายงานได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo data={formData} onChange={updateFormData} />;
      case 2:
        return <Step2IncidentDetails data={formData} onChange={updateFormData} />;
      case 3:
        return <Step3AffectedArea data={formData} onChange={updateFormData} />;
      case 4:
        return <Step4Infrastructure data={formData} onChange={updateFormData} />;
      case 5:
        return <Step5Casualties data={formData} onChange={updateFormData} />;
      case 6:
        return <Step6Resources data={formData} onChange={updateFormData} />;
      case 7:
        return <Step7CurrentResponse data={formData} onChange={updateFormData} />;
      case 8:
        return <Step8Recommendations data={formData} onChange={updateFormData} />;
      case 9:
        return <Step9Photos data={formData} onChange={updateFormData} />;
      case 10:
        return <Step10AIAnalysis data={formData} onChange={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            สร้างรายงานฉบับเต็ม
          </Heading>
          <Progress value={progress} colorScheme="blue" size="sm" borderRadius="full" />
          <Box mt={2} fontSize="sm" color="gray.600">
            ขั้นตอนที่ {currentStep} จาก {totalSteps}
          </Box>
        </Box>

        <Card>
          <CardBody>{renderStep()}</CardBody>
        </Card>

        <HStack justify="space-between">
          <Button
            leftIcon={<FiArrowLeft />}
            onClick={handlePrevious}
            isDisabled={currentStep === 1}
            variant="outline"
          >
            ย้อนกลับ
          </Button>

          <HStack>
            <Button
              leftIcon={<FiSave />}
              onClick={handleSaveDraft}
              isLoading={loading}
              variant="outline"
            >
              บันทึกแบบร่าง
            </Button>

            {currentStep < totalSteps ? (
              <Button
                rightIcon={<FiArrowRight />}
                onClick={handleNext}
                colorScheme="blue"
              >
                ถัดไป
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                colorScheme="green"
                isLoading={loading}
              >
                ส่งรายงาน
              </Button>
            )}
          </HStack>
        </HStack>
      </VStack>
    </Container>
  );
};
