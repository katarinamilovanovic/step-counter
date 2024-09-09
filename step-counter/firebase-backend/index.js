const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');


const serviceAccount = require('./step-counter-10f91-firebase-adminsdk-gs7ar-f5b2b84508.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://step-counter-10f91-default-rtdb.firebaseio.com/'
});

const db = admin.firestore();

const app = express();
app.use(bodyParser.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
