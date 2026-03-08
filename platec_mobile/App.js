// import React, { useEffect } from 'react';
// import { StatusBar, SafeAreaView } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { AuthProvider } from './src/context/AuthContext';
// import { NotificationProvider } from './src/context/NotificationContext';
// import RootNavigator from './src/navigation/RootNavigator';
// import { colors } from './src/utils/colors';

// export default function App() {
//   useEffect(() => {
//     // Set status bar style
//     StatusBar.setBarStyle('light-content');
//     StatusBar.setBackgroundColor(colors.primary);
//   }, []);

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
//       <AuthProvider>
//         <NotificationProvider>
//           <RootNavigator />
//         </NotificationProvider>
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}