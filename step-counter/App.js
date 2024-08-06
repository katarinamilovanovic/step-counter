import React, {useState, useEffect, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Constants } from 'expo-constants';
import LottieView from 'lottie-react-native';

const CALORIES_PER_STEP = 0.05;

export default function App() {

  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting ] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);

  const animationRefRunning = useRef(null);
  const animationRefSitting = useRef(null);

  useEffect(() =>{
    let subscription;
    Accelerometer.isAvailableAsync().then((result) => {
      if(result){
        subscription = Accelerometer.addListener((accelerometer) => {
          const {y} = accelerometerData;
          const threshold = 0.1;
          const timestamp = new Date().getTime();

          if(
            Math.abs(y - lastY) > threshold && !isCounting && (timestamp - lastTimestamp > 8000)
          ) {
            setIsCounting(true);
            setLastY(y);
            setLastTimestamp(timestamp);

            setSteps((prevSteps) => prevSteps +1);
            
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
      if(subscription) {
        subscription.remove();
      }
    };
  }, [isCounting, lastY, lastTimestamp]);

  const resetSteps = () => {
    setSteps(0);
  };

  const estimatedCaloriesBurned = steps*CALORIES_PER_STEP;

  return (
    <SafeAreaView style={styles.container}>
      <Text style = {styles.title}>Step Tracker</Text>
      <View style={styles.infoContainer}>
        <View style = {styles.stepsContainer}>
          <Text style = {styles.stepsText}>{steps}</Text>
          <Text style = {styles.stepsLabel}>Steps</Text>
        </View>
        <View style = {styles.caloriesContainer}>
          <Text style = {styles.caloriesLabel}>
            Estimated Calories Burned:
          </Text>
          <Text style={styles.caloriesText}>
            {estimatedCaloriesBurned.toFixed(2)} calories
          </Text>
        </View>
      </View>
      <View style={styles.animationContainer} >
        {isCounting? (
          <LottieView 
            autoPlay
            ref={animationRefRunning}
            style={styles.animation}
            source={require('./assets/walking.json')}
          />
        ) : (
          <LottieView
          autoPlay
          ref={animationRefSitting}
          style={styles.animation}
          source={require('./assets/sitting.json')}
          />
        )}
      </View>
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
  title:{
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: "#333"
  },
  informationContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  stepsContainer :{
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20
  },
  stepsText: {
    fontSize: 36,
    color: '#3498db',
    fontWeight: 'bold',
    marginRight: 8
  },
  stepsLabel: {
    fontSize: 24,
    color: '#555'
  },
  caloriesContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom: 20
  },
  caloriesLabel:{
    fontSize: 20,
    color: '#555',
    marginRight:6
  },
  caloriesText:{
    fontSize: 18,
    color:'#e74c3c',
    fontWeight:'bold'
  },
  animationContainer:{
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: '#e0e0e0',
    borderRadius:15,
    padding: 20,
    marginBottom:20,
    elevation: 5
  },
  animation:{
    width: 400,
    height: 400,
    backgroundColor: 'transparent'
  }
});
