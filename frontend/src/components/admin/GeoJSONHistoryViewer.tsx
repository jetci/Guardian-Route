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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Text,
  HStack,
  VStack,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEye, FiRotateCcw, FiGitCompare } from 'react-icons/fi';
import axios from 'axios';

interface GeoJSONHistoryViewerProps {
  boundaryId: string;
}

interface HistoryItem {
  id: string;
  version: number;
  name: string;
  type: string;
  changeType: string;
  changedBy: string;
  changedAt: string;
  changeDetails?: any;
}

export const GeoJSONHistoryViewer: React.FC<GeoJSONHistoryViewerProps> = ({
  boundaryId,
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVersion, setSelectedVersion] = useState<HistoryItem | null>(
    null,
  );
  const [page, setPage] = useState(1);

  // Fetch history
  const { data, isLoading } = useQuery({
    queryKey: ['geojson-history', boundaryId, page],
    queryFn: async () => {
      const response = await axios.get(
        `/api/admin/geojson/${boundaryId}/history`,
        {
          params: { page, limit: 20 },
        },
      );
      return response.data;
    },
  });

  // Restore version mutation
  const restoreMutation = useMutation({
    mutationFn: async (version: number) => {
      const response = await axios.post(
        `/api/admin/geojson/${boundaryId}/history/${version}/restore`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Restore สำเร็จ',
        description: 'กู้คืน GeoJSON เป็น version เก่าสำเร็จ',
        status: 'success',
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ['geojson-history'] });
      queryClient.invalidateQueries({ queryKey: ['geojson'] });
    },
    onError: () => {
      toast({
        title: 'Restore ล้มเหลว',
        status: 'error',
        duration: 3000,
      });
    },
  });

  const handleViewVersion = (item: HistoryItem) => {
    setSelectedVersion(item);
    onOpen();
  };

  const handleRestore = (version: number) => {
    if (
      window.confirm(
        `ต้องการกู้คืน GeoJSON เป็น version ${version} หรือไม่?`,
      )
    ) {
      restoreMutation.mutate(version);
    }
  };

  const getChangeTypeBadge = (changeType: string) => {
    const colors: Record<string, string> = {
      CREATE: 'green',
      UPDATE: 'blue',
      DELETE: 'red',
      RESTORE: 'purple',
    };
    return (
      <Badge colorScheme={colors[changeType] || 'gray'}>{changeType}</Badge>
    );
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="lg" />
        <Text mt={4}>กำลังโหลดประวัติ...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <VStack align="stretch" spacing={4}>
        {/* Stats */}
        <HStack spacing={4}>
          <Text fontWeight="bold">
            ประวัติทั้งหมด: {data?.total || 0} รายการ
          </Text>
          <Text>
            Version ปัจจุบัน: {data?.data?.[0]?.version || 0}
          </Text>
        </HStack>

        {/* History Table */}
        <Box overflowX="auto" borderWidth="1px" borderRadius="md">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>Version</Th>
                <Th>ชื่อ</Th>
                <Th>ประเภท</Th>
                <Th>การเปลี่ยนแปลง</Th>
                <Th>เปลี่ยนโดย</Th>
                <Th>วันที่</Th>
                <Th textAlign="center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.data?.map((item: HistoryItem) => (
                <Tr key={item.id}>
                  <Td fontWeight="bold">v{item.version}</Td>
                  <Td>{item.name}</Td>
                  <Td>
                    <Badge>{item.type}</Badge>
                  </Td>
                  <Td>{getChangeTypeBadge(item.changeType)}</Td>
                  <Td>{item.changedBy}</Td>
                  <Td>{new Date(item.changedAt).toLocaleString('th-TH')}</Td>
                  <Td>
                    <HStack spacing={2} justify="center">
                      <Tooltip label="ดูรายละเอียด">
                        <IconButton
                          aria-label="View"
                          icon={<FiEye />}
                          size="sm"
                          onClick={() => handleViewVersion(item)}
                        />
                      </Tooltip>
                      {item.changeType !== 'DELETE' && (
                        <Tooltip label="Restore version นี้">
                          <IconButton
                            aria-label="Restore"
                            icon={<FiRotateCcw />}
                            size="sm"
                            colorScheme="purple"
                            onClick={() => handleRestore(item.version)}
                            isLoading={restoreMutation.isPending}
                          />
                        </Tooltip>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <HStack justify="center" spacing={2}>
            <Button
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              isDisabled={page === 1}
            >
              ก่อนหน้า
            </Button>
            <Text>
              หน้า {page} / {data.totalPages}
            </Text>
            <Button
              size="sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              isDisabled={page === data.totalPages}
            >
              ถัดไป
            </Button>
          </HStack>
        )}
      </VStack>

      {/* Version Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            รายละเอียด Version {selectedVersion?.version}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedVersion && (
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold">ชื่อ:</Text>
                  <Text>{selectedVersion.name}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">ประเภท:</Text>
                  <Badge>{selectedVersion.type}</Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold">การเปลี่ยนแปลง:</Text>
                  {getChangeTypeBadge(selectedVersion.changeType)}
                </Box>
                <Box>
                  <Text fontWeight="bold">เปลี่ยนโดย:</Text>
                  <Text>{selectedVersion.changedBy}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">วันที่:</Text>
                  <Text>
                    {new Date(selectedVersion.changedAt).toLocaleString(
                      'th-TH',
                    )}
                  </Text>
                </Box>
                {selectedVersion.changeDetails && (
                  <Box>
                    <Text fontWeight="bold">รายละเอียดเพิ่มเติม:</Text>
                    <Box
                      bg="gray.50"
                      p={3}
                      borderRadius="md"
                      fontSize="sm"
                      fontFamily="mono"
                    >
                      <pre>
                        {JSON.stringify(
                          selectedVersion.changeDetails,
                          null,
                          2,
                        )}
                      </pre>
                    </Box>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>ปิด</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
