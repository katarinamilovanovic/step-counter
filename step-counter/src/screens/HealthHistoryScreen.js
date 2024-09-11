import React, { useState } from 'react';
import { View, Text, Button, Alert, Picker, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
const { differenceInDays, format, startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear } = require('date-fns');

const HealthHistoryScreen = () => {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState([]);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('week'); // Default filter is 'week'
  const [filteredData, setFilteredData] = useState([]);

  const auth = getAuth();

  // Function to fetch health data based on selected period
  const fetchHealthData = async () => {
    if (loading) return;  // Prevent multiple calls if already loading
    setLoading(true);  // Start loading
    try {
      const idToken = await AsyncStorage.getItem('idToken');
      const userId = await AsyncStorage.getItem('userId');


      if (idToken && userId) {
        setLoading(true);
        const user = { uid: userId, idToken };
        setUser(user);
        console.log('User authenticated, userId:', userId);

        try {
          const response = await axios.get(`http://localhost:5000/getHealthData/${userId}`);
          console.log('API Response:', response.data);
          setHealthData(response.data); // Save the fetched health data to state
        }
        catch (error) {
          console.error('Error fetching data from API:', error.response?.data || error.message);
        }
      }
      else {
        console.log('No token or userId found');
        Alert.alert('Error', 'User ID not found.');
      }

    } catch (error) {
      console.log('Error: ', error);
      Alert.alert('Error', 'Failed to fetch health data.');
    } finally {
      setLoading(false);
    }
  };

  // Function to filter health data by period
  const filterHealthData = () => {
    const currentDate = new Date().toISOString();
    let filteredData = [];

    switch (filter) {
      case 'week':
        filteredData = healthData.filter((data) => {
          const dataDate = new Date(data.date);
          console.log(Math.abs(differenceInDays(dataDate, currentDate)))
          return (Math.abs(differenceInDays(dataDate, currentDate))) <= 7; // Check if within last 7 days
        });
        break;
      case 'month':
        filteredData = healthData.filter((data) => {
          const dataDate = new Date(data.date);
          return (differenceInDays(dataDate, currentDate)) <= 30; // Check if within last 30 days
        });
        break;
      case 'year':
        filteredData = healthData.filter((data) => {
          const dataDate = new Date(data.date);
          return (differenceInDays(dataDate, currentDate)) <= 365; // Check if within last 365 days
        });
        break;
      default:
        filteredData = healthData;
        console.log(filteredData);
        break;
    }
    console.log(filteredData)
    setFilteredData(filteredData);
    return filteredData;
  };

  return (
    <View style={{ padding: 20 }}>

      <Button title="Show All Health Data" onPress={fetchHealthData} />

      <View>
        {healthData.map((data, index) => (
          <View key={index} style={{ marginVertical: 10 }}>
            <Text>Date: {data.date}</Text>
            <Text>Steps: {data.steps}</Text>
            <Text>Stress Level: {data.stressLevel}</Text>
            <Text>Water Intake: {data.waterIntake}</Text>
            <Text>Exercise: {data.exercise}</Text>
            <Text>General Feel: {data.generalFeel}</Text>
          </View>
        ))}
      </View>
      <br></br>

      <Text>Select Period:</Text>
      <Picker selectedValue={filter} onValueChange={(itemValue) => setFilter(itemValue)}>
        <Picker.Item label="Weekly" value="week" />
        <Picker.Item label="Monthly" value="month" />
        <Picker.Item label="Yearly" value="year" />
      </Picker>

      <Button title="Show Health Data" onPress={filterHealthData} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}


      <View>
        {filteredData.map((data, index) => (
          <View key={index} style={{ marginVertical: 10 }}>
            <Text>Date: {data.date}</Text>
            <Text>Steps: {data.steps}</Text>
            <Text>Stress Level: {data.stressLevel}</Text>
            <Text>Water Intake: {data.waterIntake}</Text>
            <Text>Exercise: {data.exercise}</Text>
            <Text>General Feel: {data.generalFeel}</Text>
          </View>
        ))}
      </View>

    </View>
  );
};

export default HealthHistoryScreen;
