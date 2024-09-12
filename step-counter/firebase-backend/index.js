const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { Timestamp } = admin.firestore;  // Import Timestamp from Firestore



const serviceAccount = require('./step-counter-10f91-firebase-adminsdk-gs7ar-f5b2b84508.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://step-counter-10f91-default-rtdb.firebaseio.com/'
});

const db = admin.firestore();

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { uid, email } = req.body;

  try {
    await db.collection('users').doc(uid).set({
      email: email
    });

    res.status(200).send({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).send({ error: 'Error registering user: ' + error.message });
  }
});

app.post('/api/updateHealthData', async (req, res) => {
  const { uid, date, steps, stressLevel, waterIntake, exercise, generalFeel } = req.body;

  try {
    await db.collection('healthData').add({
      uid: uid,
      date: date,
      steps: steps,
      stressLevel: stressLevel,
      waterIntake: waterIntake,
      exercise: exercise,
      generalFeel: generalFeel
    });

    res.status(200).send({ message: 'Health data added successfully!' });
  } catch (error) {
    console.error('Error adding health data:', error);
    res.status(500).send({ error: 'Error adding health data: ' + error.message });
  }
});


// Fetch health data for a specific user
app.get('/getHealthData/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const healthDataRef = db.collection('healthData');
    const snapshot = await healthDataRef.where('uid', '==', uid).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No matching documents found.' });
    }

    const healthData = [];
    snapshot.forEach((doc) => {
      healthData.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(healthData);
  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).json({ error: 'Failed to fetch health data.' });
  }
});


/*app.post('/api/logout', async (req, res) => {
  try {
    // If you have any server-side logic to handle logout (e.g., invalidating tokens, sessions, etc.), add it here

    // For Firebase, you typically don't need to do much on the backend for logout
    console.log("User logged out on the client-side");

    // Send a success response
    res.status(200).send({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).send({ error: 'Failed to log out user' });
  }
});

*/

// API endpoint to get steps data for today's date
app.get('/api/steps/today', async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString();
    console.log(today);
    const healthDataRef = db.collection('healthData');

    // Query the 'steps' collection for all documents with today's date
    //const healthDataSnapshot = await db.collection('healthData').where('date', '==', today).get();
    const healthDataSnapshot = await healthDataRef.where('date', '==', today).get();
    // If no data is found
    if (healthDataSnapshot.empty) {
      return res.status(404).json({ message: 'No step data found for today' });
    }

    // Collect all steps data
    const stepsData = [];
    healthDataSnapshot.forEach((doc) => {
      const data = doc.data();
      stepsData.push({ id: doc.id, steps: data.steps }); // Extract only 'steps' field
    });

    // Send response
    res.status(200).json(stepsData);
  } catch (error) {
    console.error('Error fetching step data:', error);
    res.status(500).json({ error: 'Failed to fetch step data' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
