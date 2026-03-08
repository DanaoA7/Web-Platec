'use client';

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { colors } from '../utils/colors';

const DashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const { student, signOut } = useContext(AuthContext);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const endDate = today.toISOString().split('T')[0];

      const [profileRes, attendanceRes] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getAttendance({ start_date: startDate, end_date: endDate }),
      ]);

      setStudentData(profileRes.data);
      setAttendanceStats(attendanceRes.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      if (error.response?.status === 401) {
        await signOut();
        Alert.alert('Session Expired', 'Please login again');
      } else {
        Alert.alert('Error', 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const presentCount = attendanceStats?.present_count || 0;
  const absentCount = attendanceStats?.absent_count || 0;
  const lateCount = attendanceStats?.late_count || 0;
  const totalRecords = presentCount + absentCount + lateCount;
  const attendancePercentage = totalRecords > 0
    ? Math.round((presentCount / totalRecords) * 100)
    : 0;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.studentName}>{studentData?.full_name || 'Student'}</Text>
          <Text style={styles.studentId}>{studentData?.student_id}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => {
          Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', onPress: () => {} },
            { text: 'Logout', onPress: signOut },
          ]);
        }}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Attendance Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>This Month's Attendance</Text>

        <View style={styles.attendancePercentageCard}>
          <View style={styles.percentageCircle}>
            <Text style={styles.percentageText}>{attendancePercentage}%</Text>
          </View>
          <View style={styles.percentageInfo}>
            <Text style={styles.percentageLabel}>Overall Attendance</Text>
            <Text style={styles.percentageSubtext}>{totalRecords} records</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.status.present }]}>
              <Text style={styles.statIconText}>✓</Text>
            </View>
            <Text style={styles.statValue}>{presentCount}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.status.absent }]}>
              <Text style={styles.statIconText}>✕</Text>
            </View>
            <Text style={styles.statValue}>{absentCount}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.status.late }]}>
              <Text style={styles.statIconText}>⏱</Text>
            </View>
            <Text style={styles.statValue}>{lateCount}</Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>
        </View>
      </View>

      {/* Student Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Student Information</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Program</Text>
            <Text style={styles.infoValue}>{studentData?.program || 'N/A'}</Text>
          </View>
          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Year Level</Text>
            <Text style={styles.infoValue}>{studentData?.year_level || 'N/A'}</Text>
          </View>
          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Section</Text>
            <Text style={styles.infoValue}>{studentData?.section || 'N/A'}</Text>
          </View>
          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={[styles.infoValue, styles.emailValue]}>{studentData?.email}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AttendanceHistory')}
        >
          <Text style={styles.actionButtonIcon}>📅</Text>
          <Text style={styles.actionButtonText}>View History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.actionButtonIcon}>🔔</Text>
          <Text style={styles.actionButtonText}>Notifications</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.neutral.bg,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.bg,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  studentName: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  studentId: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  attendancePercentageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  percentageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  percentageInfo: {
    flex: 1,
  },
  percentageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  percentageSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  emailValue: {
    fontSize: 13,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.neutral.border,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '600',
  },
});

export default DashboardScreen;
