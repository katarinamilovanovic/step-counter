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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
