import React from 'react';
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
  Spinner,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { FiWifi, FiWifiOff } from 'react-icons/fi';
import { useNotifications } from '../../contexts/NotificationContext';
import type { NotificationType, NotificationPriority } from '../../types/notification';

export const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    isConnected,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead([notificationId]);
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'INCIDENT_ASSIGNED':
      case 'INCIDENT_CREATED':
        return 'red';
      case 'TASK_ASSIGNED':
        return 'orange';
      case 'REPORT_SUBMITTED':
        return 'blue';
      case 'INCIDENT_RESOLVED':
      case 'TASK_COMPLETED':
        return 'green';
      case 'SYSTEM_ALERT':
      case 'SYSTEM_MAINTENANCE':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'URGENT':
        return 'red';
      case 'HIGH':
        return 'orange';
      case 'NORMAL':
        return 'blue';
      case 'LOW':
        return 'gray';
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
            color="white"
            _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
            _active={{ bg: 'rgba(255, 255, 255, 0.3)' }}
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
        <PopoverHeader>
          <HStack justify="space-between">
            <HStack>
              <Text fontWeight="bold">การแจ้งเตือน</Text>
              <Icon
                as={isConnected ? FiWifi : FiWifiOff}
                color={isConnected ? 'green.500' : 'red.500'}
                boxSize={4}
              />
            </HStack>
            {unreadCount > 0 && (
              <Button size="xs" onClick={markAllAsRead}>
                อ่านทั้งหมด
              </Button>
            )}
          </HStack>
        </PopoverHeader>
        <PopoverBody maxH="400px" overflowY="auto">
          {loading ? (
            <VStack py={8}>
              <Spinner />
              <Text fontSize="sm" color="gray.500">
                กำลังโหลด...
              </Text>
            </VStack>
          ) : notifications.length === 0 ? (
            <Text textAlign="center" py={8} color="gray.500">
              ไม่มีการแจ้งเตือน
            </Text>
          ) : (
            <VStack spacing={2} align="stretch">
              {notifications.map((userNotif) => (
                <Box
                  key={userNotif.id}
                  p={3}
                  borderRadius="md"
                  bg={userNotif.isRead ? 'white' : 'blue.50'}
                  cursor="pointer"
                  onClick={() => !userNotif.isRead && handleMarkAsRead(userNotif.notificationId)}
                  _hover={{ bg: 'gray.50' }}
                  borderLeft="4px solid"
                  borderLeftColor={`${getPriorityColor(userNotif.notification.priority)}.400`}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box flex="1">
                      <HStack mb={1}>
                        <Text fontWeight="bold" fontSize="sm">
                          {userNotif.notification.title}
                        </Text>
                        {!userNotif.isRead && (
                          <Badge colorScheme="blue" fontSize="xs">
                            ใหม่
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="xs" color="gray.600" mt={1}>
                        {userNotif.notification.message}
                      </Text>
                      <HStack mt={2} spacing={2}>
                        <Badge
                          colorScheme={getTypeColor(userNotif.notification.type)}
                          fontSize="xs"
                        >
                          {userNotif.notification.type.replace(/_/g, ' ')}
                        </Badge>
                        <Text fontSize="xs" color="gray.400">
                          {new Date(userNotif.createdAt).toLocaleString('th-TH', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </Text>
                      </HStack>
                    </Box>
                  </Box>
                </Box>
              ))}
            </VStack>
          )}
          {notifications.length > 0 && (
            <>
              <Divider my={2} />
              <Button size="sm" width="100%" variant="ghost" onClick={fetchNotifications}>
                รีเฟรช
              </Button>
            </>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
