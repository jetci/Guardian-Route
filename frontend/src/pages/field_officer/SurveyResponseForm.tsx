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
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from "../../api/client";
import { Survey, SurveyTemplate } from '../../types/Survey';
import { FormField, FieldType } from '../../types/FormBuilder';

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
    switch (type) {
      case 'text':
        return <Input type="text" value={value || ''} onChange={handleInputChange} />;
      case 'number':
        return <Input type="number" value={value || ''} onChange={handleInputChange} />;
      case 'textarea':
        return <Textarea value={value || ''} onChange={handleInputChange} />;
      case 'date':
        return <Input type="date" value={value || ''} onChange={handleInputChange} />;
      case 'time':
        return <Input type="time" value={value || ''} onChange={handleInputChange} />;
      case 'select':
        return (
          <Select value={value || ''} onChange={handleInputChange}>
            <option value="">Select an option</option>
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
                <Radio key={option} value={option}>
                  {option}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <Checkbox isChecked={!!value} onChange={handleCheckboxChange}>
            {label}
          </Checkbox>
        );
      case 'checkboxGroup':
        return (
          <CheckboxGroup value={value || []} onChange={handleCheckboxGroupChange}>
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
    <FormControl isRequired={required} isInvalid={!!error} mb={4}>
      {type !== 'checkbox' && <FormLabel>{label}</FormLabel>}
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
  const { user } = useAuthStore();
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
        title: 'Error fetching survey',
        description: 'Could not load survey data.',
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
          errors[field.name] = `${field.label} is required.`;
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
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
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
        title: 'Success',
        description: 'Survey response submitted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to dashboard or incident view
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit survey response.',
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
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!survey || !template) {
    return (
      <Box p={8} maxW="3xl" mx="auto">
        <Heading color="red.500">Error</Heading>
        <Text>Survey or Template data is missing.</Text>
      </Box>
    );
  }

  if (survey.status === 'COMPLETED') {
    return (
      <Box p={8} maxW="3xl" mx="auto" textAlign="center">
        <Heading color="green.500" mb={4}>Survey Completed</Heading>
        <Text fontSize="lg">This survey has already been completed and cannot accept new responses.</Text>
        <Button mt={6} onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </Box>
    );
  }

  return (
    <Box p={8} maxW="3xl" mx="auto">
      <Heading mb={2} size="xl" color="teal.500">
        {template.name}
      </Heading>
      <Text mb={6} color="gray.600">
        {template.description}
      </Text>

      <VStack spacing={6} align="stretch" p={6} borderWidth="1px" borderRadius="lg" bg="white" shadow="md">
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

      <HStack justify="flex-end" mt={8}>
        <Button variant="ghost" onClick={() => navigate('/dashboard')} isDisabled={isSubmitting}>
          Cancel
        </Button>
        <Button colorScheme="teal" onClick={handleSubmit} isLoading={isSubmitting} loadingText="Submitting">
          Submit Response
        </Button>
      </HStack>
    </Box>
  );
};

export default SurveyResponseForm;
