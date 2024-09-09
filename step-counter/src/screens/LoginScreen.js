import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const apiKey = "AIzaSyDZFoJXMGSd_m4X7OSxpQIF-44lAICgkGs"; // Replace with your Firebase Web API Key
    const loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    try {
      // Send HTTP request to Firebase Authentication REST API for login
      const response = await axios.post(loginUrl, {
        email,
        password,
        returnSecureToken: true, // Ensures token is returned on successful login
      });

      const { idToken, localId, email: userEmail } = response.data; // Extract data from response

      // Optionally, store idToken in localStorage or AsyncStorage for further use
      console.log('ID Token:', idToken);

      Alert.alert('Success', 'You are now logged in!');
      navigation.navigate('StepTracker');
    } catch (error) {
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
