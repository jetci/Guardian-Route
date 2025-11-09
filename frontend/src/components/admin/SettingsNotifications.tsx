import React, { useState } from 'react';
import {
  Box,
  Button,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  VStack,
  HStack,
  Divider,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiBell, FiCheck, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

interface Notification {
  id: string;
  settingKey: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
  isRead: boolean;
  createdAt: string;
}

export const SettingsNotifications: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Fetch notifications
  const { data, isLoading } = useQuery({
    queryKey: ['settings-notifications', showUnreadOnly],
    queryFn: async () => {
      const response = await axios.get('/api/admin/notifications', {
        params: {
          limit: 10,
          unreadOnly: showUnreadOnly,
        },
      });
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['settings-notifications-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/notifications/stats');
      return response.data;
    },
    refetchInterval: 30000,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await axios.patch(
        `/api/admin/notifications/${notificationId}/read`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['settings-notifications'],
      });
      queryClient.invalidateQueries({
        queryKey: ['settings-notifications-stats'],
      });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        '/api/admin/notifications/mark-all-read',
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'ทำเครื่องหมายทั้งหมดสำเร็จ',
        status: 'success',
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: ['settings-notifications'],
      });
      queryClient.invalidateQueries({
        queryKey: ['settings-notifications-stats'],
      });
    },
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await axios.delete(
        `/api/admin/notifications/${notificationId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'ลบการแจ้งเตือนสำเร็จ',
        status: 'success',
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: ['settings-notifications'],
      });
      queryClient.invalidateQueries({
        queryKey: ['settings-notifications-stats'],
      });
    },
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (notificationId: string) => {
    if (window.confirm('ต้องการลบการแจ้งเตือนนี้หรือไม่?')) {
      deleteMutation.mutate(notificationId);
    }
  };

  const getSettingLabel = (key: string) => {
    const labels: Record<string, string> = {
      mapConfig: 'การตั้งค่าแผนที่',
      geminiAiEnabled: 'Gemini AI',
      notificationsEnabled: 'การแจ้งเตือน',
      broadcastEnabled: 'Broadcast',
      geminiApiKey: 'Gemini API Key',
      systemName: 'ชื่อระบบ',
      systemLogo: 'โลโก้ระบบ',
      sessionTimeout: 'Session Timeout',
      maxUploadSize: 'ขนาดไฟล์สูงสุด',
    };
    return labels[key] || key;
  };

  const unreadCount = stats?.unread || 0;

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Box position="relative" display="inline-block">
          <IconButton
            aria-label="Notifications"
            icon={<FiBell />}
            variant="ghost"
            size="lg"
          />
          {unreadCount > 0 && (
            <Badge
              position="absolute"
              top="-1"
              right="-1"
              colorScheme="red"
              borderRadius="full"
              fontSize="xs"
              px={2}
            >
              {unreadCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent width="400px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="bold">
          <HStack justify="space-between">
            <Text>การแจ้งเตือน</Text>
            {unreadCount > 0 && (
              <Badge colorScheme="red">{unreadCount} ใหม่</Badge>
            )}
          </HStack>
        </PopoverHeader>
        <PopoverBody maxH="400px" overflowY="auto" p={0}>
          {isLoading ? (
            <Box p={4} textAlign="center">
              <Text>กำลังโหลด...</Text>
            </Box>
          ) : data?.data?.length === 0 ? (
            <Box p={4} textAlign="center">
              <Text color="gray.500">ไม่มีการแจ้งเตือน</Text>
            </Box>
          ) : (
            <VStack align="stretch" spacing={0} divider={<Divider />}>
              {data?.data?.map((notification: Notification) => (
                <Box
                  key={notification.id}
                  p={3}
                  bg={notification.isRead ? 'white' : 'blue.50'}
                  _hover={{ bg: 'gray.50' }}
                  cursor="pointer"
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                >
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack>
                        <Text fontWeight="bold" fontSize="sm">
                          {getSettingLabel(notification.settingKey)}
                        </Text>
                        {!notification.isRead && (
                          <Badge colorScheme="blue" fontSize="xs">
                            ใหม่
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="xs" color="gray.600">
                        เปลี่ยนโดย: {notification.changedBy}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(notification.createdAt).toLocaleString(
                          'th-TH',
                        )}
                      </Text>
                    </VStack>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <MenuList>
                        {!notification.isRead && (
                          <MenuItem
                            icon={<FiCheck />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                          >
                            ทำเครื่องหมายว่าอ่านแล้ว
                          </MenuItem>
                        )}
                        <MenuItem
                          icon={<FiTrash2 />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                        >
                          ลบ
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </PopoverBody>
        {data?.data?.length > 0 && (
          <PopoverFooter>
            <HStack justify="space-between">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              >
                {showUnreadOnly ? 'แสดงทั้งหมด' : 'แสดงเฉพาะที่ยังไม่อ่าน'}
              </Button>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  leftIcon={<FiCheckCircle />}
                  onClick={handleMarkAllAsRead}
                  isLoading={markAllAsReadMutation.isPending}
                >
                  อ่านทั้งหมด
                </Button>
              )}
            </HStack>
          </PopoverFooter>
        )}
      </PopoverContent>
    </Popover>
  );
};
