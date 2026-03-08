import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authAPI, studentAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.payload.token,
            student: action.payload.student,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.payload.token,
            student: action.payload.student,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            student: null,
          };
        case 'SIGN_UP':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.payload.token,
            student: action.payload.student,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      student: null,
    }
  );

  // Restore token on app startup
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await SecureStore.getItemAsync('student_token');

        if (token) {
          // Verify token is valid by fetching profile
          try {
            const response = await studentAPI.getProfile();
            dispatch({
              type: 'RESTORE_TOKEN',
              payload: { token, student: response.data },
            });
          } catch (error) {
            console.log('[v0] Token validation failed:', error.message);
            await SecureStore.deleteItemAsync('student_token');
            dispatch({
              type: 'RESTORE_TOKEN',
              payload: { token: null, student: null },
            });
          }
        } else {
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { token: null, student: null },
          });
        }
      } catch (error) {
        console.log('[v0] Token restore error:', error.message);
        dispatch({
          type: 'RESTORE_TOKEN',
          payload: { token: null, student: null },
        });
      }
    };

    bootstrapAsync();
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await authAPI.studentLogin(email, password);
      const { token, student } = response.data;

      // Check approval status
      if (student.approval_status === 'pending') {
        return {
          success: false,
          error: 'Your account is pending approval. Please wait for admin confirmation.',
          approvalStatus: 'pending',
        };
      }

      if (student.approval_status === 'rejected') {
        return {
          success: false,
          error: 'Your account has been rejected. Please contact support.',
          approvalStatus: 'rejected',
        };
      }

      // Store token securely
      await SecureStore.setItemAsync('student_token', token);

      dispatch({
        type: 'SIGN_IN',
        payload: { token, student },
      });

      return { success: true, student };
    } catch (error) {
    //   const message = error.response?.data?.message || 'Login failed';
    const message = error.response?.data?.error || 'Login failed';
      return { success: false, error: message };
    }
  };

  const signUp = async (registrationData) => {
    try {
      const response = await authAPI.studentRegister(registrationData);
      const { token, student } = response.data;

      // Auto-login after registration
      await SecureStore.setItemAsync('student_token', token);

      dispatch({
        type: 'SIGN_UP',
        payload: { token, student },
      });

      return { success: true, student };
    } catch (error) {
    //   const message = error.response?.data?.message || 'Registration failed';
    const message = error.response?.data?.error || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('student_token');
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.log('[v0] Logout error:', error.message);
    }
  };

  const authContext = {
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={{ ...state, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
};


// import React, { createContext } from 'react';

// export const AuthContext = createContext();

// const API_URL = "http://192.168.1.3:5000/api/students"

// export const AuthProvider = ({ children }) => {

//   const signIn = async (email, password) => {
//     try {
//       const response = await fetch(`${API_URL}/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         return {
//           success: false,
//           error: data.error || 'Login failed',
//         };
//       }

//       return {
//         success: true,
//         token: data.token,
//         student: data.student,
//       };

//     } catch (error) {
//       console.log('Login error:', error);

//       return {
//         success: false,
//         error: 'Network error. Please check your connection.',
//       };
//     }
//   };

//   const signUp = async (formData) => {
//     try {
//       const response = await fetch(`${API_URL}/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         return {
//           success: false,
//           error: data.error,
//         };
//       }

//       return {
//         success: true,
//         student: data.student,
//       };
//     } catch (error) {
//       console.log('Register error:', error);

//       return {
//         success: false,
//         error: 'Network error',
//       };
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         signIn,
//         signUp,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };