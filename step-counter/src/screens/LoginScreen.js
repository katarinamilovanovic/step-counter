import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const apiKey = "AIzaSyDZFoJXMGSd_m4X7OSxpQIF-44lAICgkGs";
    const loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    try {
      const response = await axios.post(loginUrl, {
        email,
        password,
        returnSecureToken: true,
      });

      const { idToken, localId, email: userEmail } = response.data;

      //console.log("Login successful. idToken:", idToken, "localId:", localId);

      // Store idToken and localId in AsyncStorage
      await AsyncStorage.setItem('idToken', idToken);
      await AsyncStorage.setItem('userId', localId);

      Alert.alert('Success', 'You are now logged in!');

      // Navigate to StepTracker only after AsyncStorage is set
      navigation.navigate('StepTracker');
    } catch (error) {
      console.error('Login error:', error.response?.data?.error?.message || error.message);
      Alert.alert('Error', error.response?.data?.error?.message || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <br></br>
      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;
