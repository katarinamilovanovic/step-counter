// assets/StepTrackerScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, Alert, Button } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import LoginScreen from './LoginScreen';


const CALORIES_PER_STEP = 0.05;

export default function StepTrackerScreen({ navigation }) {
  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [stressLevel, setStressLevel] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [exercise, setExercise] = useState('');
  const [generalFeel, setGeneralFeel] = useState('');
  const [user, setUser] = useState(null); 
  const auth = getAuth();

  const animationRefRunning = useRef(null);
  const animationRefSitting = useRef(null);


  useEffect(() => {
    const getUserData = async () => {
      try {
        const idToken = await AsyncStorage.getItem('idToken');
        const userId = await AsyncStorage.getItem('userId');

        if (idToken && userId) {
          // Verify the token and get user info if needed
          const user = { uid: userId, idToken }; // 
          setUser(user);
        } else {

          console.log('User not logged in');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    getUserData();

    // Listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        //console.log(idToken, localId);
        console.log('User not logged in');
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, [auth, navigation]);


  useEffect(() => {
    let subscription;
    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const threshold = 0.1;
          const timestamp = new Date().getTime();

          if (
            Math.abs(y - lastY) > threshold && !isCounting && (timestamp - lastTimestamp > 8000)
          ) {
            setIsCounting(true);
            setLastY(y);
            setLastTimestamp(timestamp);

            setSteps((prevSteps) => prevSteps + 1);

            setTimeout(() => {
              setIsCounting(false);
            }, 1200);
          }
        });
      } else {
        console.log('Accelerometer not available on this device');
      }
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isCounting, lastY, lastTimestamp]);

  const resetSteps = () => {
    setSteps(0);
  };

  const estimatedCaloriesBurned = steps * CALORIES_PER_STEP;

  //salje step data firebase-u
  const handleSubmitData = async () => {
    const auth = getAuth();
    //console.log(auth.currentUser);

    try {
      console.log('Sending data...');
      Alert.alert('Debug', 'Submit button pressed!');

      // Create health data payload with current date
      const healthData = {
        uid: user.uid,
        date: new Date(), 
        steps: steps,
        stressLevel: stressLevel,
        waterIntake: waterIntake,
        exercise: exercise,
        generalFeel: generalFeel
      };



      // Send health data to the backend
      const response = await axios.post('http://localhost:5000/api/updateHealthData', healthData);

      Alert.alert('Success', 'Health data updated successfully!');
    } catch (error) {
      console.error('Error updating health data:', error);
      Alert.alert('Error', 'Failed to update health data');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Step Tracker</Text>
      <View style={styles.infoContainer}>
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsText}>{steps}</Text>
          <Text style={styles.stepsLabel}>Steps</Text>
        </View>
        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesLabel}>Estimated Calories Burned:</Text>
          <Text style={styles.caloriesText}>
            {estimatedCaloriesBurned.toFixed(2)} calories
          </Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Stress Level"
          value={stressLevel}
          onChangeText={setStressLevel}
        />
        <TextInput
          style={styles.input}
          placeholder="Water Intake (L)"
          value={waterIntake}
          onChangeText={setWaterIntake}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Exercise (min)"
          value={exercise}
          onChangeText={setExercise}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="General Feel (awful, bad, ok, good, great, amazing)"
          value={generalFeel}
          onChangeText={setGeneralFeel}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={resetSteps}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
      <Button style={styles.button} onPress={handleSubmitData}>
        <Text style={styles.buttonText}>Save Health Data</Text>
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  stepsText: {
    fontSize: 36,
    color: '#3498db',
    fontWeight: 'bold',
    marginRight: 8,
  },
  stepsLabel: {
    fontSize: 24,
    color: '#555',
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  caloriesLabel: {
    fontSize: 20,
    color: '#555',
    marginRight: 6,
  },
  caloriesText: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  animation: {
    width: 400,
    height: 400,
    backgroundColor: 'transparent',
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
