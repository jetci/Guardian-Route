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
  Spinner,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon, CheckIcon, CloseIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { apiClient } from "../../api/client";
import type { SurveyTemplate } from '../../types/Survey';
import type { FormField, FieldType } from '../../types/FormBuilder';

// --- Field Components ---

interface FieldProps {
  field: FormField;
  index: number;
  onUpdate: (index: number, newField: FormField) => void;
  onDelete: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const FieldEditor: React.FC<FieldProps> = ({ field, index, onUpdate, onDelete, onMove, isFirst, isLast }) => {
  const [isEditing, setIsEditing] = useState(field.id === 'new');
  const [tempField, setTempField] = useState<FormField>(field);

  const handleSave = () => {
    if (!tempField.label || !tempField.name) {
      alert('โปรดระบุชื่อฟิลด์และชื่อตัวแปร');
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
    setTempField({ ...tempField, options: [...(tempField.options || []), 'ตัวเลือกใหม่'] });
  };

  const handleRemoveOption = (optionIndex: number) => {
    const newOptions = (tempField.options || []).filter((_, i) => i !== optionIndex);
    setTempField({ ...tempField, options: newOptions });
  };

  const renderOptionsEditor = () => {
    if (tempField.type !== 'select' && tempField.type !== 'radio' && tempField.type !== 'checkboxGroup') return null;

    return (
      <VStack align="start" spacing={3} mt={4} p={4} borderWidth="1px" borderRadius="xl" bg="gray.50">
        <Text fontWeight="bold" fontSize="lg" color="gray.700">ตัวเลือก:</Text>
        {(tempField.options || []).map((option, optionIndex) => (
          <HStack key={optionIndex} w="full" spacing={2}>
            <Input
              placeholder={`ตัวเลือกที่ ${optionIndex + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
              size="md"
              bg="white"
              borderRadius="lg"
            />
            <IconButton
              aria-label="Remove option"
              icon={<DeleteIcon />}
              size="md"
              colorScheme="red"
              variant="ghost"
              onClick={() => handleRemoveOption(optionIndex)}
              borderRadius="lg"
            />
          </HStack>
        ))}
        <Button leftIcon={<AddIcon />} size="md" onClick={handleAddOption} w="full" colorScheme="blue" variant="outline" borderRadius="lg">
          เพิ่มตัวเลือก
        </Button>
      </VStack>
    );
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="xl" w="full" bg="white" shadow="lg" transition="all 0.2s" _hover={{ shadow: 'xl' }}>
      <HStack justify="space-between" mb={4}>
        <Heading size="md" color="gray.800">ฟิลด์ที่ {index + 1}: {field.label || 'ฟิลด์ใหม่'}</Heading>
        <HStack spacing={2}>
          <IconButton
            aria-label="Move Up"
            icon={<ArrowUpIcon />}
            size="md"
            onClick={() => onMove(index, 'up')}
            isDisabled={isFirst}
            variant="ghost"
            borderRadius="lg"
          />
          <IconButton
            aria-label="Move Down"
            icon={<ArrowDownIcon />}
            size="md"
            onClick={() => onMove(index, 'down')}
            isDisabled={isLast}
            variant="ghost"
            borderRadius="lg"
          />
          {isEditing ? (
            <>
              <IconButton aria-label="Save" icon={<CheckIcon />} colorScheme="green" size="md" onClick={handleSave} borderRadius="lg" />
              <IconButton aria-label="Cancel" icon={<CloseIcon />} colorScheme="red" size="md" onClick={handleCancel} borderRadius="lg" />
            </>
          ) : (
            <>
              <IconButton aria-label="Edit" icon={<EditIcon />} size="md" colorScheme="blue" variant="outline" onClick={() => setIsEditing(true)} borderRadius="lg" />
              <IconButton aria-label="Delete" icon={<DeleteIcon />} colorScheme="red" size="md" variant="outline" onClick={() => onDelete(index)} borderRadius="lg" />
            </>
          )}
        </HStack>
      </HStack>

      {isEditing ? (
        <VStack align="start" spacing={4}>
          <Input
            placeholder="ชื่อฟิลด์ (เช่น จำนวนบ้านที่ได้รับผลกระทบ)"
            value={tempField.label}
            onChange={(e) => setTempField({ ...tempField, label: e.target.value })}
            size="lg"
            bg="gray.50"
            borderRadius="lg"
          />
          <Input
            placeholder="ชื่อตัวแปร (เช่น affected_houses) - ต้องไม่ซ้ำกัน"
            value={tempField.name}
            onChange={(e) => setTempField({ ...tempField, name: e.target.value.replace(/\s/g, '_').toLowerCase() })}
            size="lg"
            bg="gray.50"
            borderRadius="lg"
          />
          <Select
            value={tempField.type}
            onChange={(e) => setTempField({ ...tempField, type: e.target.value as FieldType, options: [] })}
            size="lg"
            bg="gray.50"
            borderRadius="lg"
          >
            <option value="text">ข้อความสั้น</option>
            <option value="number">ตัวเลข</option>
            <option value="textarea">ข้อความยาว</option>
            <option value="select">ดรอปดาวน์ (Select)</option>
            <option value="radio">ปุ่มตัวเลือก (Radio Buttons)</option>
            <option value="checkbox">ช่องทำเครื่องหมายเดี่ยว</option>
            <option value="checkboxGroup">กลุ่มช่องทำเครื่องหมาย</option>
            <option value="date">วันที่</option>
            <option value="time">เวลา</option>
          </Select>
          <Checkbox
            isChecked={tempField.required}
            onChange={(e) => setTempField({ ...tempField, required: e.target.checked })}
            colorScheme="blue"
          >
            ฟิลด์ที่จำเป็นต้องกรอก
          </Checkbox>
          {renderOptionsEditor()}
        </VStack>
      ) : (
        <VStack align="start" spacing={1} p={2} bg="gray.50" borderRadius="lg">
          <Text fontSize="md" color="gray.700"><strong>ชื่อฟิลด์:</strong> {field.label}</Text>
          <Text fontSize="md" color="gray.700"><strong>ชื่อตัวแปร:</strong> {field.name}</Text>
          <Text fontSize="md" color="gray.700"><strong>ประเภท:</strong> {field.type}</Text>
          <Text fontSize="md" color="gray.700"><strong>จำเป็นต้องกรอก:</strong> {field.required ? 'ใช่' : 'ไม่'}</Text>
          {field.options && field.options.length > 0 && (
            <Text fontSize="md" color="gray.700"><strong>ตัวเลือก:</strong> {field.options.join(', ')}</Text>
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
  const [templateName, setTemplateName] = useState('');
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
        title: 'ข้อผิดพลาดในการดึงข้อมูล',
        description: 'ไม่สามารถโหลดข้อมูลเทมเพลตแบบสำรวจได้',
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

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newFields.length) {
      [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
      setFields(newFields);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast({
        title: 'ข้อผิดพลาดในการตรวจสอบ',
        description: 'โปรดระบุชื่อเทมเพลต',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const hasEmptyField = fields.some(field => !field.label || !field.name);
    if (hasEmptyField) {
      toast({
        title: 'ข้อผิดพลาดในการตรวจสอบ',
        description: 'ฟิลด์ทั้งหมดต้องมีชื่อฟิลด์และชื่อตัวแปร',
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
        title: 'ข้อผิดพลาดในการตรวจสอบ',
        description: 'ชื่อตัวแปรของฟิลด์ทั้งหมดต้องไม่ซ้ำกัน',
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
          title: 'สำเร็จ',
          description: 'อัปเดตเทมเพลตแบบสำรวจเรียบร้อยแล้ว',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await apiClient.post('/survey-templates', payload);
        toast({
          title: 'สำเร็จ',
          description: 'สร้างเทมเพลตแบบสำรวจเรียบร้อยแล้ว',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      navigate('/supervisor/survey-templates');
    } catch (error) {
      console.error('Save Error:', error);
      toast({
        title: 'ข้อผิดพลาด',
        description: 'ไม่สามารถบันทึกเทมเพลตแบบสำรวจได้',
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="xl" color="blue.600" thickness="4px" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Box maxW="6xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
        <Heading mb={6} size="xl" color="gray.900" fontWeight="extrabold">
          {isEditMode ? 'แก้ไขเทมเพลตแบบสำรวจ' : 'สร้างเทมเพลตแบบสำรวจใหม่'}
        </Heading>

        <VStack spacing={6} align="stretch" mb={8} p={8} borderWidth="1px" borderRadius="xl" bg="white" shadow="lg">
          <Input
            placeholder="ชื่อเทมเพลต (เช่น การประเมินความเสียหายเบื้องต้น)"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            size="lg"
            bg="gray.50"
            borderRadius="lg"
            borderColor="gray.300"
          />
          <Textarea
            placeholder="คำอธิบาย (เช่น แบบสำรวจนี้ใช้โดยเจ้าหน้าที่ภาคสนามเพื่อประเมินความเสียหายเบื้องต้นหลังเกิดเหตุน้ำท่วม)"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            size="md"
            bg="gray.50"
            borderRadius="lg"
            borderColor="gray.300"
          />
        </VStack>

        <Heading size="lg" mb={4} color="gray.800" fontWeight="bold">ฟิลด์แบบฟอร์ม</Heading>
        <VStack spacing={6} align="stretch" mb={8}>
          {fields.map((field, index) => (
            <FieldEditor
              key={field.id || `new-${index}`}
              field={field}
              index={index}
              onUpdate={handleUpdateField}
              onDelete={handleDeleteField}
              onMove={handleMoveField}
              isFirst={index === 0}
              isLast={index === fields.length - 1}
            />
          ))}
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAddField} size="lg" w="full" borderRadius="xl" className="shadow-md">
            เพิ่มฟิลด์ใหม่
          </Button>
        </VStack>

        <HStack justify="flex-end" spacing={4}>
          <Button variant="outline" onClick={() => navigate('/supervisor/survey-templates')} disabled={isSaving} size="lg" borderRadius="lg">
            ยกเลิก
          </Button>
          <Button colorScheme="blue" onClick={handleSaveTemplate} isLoading={isSaving} loadingText="กำลังบันทึก" size="lg" borderRadius="lg" className="shadow-md">
            {isEditMode ? 'อัปเดตเทมเพลต' : 'สร้างเทมเพลต'}
          </Button>
        </HStack>
      </Box>
    </div>
  );
};

export default SurveyFormBuilder;
