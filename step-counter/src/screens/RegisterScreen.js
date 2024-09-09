import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const apiKey = "AIzaSyDZFoJXMGSd_m4X7OSxpQIF-44lAICgkGs"; // Replace with your Firebase Web API Key
    const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

    try {
      // Send HTTP request to Firebase Authentication REST API
      const response = await axios.post(authUrl, {
        email,
        password,
        returnSecureToken: true, // This will return the token in the response
      });

      const { idToken, localId, email: userEmail } = response.data; // Extract necessary data

      // Send the UID and email to your backend server to create the Firestore document
      const backendResponse = await axios.post('http://localhost:5000/api/register', {
        uid: localId,   // Firebase returns `localId` as the user's UID
        email: userEmail,
      });

      Alert.alert('Success', 'Account created! You can now log in.', backendResponse.data.message);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
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

export default RegisterScreen;
