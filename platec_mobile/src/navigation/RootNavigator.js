'use client';

import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../utils/colors';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const RootNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken == null ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
