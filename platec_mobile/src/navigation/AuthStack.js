// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegisterScreen';
// import { colors } from '../utils/colors';

// const Stack = createNativeStackNavigator();

// const AuthStack = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//         cardStyle: { backgroundColor: 'white' },
//         animationEnabled: true,
//         gestureEnabled: true,
//       }}
//     >
//       <Stack.Screen
//         name="Login"
//         component={LoginScreen}
//         options={{
//           animationTypeForReplace: true,
//         }}
//       />
//       <Stack.Screen
//         name="Register"
//         component={RegisterScreen}
//         options={{
//           cardStyle: { backgroundColor: colors.neutral.lightGray },
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default AuthStack;


import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { colors } from '../utils/colors';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'white' },
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          contentStyle: { backgroundColor: colors.neutral.lightGray },
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;