import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function Home() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Platec Mobile</Text>

      <Button
        title="Login"
        onPress={() => router.push('/auth/login')}
      />
    </View>
  );
}