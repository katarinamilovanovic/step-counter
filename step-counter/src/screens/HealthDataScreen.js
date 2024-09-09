import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button } from 'react-native';
import { getFirestore, doc, getDoc, collection, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebaseConfig';

const HealthDataScreen = () => {
    const [data, setData] = useState({
        week: [],
        month: [],
        year: [],
    });

    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('week'); // 'week', 'month', 'year'
    const auth = getAuth();
    const user = auth.currentUser;



    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                const uid = user.uid;
                const now = new Date();
                const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

                try {
                    let q;

                    switch (period) {
                        case 'week':
                            // Fetch weekly data
                            q = query(collection(db, 'healthData'), where('uid', '==', uid));
                            break;
                        case 'month':
                            // Fetch monthly data
                            q = query(collection(db, 'healthData'), where('uid', '==', uid));
                            break;
                        case 'year':
                            // Fetch yearly data
                            q = query(collection(db, 'healthData'), where('uid', '==', uid));
                            break;
                        default:
                            break;
                    }

                    const querySnapshot = await getDocs(q);
                    const fetchedData = [];

                    querySnapshot.forEach((doc) => {
                        fetchedData.push(doc.data());
                    });

                    setData({
                        ...data,
                        [period]: fetchedData,
                    });
                } catch (error) {
                    console.error('Error fetching health data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.error('User not logged in');
            }
        };

        fetchData();
    }, [user, period]);

    if (loading) {
        return <ActivityIndicator size="large" color="#3498db" />;
    }


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Health History</Text>
            <Button title="Week" onPress={() => setPeriod('week')} />
            <Button title="Month" onPress={() => setPeriod('month')} />
            <Button title="Year" onPress={() => setPeriod('year')} />

            {data[period].map((entry, index) => (
                <View key={index} style={styles.entry}>
                    <Text>Date: {entry.date}</Text>
                    <Text>Steps: {entry.steps}</Text>
                    <Text>Stress Level: {entry.stressLevel}</Text>
                    <Text>Water Intake: {entry.waterIntake}</Text>
                    <Text>Exercise: {entry.exercise}</Text>
                    <Text>General Feel: {entry.generalFeel}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
    },
    entry: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
});

export default HealthDataScreen;
