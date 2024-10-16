import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function StoryScreen({navigation}: {navigation: any}) {
    const currentStory = useSelector((state: RootState) => state.story.currentStory);
    if (!currentStory) {
        return (
            <View>
                <Text>No Story Found</Text>
            </View>
        );
    }
  return (
    <View style={styles.container}>
        <ImageBackground source={currentStory.image} style={styles.image}>
            <View style={styles.title}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
                    <Image source={currentStory.image} style={styles.profileImage}/>
                    <Text style={styles.text}>{currentStory.name}</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
        
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        flexDirection: 'row',
        margin: 15,
        alignItems: 'center'
    },
    image: {
        flex: 1,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        marginHorizontal: 10,
        borderRadius: 20,
    },
    text: {
        fontSize: 18,
    },
})