import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

import AuthStack from './AuthStack';
import StudentDashboard from '../screens/StudentDashboard';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown:false }}>

      {userToken == null ? (

        <Stack.Screen
          name="Auth"
          component={AuthStack}
        />

      ) : (

        <Stack.Screen
          name="Dashboard"
          component={StudentDashboard}
        />

      )}

    </Stack.Navigator>
  );
}