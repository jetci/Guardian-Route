import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  VStack,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tantml:invoke>
<parameter name="FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiDownload,
  FiPlus,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface CustomLayer {
  id: string;
  name: string;
  description?: string;
  type: string;
  geojson: any;
  style?: any;
  zIndex: number;
  isVisible: boolean;
  createdBy: string;
  createdAt: string;
}

interface LayerFormData {
  name: string;
  description?: string;
  type: string;
  geojson: string;
  fillColor?: string;
  strokeColor?: string;
  opacity?: number;
}

export const CustomLayerEditor: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingLayer, setEditingLayer] = useState<CustomLayer | null>(null);
  const [typeFilter, setTypeFilter] = useState('');
  const { register, handleSubmit, reset, setValue } = useForm<LayerFormData>();

  // Fetch layers
  const { data, isLoading } = useQuery({
    queryKey: ['custom-layers', typeFilter],
    queryFn: async () => {
      const response = await axios.get('/api/admin/layers', {
        params: { type: typeFilter, limit: 50 },
      });
      return response.data;
    },
  });

  // Create/Update layer mutation
  const saveMutation = useMutation({
    mutationFn: async (data: LayerFormData) => {
      const payload = {
        ...data,
        geojson: JSON.parse(data.geojson),
        style: {
          fillColor: data.fillColor || '#3B82F6',
          strokeColor: data.strokeColor || '#1E40AF',
          opacity: data.opacity || 0.5,
        },
      };

      if (editingLayer) {
        return axios.patch(`/api/admin/layers/${editingLayer.id}`, payload);
      } else {
        return axios.post('/api/admin/layers', payload);
      }
    },
    onSuccess: () => {
      toast({
        title: editingLayer ? 'อัพเดทสำเร็จ' : 'สร้างสำเร็จ',
        status: 'success',
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ['custom-layers'] });
      onClose();
      reset();
      setEditingLayer(null);
    },
    onError: () => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        status: 'error',
        duration: 2000,
      });
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: (id: string) =>
      axios.patch(`/api/admin/layers/${id}/toggle-visibility`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-layers'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/admin/layers/${id}`),
    onSuccess: () => {
      toast({
        title: 'ลบสำเร็จ',
        status: 'success',
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ['custom-layers'] });
    },
  });

  // Clone mutation
  const cloneMutation = useMutation({
    mutationFn: (id: string) => axios.post(`/api/admin/layers/${id}/clone`),
    onSuccess: () => {
      toast({
        title: 'คัดลอกสำเร็จ',
        status: 'success',
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ['custom-layers'] });
    },
  });

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: (orders: Array<{ id: string; zIndex: number }>) =>
      axios.post('/api/admin/layers/reorder', orders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-layers'] });
    },
  });

  const handleCreate = () => {
    setEditingLayer(null);
    reset({
      name: '',
      description: '',
      type: 'polygon',
      geojson: '{}',
      fillColor: '#3B82F6',
      strokeColor: '#1E40AF',
      opacity: 0.5,
    });
    onOpen();
  };

  const handleEdit = (layer: CustomLayer) => {
    setEditingLayer(layer);
    reset({
      name: layer.name,
      description: layer.description,
      type: layer.type,
      geojson: JSON.stringify(layer.geojson, null, 2),
      fillColor: layer.style?.fillColor || '#3B82F6',
      strokeColor: layer.style?.strokeColor || '#1E40AF',
      opacity: layer.style?.opacity || 0.5,
    });
    onOpen();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('ต้องการลบ Layer นี้หรือไม่?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleVisibility = (id: string) => {
    toggleVisibilityMutation.mutate(id);
  };

  const handleClone = (id: string) => {
    cloneMutation.mutate(id);
  };

  const handleMoveUp = (layer: CustomLayer, index: number) => {
    if (index === 0) return;
    const layers = data?.data || [];
    const newOrders = layers.map((l: CustomLayer, i: number) => ({
      id: l.id,
      zIndex:
        l.id === layer.id
          ? layers[index - 1].zIndex
          : l.id === layers[index - 1].id
            ? layer.zIndex
            : l.zIndex,
    }));
    reorderMutation.mutate(newOrders);
  };

  const handleMoveDown = (layer: CustomLayer, index: number) => {
    const layers = data?.data || [];
    if (index === layers.length - 1) return;
    const newOrders = layers.map((l: CustomLayer, i: number) => ({
      id: l.id,
      zIndex:
        l.id === layer.id
          ? layers[index + 1].zIndex
          : l.id === layers[index + 1].id
            ? layer.zIndex
            : l.zIndex,
    }));
    reorderMutation.mutate(newOrders);
  };

  const handleExport = async () => {
    const response = await axios.get('/api/admin/layers/export');
    const dataStr = JSON.stringify(response.data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'custom-layers.geojson');
    linkElement.click();
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      marker: 'blue',
      polygon: 'green',
      polyline: 'purple',
      circle: 'orange',
    };
    return <Badge colorScheme={colors[type] || 'gray'}>{type}</Badge>;
  };

  return (
    <VStack align="stretch" spacing={4}>
      {/* Header */}
      <HStack justify="space-between">
        <HStack spacing={4}>
          <Select
            placeholder="ทุกประเภท"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            maxW="200px"
            size="sm"
          >
            <option value="marker">Marker</option>
            <option value="polygon">Polygon</option>
            <option value="polyline">Polyline</option>
            <option value="circle">Circle</option>
          </Select>
          <Text fontSize="sm" color="gray.600">
            ทั้งหมด: {data?.total || 0} Layers
          </Text>
        </HStack>
        <HStack>
          <Button
            leftIcon={<FiDownload />}
            onClick={handleExport}
            size="sm"
            variant="outline"
          >
            Export GeoJSON
          </Button>
          <Button leftIcon={<FiPlus />} onClick={handleCreate} size="sm" colorScheme="blue">
            สร้าง Layer
          </Button>
        </HStack>
      </HStack>

      {/* Table */}
      <Box overflowX="auto" borderWidth="1px" borderRadius="md">
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th width="40px">Order</Th>
              <Th>ชื่อ</Th>
              <Th>ประเภท</Th>
              <Th>คำอธิบาย</Th>
              <Th>Visibility</Th>
              <Th>สร้างเมื่อ</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={7} textAlign="center">
                  กำลังโหลด...
                </Td>
              </Tr>
            ) : data?.data?.length === 0 ? (
              <Tr>
                <Td colSpan={7} textAlign="center">
                  ไม่มี Custom Layer
                </Td>
              </Tr>
            ) : (
              data?.data?.map((layer: CustomLayer, index: number) => (
                <Tr key={layer.id}>
                  <Td>
                    <VStack spacing={0}>
                      <IconButton
                        aria-label="Move up"
                        icon={<FiArrowUp />}
                        size="xs"
                        variant="ghost"
                        onClick={() => handleMoveUp(layer, index)}
                        isDisabled={index === 0}
                      />
                      <Text fontSize="xs">{layer.zIndex}</Text>
                      <IconButton
                        aria-label="Move down"
                        icon={<FiArrowDown />}
                        size="xs"
                        variant="ghost"
                        onClick={() => handleMoveDown(layer, index)}
                        isDisabled={index === data.data.length - 1}
                      />
                    </VStack>
                  </Td>
                  <Td fontWeight="medium">{layer.name}</Td>
                  <Td>{getTypeBadge(layer.type)}</Td>
                  <Td>
                    <Text fontSize="sm" noOfLines={1}>
                      {layer.description || '-'}
                    </Text>
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Toggle visibility"
                      icon={layer.isVisible ? <FiEye /> : <FiEyeOff />}
                      size="sm"
                      variant="ghost"
                      colorScheme={layer.isVisible ? 'green' : 'gray'}
                      onClick={() => handleToggleVisibility(layer.id)}
                    />
                  </Td>
                  <Td fontSize="sm">
                    {new Date(layer.createdAt).toLocaleDateString('th-TH')}
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FiEdit />}
                          onClick={() => handleEdit(layer)}
                        >
                          แก้ไข
                        </MenuItem>
                        <MenuItem
                          icon={<FiCopy />}
                          onClick={() => handleClone(layer.id)}
                        >
                          คัดลอก
                        </MenuItem>
                        <MenuItem
                          icon={<FiTrash2 />}
                          color="red.500"
                          onClick={() => handleDelete(layer.id)}
                        >
                          ลบ
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingLayer ? 'แก้ไข Layer' : 'สร้าง Layer ใหม่'}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>ชื่อ Layer</FormLabel>
                  <Input {...register('name', { required: true })} />
                </FormControl>

                <FormControl>
                  <FormLabel>คำอธิบาย</FormLabel>
                  <Textarea {...register('description')} rows={2} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>ประเภท</FormLabel>
                  <Select {...register('type', { required: true })}>
                    <option value="marker">Marker</option>
                    <option value="polygon">Polygon</option>
                    <option value="polyline">Polyline</option>
                    <option value="circle">Circle</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>GeoJSON</FormLabel>
                  <Textarea
                    {...register('geojson', { required: true })}
                    rows={6}
                    fontFamily="mono"
                    fontSize="sm"
                  />
                </FormControl>

                <HStack width="100%">
                  <FormControl>
                    <FormLabel>Fill Color</FormLabel>
                    <Input type="color" {...register('fillColor')} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Stroke Color</FormLabel>
                    <Input type="color" {...register('strokeColor')} />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Opacity</FormLabel>
                  <NumberInput min={0} max={1} step={0.1} defaultValue={0.5}>
                    <NumberInputField {...register('opacity')} />
                  </NumberInput>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                ยกเลิก
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={saveMutation.isPending}
              >
                {editingLayer ? 'อัพเดท' : 'สร้าง'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
