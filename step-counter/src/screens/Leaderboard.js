import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const Leaderboard = () => {
    const [loading, setLoading] = useState(true);
    const [stepsData, setStepsData] = useState([]);

    // Fetch steps data when the component mounts
    useEffect(() => {
        const fetchStepsData = async () => {
            try {
                //console.log('before sending')
                const response = await axios.get('http://localhost:5000/api/steps/today');
                setStepsData(response.data);
            } catch (error) {
                console.error('Error fetching step data:', error);
                Alert.alert('Error', 'Failed to fetch step data.');
            } finally {
                setLoading(false);
            }
        };

        fetchStepsData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View>
            <Text>Steps Data for Today:</Text>
            <FlatList
                data={stepsData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ padding: 10 }}>
                        <Text>User ID: {item.userId}</Text>
                        <Text>Steps: {item.steps}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default Leaderboard;
