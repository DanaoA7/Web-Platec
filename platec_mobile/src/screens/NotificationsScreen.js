'use client';

import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NotificationContext } from '../context/NotificationContext';
import { colors } from '../utils/colors';

const NotificationsScreen = () => {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useContext(NotificationContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'absence':
        return '❌';
      case 'late':
        return '⏰';
      case 'present':
        return '✅';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'absence':
        return colors.status.absent;
      case 'late':
        return colors.status.late;
      case 'present':
        return colors.status.present;
      default:
        return colors.primary;
    }
  };

  const handleMarkAsRead = (notificationId, isRead) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  const handleDelete = (notificationId) => {
    Alert.alert('Delete', 'Delete this notification?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: () => deleteNotification(notificationId),
        style: 'destructive',
      },
    ]);
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.is_read && styles.unreadCard]}
      onPress={() => handleMarkAsRead(item.id, item.is_read)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: getNotificationColor(item.type) },
        ]}
      >
        <Text style={styles.icon}>{getNotificationIcon(item.type)}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={[styles.title, !item.is_read && styles.unreadTitle]}>
          {item.title}
        </Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {!item.is_read && <View style={styles.unreadDot} />}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyText}>You're all caught up!</Text>
    </View>
  );

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Mark All as Read */}
      {unreadCount > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Notifications ({unreadCount} unread)
          </Text>
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllButtonText}>Mark All as Read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.bg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.bg,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  markAllButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  markAllButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexGrow: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  body: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    color: colors.text.light,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe0e0',
  },
  deleteButtonText: {
    fontSize: 16,
    color: colors.status.absent,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
