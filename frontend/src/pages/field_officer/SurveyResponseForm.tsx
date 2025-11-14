import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  VStack,
  Button,
  Input,
  Textarea,
  useToast,
  HStack,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Select,
  Text,
  Spinner,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { apiClient } from "../../api/client";
import type { Survey, SurveyTemplate } from '../../types/Survey';
import type { FormField } from '../../types/FormBuilder';
import ThaiDatePicker from '../../components/ThaiDatePicker';

// --- Field Renderer Components ---

interface FieldRendererProps {
  field: FormField;
  value: any;
  onChange: (name: string, value: any) => void;
  error: string | null;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange, error }) => {
  const { name, label, type, required, options } = field;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let newValue: any = e.target.value;
    if (type === 'number') {
      newValue = parseFloat(newValue);
      if (isNaN(newValue)) newValue = '';
    }
    onChange(name, newValue);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.checked);
  };

  const handleCheckboxGroupChange = (newValues: string[]) => {
    onChange(name, newValues);
  };

  const renderInput = () => {
    // Apply modern, clean styling to Chakra components
    const inputProps = {
      borderRadius: 'lg',
      borderColor: 'gray.300',
      _hover: { borderColor: 'blue.400' },
      _focus: { boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)', borderColor: 'blue.500' },
    };

    switch (type) {
      case 'text':
        return <Input type="text" value={value || ''} onChange={handleInputChange} {...inputProps} />;
      case 'number':
        return <Input type="number" value={value || ''} onChange={handleInputChange} {...inputProps} />;
      case 'textarea':
        return <Textarea value={value || ''} onChange={handleInputChange} {...inputProps} />;
      case 'date':
        return (
          <div style={{ marginTop: '4px' }}>
            <ThaiDatePicker
              id={`field-${name}`}
              value={value ? new Date(value) : null}
              onChange={(date) => onChange(name, date ? date.toISOString().split('T')[0] : '')}
              placeholder="เลือกวันที่"
            />
          </div>
        );
      case 'time':
        return <Input type="time" value={value || ''} onChange={handleInputChange} {...inputProps} />;
      case 'select':
        return (
          <Select value={value || ''} onChange={handleInputChange} {...inputProps}>
            <option value="">เลือกตัวเลือก</option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup value={value || ''} onChange={(val) => onChange(name, val)}>
            <HStack spacing="24px">
              {options?.map((option) => (
                <Radio key={option} value={option} colorScheme="blue">
                  {option}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <Checkbox isChecked={!!value} onChange={handleCheckboxChange} colorScheme="blue">
            {label}
          </Checkbox>
        );
      case 'checkboxGroup':
        return (
          <CheckboxGroup value={value || []} onChange={handleCheckboxGroupChange} colorScheme="blue">
            <VStack align="start">
              {options?.map((option) => (
                <Checkbox key={option} value={option}>
                  {option}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        );
      default:
        return <Text color="red.500">Unsupported Field Type: {type}</Text>;
    }
  };

  return (
    <FormControl isRequired={required} isInvalid={!!error} mb={6}>
      {type !== 'checkbox' && <FormLabel fontWeight="bold" color="gray.700">{label}</FormLabel>}
      {renderInput()}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

// --- Main Component ---

const SurveyResponseForm: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [template, setTemplate] = useState<SurveyTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSurvey = useCallback(async () => {
    if (!surveyId) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get<Survey>(`/survey/${surveyId}`);;
      setSurvey(response.data);
      setTemplate(response.data.template || null);

      // Initialize form data
      const initialData: Record<string, any> = {};
      (response.data.template?.fields || []).forEach((field) => {
        if (field.type === 'checkbox') {
          initialData[field.name] = false;
        } else if (field.type === 'checkboxGroup') {
          initialData[field.name] = [];
        } else {
          initialData[field.name] = '';
        }
      });
      setFormData(initialData);

    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาดในการดึงข้อมูลแบบสำรวจ',
        description: 'ไม่สามารถโหลดข้อมูลแบบสำรวจได้',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Navigate back to dashboard or incident list
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [surveyId, navigate, toast]);

  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null })); // Clear error on change
  };

  const validateForm = () => {
    const errors: Record<string, string | null> = {};
    let isValid = true;

    template?.fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name];
        if (
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          errors[field.name] = `${field.label} จำเป็นต้องกรอก`;
          isValid = false;
        }
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'ข้อผิดพลาดในการตรวจสอบ',
        description: 'โปรดกรอกข้อมูลในช่องที่จำเป็นให้ครบถ้วน',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        data: JSON.stringify(formData),
      };

      await apiClient.post(`/survey/${surveyId}/response`, payload);

      toast({
        title: 'สำเร็จ',
        description: 'ส่งแบบสำรวจเรียบร้อยแล้ว',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to dashboard or incident view
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission Error:', error);
      toast({
        title: 'ข้อผิดพลาด',
        description: 'ไม่สามารถส่งแบบสำรวจได้',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh" className="bg-gray-50">
        <Spinner size="xl" color="blue.600" thickness="4px" />
      </Flex>
    );
  }

  if (!survey || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <Box p={8} maxW="3xl" w="full" bg="white" borderRadius="xl" shadow="lg" textAlign="center" border="1px" borderColor="gray.200">
          <Heading color="red.600" mb={4} size="xl">ข้อผิดพลาด</Heading>
          <Text fontSize="lg" color="gray.700">ไม่พบข้อมูลแบบสำรวจหรือเทมเพลต</Text>
          <Button mt={6} onClick={() => navigate('/dashboard')} colorScheme="blue" variant="outline">
            กลับไปที่หน้าหลัก
          </Button>
        </Box>
      </div>
    );
  }

  if (survey.status === 'COMPLETED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <Box p={8} maxW="3xl" w="full" bg="white" borderRadius="xl" shadow="lg" textAlign="center" border="1px" borderColor="gray.200">
          <Heading color="green.600" mb={4} size="xl">แบบสำรวจเสร็จสมบูรณ์</Heading>
          <Text fontSize="lg" color="gray.700">แบบสำรวจนี้ได้ถูกกรอกเสร็จสมบูรณ์แล้วและไม่สามารถรับการตอบกลับใหม่ได้</Text>
          <Button mt={6} onClick={() => navigate('/dashboard')} colorScheme="blue">
            ไปที่หน้าหลัก
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Box maxW="4xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <Heading mb={2} size="xl" color="gray.900" fontWeight="extrabold">
            {template.name}
          </Heading>
          <Text mb={0} color="gray.600" fontSize="lg">
            {template.description}
          </Text>
        </div>

        <VStack spacing={6} align="stretch" p={8} bg="white" borderRadius="xl" shadow="lg" border="1px" borderColor="gray.200">
          {template.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={formData[field.name]}
              onChange={handleFieldChange}
              error={formErrors[field.name]}
            />
          ))}
        </VStack>

        <HStack justify="flex-end" mt={8} spacing={4}>
          <Button variant="outline" onClick={() => navigate('/dashboard')} isDisabled={isSubmitting} size="lg" borderRadius="lg">
            ยกเลิก
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isSubmitting} loadingText="กำลังส่งข้อมูล" size="lg" borderRadius="lg" className="shadow-md">
            ส่งแบบสำรวจ
          </Button>
        </HStack>
      </Box>
    </div>
  );
};

export default SurveyResponseForm;
