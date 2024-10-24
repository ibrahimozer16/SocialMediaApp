import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dummyUsers } from '../dummydata/DummyUsers';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { setCurrentUser } from '../redux/store/userSlice';
import { useDispatch } from 'react-redux';

export default function LoginScreen({navigation}:{navigation:any}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = async () => {
        const foundUser = dummyUsers.find(
            (user) => user.username === username && user.password === password
        );

        if(foundUser){
            await AsyncStorage.setItem('loggedInUser', JSON.stringify(foundUser));
            dispatch(setCurrentUser(foundUser));
            navigation.navigate('Main');
        }else{
            Alert.alert('Giriş Başarısız!', 'Kullanıcı Adı Veya Şifre Yanlış!');
        }
    }

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <ScrollView
            contentContainerStyle={styles.scrollContainer} 
            keyboardShouldPersistTaps="handled"
        >
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcome}>Welcome to Social Media</Text>
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.text}>Username</Text>
        <TextInput
            style={styles.input}
            placeholder='Enter Your Username'
            value={username}
            onChangeText={setUsername}
        />
        <Text style={styles.text}>Password</Text>
        <TextInput
            style={styles.input}
            placeholder='Enter Your Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.textSocial}>or continue with</Text>
      </View>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.buttonSocial}>
            <AntDesign name="google" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSocial}>
            <FontAwesome name="facebook-f" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSocial}>
            <AntDesign name="twitter" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#BACDD2FF',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 16,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 30,
      marginTop: 70,
    },
    welcome: {
      fontSize: 30,
      textAlign: 'center',
    },
    loginContainer: {
      marginBottom: 20,
      width: '90%',
      alignSelf: 'center',
    },
    text: {
      fontSize: 16,
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#8EA3AEFF',
      height: 60,
      marginVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 8,
    },
    button: {
      height: 50,
      marginTop: 20,
      justifyContent: 'center',
      backgroundColor: 'darkblue',
      borderRadius: 8,
    },
    buttonText: {
      textAlign: 'center',
      fontSize: 16,
      color: 'white',
    },
    textSocial: {
      fontSize: 14,
      color: 'grey',
      textAlign: 'center',
      marginVertical: 20,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: 10,
    },
    buttonSocial: {
      backgroundColor: 'grey',
      borderRadius: 35,
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });