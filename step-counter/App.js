// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import StepTrackerScreen from './src/screens/StepTrackerScreen';
import HealthHistoryScreen from './src/screens/HealthHistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="StepTracker" component={StepTrackerScreen} />
        <Stack.Screen name="HealthHistory" component={HealthHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
