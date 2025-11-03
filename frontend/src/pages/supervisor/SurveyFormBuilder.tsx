import React, { useState, useCallback, useEffect } from 'react';
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
  IconButton,
  Select,
  Checkbox,
  Text,
  Divider,
  Spinner,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from "../../api/client";
import { SurveyTemplate } from '../../types/Survey';
import { FormField, FieldType } from '../../types/FormBuilder';

// --- Field Components ---

interface FieldProps {
  field: FormField;
  index: number;
  onUpdate: (index: number, newField: FormField) => void;
  onDelete: (index: number) => void;
}

const FieldEditor: React.FC<FieldProps> = ({ field, index, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(field.id === 'new');
  const [tempField, setTempField] = useState<FormField>(field);

  const handleSave = () => {
    if (!tempField.label || !tempField.name) {
      alert('Label and Name are required.');
      return;
    }
    onUpdate(index, { ...tempField, id: field.id === 'new' ? Date.now().toString() : field.id });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (field.id === 'new') {
      onDelete(index);
    } else {
      setTempField(field);
      setIsEditing(false);
    }
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...(tempField.options || [])];
    newOptions[optionIndex] = value;
    setTempField({ ...tempField, options: newOptions });
  };

  const handleAddOption = () => {
    setTempField({ ...tempField, options: [...(tempField.options || []), ''] });
  };

  const handleRemoveOption = (optionIndex: number) => {
    const newOptions = (tempField.options || []).filter((_, i) => i !== optionIndex);
    setTempField({ ...tempField, options: newOptions });
  };

  const renderOptionsEditor = () => {
    if (tempField.type !== 'select' && tempField.type !== 'radio' && tempField.type !== 'checkboxGroup') return null;

    return (
      <VStack align="start" spacing={2} mt={2} p={2} borderWidth="1px" borderRadius="md">
        <Text fontWeight="bold">Options:</Text>
        {(tempField.options || []).map((option, optionIndex) => (
          <HStack key={optionIndex} w="full">
            <Input
              placeholder={`Option ${optionIndex + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
              size="sm"
            />
            <IconButton
              aria-label="Remove option"
              icon={<DeleteIcon />}
              size="sm"
              onClick={() => handleRemoveOption(optionIndex)}
            />
          </HStack>
        ))}
        <Button leftIcon={<AddIcon />} size="sm" onClick={handleAddOption} w="full">
          Add Option
        </Button>
      </VStack>
    );
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" w="full" bg="white" shadow="md">
      <HStack justify="space-between" mb={2}>
        <Heading size="sm">Field {index + 1}: {field.label || 'New Field'}</Heading>
        <HStack>
          {isEditing ? (
            <>
              <IconButton aria-label="Save" icon={<CheckIcon />} colorScheme="green" size="sm" onClick={handleSave} />
              <IconButton aria-label="Cancel" icon={<CloseIcon />} colorScheme="red" size="sm" onClick={handleCancel} />
            </>
          ) : (
            <>
              <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" onClick={() => setIsEditing(true)} />
              <IconButton aria-label="Delete" icon={<DeleteIcon />} colorScheme="red" size="sm" onClick={() => onDelete(index)} />
            </>
          )}
        </HStack>
      </HStack>

      {isEditing ? (
        <VStack align="start" spacing={3}>
          <Input
            placeholder="Field Label (e.g., Number of Affected Houses)"
            value={tempField.label}
            onChange={(e) => setTempField({ ...tempField, label: e.target.value })}
          />
          <Input
            placeholder="Field Name (e.g., affected_houses) - Unique ID"
            value={tempField.name}
            onChange={(e) => setTempField({ ...tempField, name: e.target.value.replace(/\s/g, '_').toLowerCase() })}
          />
          <Select
            value={tempField.type}
            onChange={(e) => setTempField({ ...tempField, type: e.target.value as FieldType, options: [] })}
          >
            <option value="text">Text Input</option>
            <option value="number">Number Input</option>
            <option value="textarea">Text Area</option>
            <option value="select">Dropdown (Select)</option>
            <option value="radio">Radio Buttons</option>
            <option value="checkbox">Single Checkbox</option>
            <option value="checkboxGroup">Checkbox Group</option>
            <option value="date">Date Picker</option>
            <option value="time">Time Picker</option>
          </Select>
          <Checkbox
            isChecked={tempField.required}
            onChange={(e) => setTempField({ ...tempField, required: e.target.checked })}
          >
            Required Field
          </Checkbox>
          {renderOptionsEditor()}
        </VStack>
      ) : (
        <VStack align="start" spacing={1}>
          <Text><strong>Name:</strong> {field.name}</Text>
          <Text><strong>Type:</strong> {field.type}</Text>
          <Text><strong>Required:</strong> {field.required ? 'Yes' : 'No'}</Text>
          {field.options && field.options.length > 0 && (
            <Text><strong>Options:</strong> {field.options.join(', ')}</Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

// --- Main Component ---

const SurveyFormBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { token } = useAuthStore();  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isEditMode = !!id;

  const fetchTemplate = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get<SurveyTemplate>(`/survey-templates/${id}`);
      setTemplateName(response.data.name);
      setTemplateDescription(response.data.description || '');
      setFields(response.data.fields as FormField[]);
    } catch (error) {
      toast({
        title: 'Error fetching template',
        description: 'Could not load survey template data.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      navigate('/supervisor/survey-templates');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        id: 'new',
        name: '',
        label: '',
        type: 'text',
        required: false,
        options: [],
      } as FormField,
    ]);
  };

  const handleUpdateField = (index: number, newField: FormField) => {
    const newFields = [...fields];
    newFields[index] = newField;
    setFields(newFields);
  };

  const handleDeleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Template Name is required.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const hasEmptyField = fields.some(field => !field.label || !field.name);
    if (hasEmptyField) {
      toast({
        title: 'Validation Error',
        description: 'All fields must have a Label and a Name.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const fieldNames = fields.map(f => f.name);
    const hasDuplicateName = new Set(fieldNames).size !== fieldNames.length;
    if (hasDuplicateName) {
      toast({
        title: 'Validation Error',
        description: 'All field names must be unique.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: templateName,
        description: templateDescription,
        fields: JSON.stringify(fields),
      };

      if (isEditMode) {
        await apiClient.patch(`/survey-templates/${id}`, payload);
        toast({
          title: 'Success',
          description: 'Survey Template updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await apiClient.post('/survey-templates', payload);
        toast({
          title: 'Success',
          description: 'Survey Template created successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      navigate('/supervisor/survey-templates');
    } catch (error) {
      console.error('Save Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save survey template.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8} maxW="6xl" mx="auto">
      <Heading mb={6} size="xl" color="teal.500">
        {isEditMode ? 'Edit Survey Template' : 'New Survey Template'}
      </Heading>

      <VStack spacing={6} align="stretch" mb={8} p={6} borderWidth="1px" borderRadius="lg" bg="gray.50">
        <Input
          placeholder="Template Name (e.g., Initial Damage Assessment)"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          size="lg"
          bg="white"
        />
        <Textarea
          placeholder="Description (e.g., This survey is used by field officers to assess initial damage after a flood incident.)"
          value={templateDescription}
          onChange={(e) => setTemplateDescription(e.target.value)}
          size="md"
          bg="white"
        />
      </VStack>

      <Heading size="lg" mb={4}>Form Fields</Heading>
      <VStack spacing={4} align="stretch" mb={8}>
        {fields.map((field, index) => (
          <FieldEditor
            key={field.id || `new-${index}`}
            field={field}
            index={index}
            onUpdate={handleUpdateField}
            onDelete={handleDeleteField}
          />
        ))}
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAddField} size="lg" w="full">
          Add New Field
        </Button>
      </VStack>

      <HStack justify="flex-end">
        <Button variant="ghost" onClick={() => navigate('/supervisor/survey-templates')} isDisabled={isSaving}>
          Cancel
        </Button>
        <Button colorScheme="teal" onClick={handleSaveTemplate} isLoading={isSaving} loadingText="Saving">
          {isEditMode ? 'Update Template' : 'Create Template'}
        </Button>
      </HStack>
    </Box>
  );
};

export default SurveyFormBuilder;
