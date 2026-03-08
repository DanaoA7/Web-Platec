import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AttendanceHistoryScreen from '../screens/AttendanceHistoryScreen';
import { colors } from '../utils/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="DashboardMain"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <Stack.Screen
        name="AttendanceHistory"
        component={AttendanceHistoryScreen}
        options={{
          title: 'Attendance History',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.light,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: colors.neutral.border,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -4,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <React.Fragment style={{ fontSize: 20, color }}>🏠</React.Fragment>,
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color }) => <React.Fragment style={{ fontSize: 20, color }}>🔔</React.Fragment>,
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
