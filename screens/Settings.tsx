import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings({ navigation }: { navigation: any }) {

    const handleLogout = async () => {
        await AsyncStorage.removeItem('loggedInUser'); // Kullanıcı bilgisini AsyncStorage'dan kaldır
        //dispatch(setCurrentUser(null)); // Redux'ta kullanıcıyı null yap
        Alert.alert('Logged out', 'You have successfully logged out!');
        navigation.replace('Login'); // Giriş ekranına yönlendirme
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Edit')}>
                <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        marginTop: 30,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1DA1F2',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
