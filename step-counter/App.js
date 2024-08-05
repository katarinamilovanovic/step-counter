import React, {useState, useEffect, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Constants } from 'expo-constants';
import LottieView from 'lottie-react-native';


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

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
