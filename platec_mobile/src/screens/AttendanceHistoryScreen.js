'use client';

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { colors } from '../utils/colors';

const AttendanceHistoryScreen = ({ navigation }) => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);
  const { signOut } = useContext(AuthContext);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const response = await studentAPI.getAttendanceHistory({
        start_date: startDate,
        end_date: endDate,
      });

      setAttendanceHistory(response.data);
      filterAttendanceByMonth(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      if (error.response?.status === 401) {
        await signOut();
        Alert.alert('Session Expired', 'Please login again');
      } else {
        Alert.alert('Error', 'Failed to load attendance history');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterAttendanceByMonth = (data) => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth() + 1;

    const filtered = data.filter((record) => {
      const recordDate = new Date(record.attendance_date);
      return (
        recordDate.getFullYear() === year &&
        recordDate.getMonth() + 1 === month
      );
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchAttendanceHistory();
  }, [selectedMonth]);

  useFocusEffect(
    React.useCallback(() => {
      fetchAttendanceHistory();
    }, [selectedMonth])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendanceHistory();
    setRefreshing(false);
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedMonth(newDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return colors.status.present;
      case 'Absent':
        return colors.status.absent;
      case 'Late':
        return colors.status.late;
      default:
        return colors.neutral.border;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return '✓';
      case 'Absent':
        return '✕';
      case 'Late':
        return '⏱';
      default:
        return '?';
    }
  };

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceCard}>
      <View
        style={[
          styles.statusIconContainer,
          { backgroundColor: getStatusColor(item.status) },
        ]}
      >
        <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
      </View>

      <View style={styles.attendanceInfo}>
        <Text style={styles.dateText}>
          {new Date(item.attendance_date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Present</Text>
          <Text style={styles.statValue}>{item.present_count}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Absent</Text>
          <Text style={styles.statValue}>{item.absent_count}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Late</Text>
          <Text style={styles.statValue}>{item.late_count}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyTitle}>No Attendance Records</Text>
      <Text style={styles.emptyText}>
        No attendance records found for {selectedMonth.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })}
      </Text>
    </View>
  );

  if (loading && filteredData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const monthYear = selectedMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const totalRecords = filteredData.length;
  const presentCount = filteredData.filter((r) => r.status === 'Present').length;
  const absentCount = filteredData.filter((r) => r.status === 'Absent').length;
  const lateCount = filteredData.filter((r) => r.status === 'Late').length;
  const attendancePercentage =
    totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Attendance History</Text>
      </View>

      {/* Month Selector */}
      <View style={styles.monthSelectorContainer}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={handlePreviousMonth}
        >
          <Text style={styles.navigationButtonText}>← Previous</Text>
        </TouchableOpacity>

        <Text style={styles.monthText}>{monthYear}</Text>

        <TouchableOpacity
          style={styles.navigationButton}
          onPress={handleNextMonth}
        >
          <Text style={styles.navigationButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      {totalRecords > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Attendance Rate</Text>
            <Text style={styles.summaryValue}>{attendancePercentage}%</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Present</Text>
            <Text style={[styles.summaryValue, { color: colors.status.present }]}>
              {presentCount}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Absent</Text>
            <Text style={[styles.summaryValue, { color: colors.status.absent }]}>
              {absentCount}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Late</Text>
            <Text style={[styles.summaryValue, { color: colors.status.late }]}>
              {lateCount}
            </Text>
          </View>
        </View>
      )}

      {/* Attendance List */}
      <FlatList
        data={filteredData}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item.attendance_date}
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
  headerContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  monthSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  navigationButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexGrow: 1,
  },
  attendanceCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statusIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  attendanceInfo: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statusText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: colors.text.light,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 60,
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

export default AttendanceHistoryScreen;
