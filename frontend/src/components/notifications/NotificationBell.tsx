import { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
  Text,
  Badge,
  Button,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { notificationsApi, type Notification } from '../../api/notifications';

export const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      // Silent fail
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsApi.getMyNotifications(10);
      setNotifications(data);
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดการแจ้งเตือนได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      // Silent fail
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast({
        title: 'อ่านทั้งหมดแล้ว',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EMERGENCY':
        return 'red';
      case 'ALERT':
        return 'orange';
      case 'INFO':
        return 'blue';
      case 'UPDATE':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Popover onOpen={fetchNotifications}>
      <PopoverTrigger>
        <Box position="relative" display="inline-block">
          <IconButton
            aria-label="Notifications"
            icon={<BellIcon />}
            variant="ghost"
            size="lg"
          />
          {unreadCount > 0 && (
            <Badge
              colorScheme="red"
              position="absolute"
              top="0"
              right="0"
              borderRadius="full"
              fontSize="xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent width="400px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="bold">
          การแจ้งเตือน
          {unreadCount > 0 && (
            <Button size="xs" ml={2} onClick={handleMarkAllAsRead}>
              อ่านทั้งหมด
            </Button>
          )}
        </PopoverHeader>
        <PopoverBody maxH="400px" overflowY="auto">
          {loading ? (
            <Text textAlign="center" py={4}>
              กำลังโหลด...
            </Text>
          ) : notifications.length === 0 ? (
            <Text textAlign="center" py={4} color="gray.500">
              ไม่มีการแจ้งเตือน
            </Text>
          ) : (
            <VStack spacing={2} align="stretch">
              {notifications.map((notification) => (
                <Box
                  key={notification.id}
                  p={3}
                  borderRadius="md"
                  bg={notification.isRead ? 'white' : 'blue.50'}
                  cursor="pointer"
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                  _hover={{ bg: 'gray.50' }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box flex="1">
                      <Text fontWeight="bold" fontSize="sm">
                        {notification.title}
                      </Text>
                      <Text fontSize="xs" color="gray.600" mt={1}>
                        {notification.message}
                      </Text>
                      <Text fontSize="xs" color="gray.400" mt={1}>
                        {new Date(notification.createdAt).toLocaleString('th-TH')}
                      </Text>
                    </Box>
                    <Badge colorScheme={getTypeColor(notification.type)} ml={2}>
                      {notification.type}
                    </Badge>
                  </Box>
                </Box>
              ))}
            </VStack>
          )}
          <Divider my={2} />
          <Button size="sm" width="100%" variant="ghost">
            ดูทั้งหมด
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
