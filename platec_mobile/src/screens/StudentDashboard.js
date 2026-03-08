import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function StudentDashboard() {
  const { student, signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.name}>{student?.full_name}</Text>

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',alignItems:'center'},
  title:{fontSize:24,fontWeight:'bold'},
  name:{fontSize:20,marginVertical:10},
  button:{backgroundColor:'red',padding:12,borderRadius:6},
  buttonText:{color:'white'}
});