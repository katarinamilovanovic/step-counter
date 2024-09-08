// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './assets/LoginScreen';
import RegisterScreen from './assets/RegisterScreen';
import StepTrackerScreen from './assets/StepTrackerScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="StepTracker" component={StepTrackerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
