import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AntDesign from '@expo/vector-icons/AntDesign';
import { dummyUsers } from '../dummydata/DummyUsers';

export default function StoryScreen({navigation}: {navigation: any}) {
    const currentStory = useSelector((state: RootState) => state.story.currentStory);
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    // Story sahibini bulalım (dummyUsers'tan).
    const storyUser = dummyUsers.find(user => user.username === currentStory?.username);
    if (!currentStory) {
        return (
            <View>
                <Text>No Story Found</Text>
            </View>
        );
    }

    const handleProfilePress = (user: {
        id: string;
        username: string;
        profileImage: any;
        followers: string[];
        following: string[];
        about: string;
    }) => {
        // Kullanıcı giriş yapan kullanıcıysa kendi profiline git
        if (user.id === currentUser?.id) {
            navigation.navigate('Profile'); // Kendi profil ekranı
        } else {
            navigation.navigate('UserProfile', { user }); // Diğer kullanıcının profili
        }
    };

  return (
    <View style={styles.container}>
        <ImageBackground 
            source={
                typeof currentStory.image === 'string'
                    ? { uri: currentStory.image } // URI kontrolü
                    : currentStory.image // Yerel kaynak
            } 
            style={styles.image}
        >
            <View style={styles.title}>
                <TouchableOpacity onPress={() => navigation.navigate('Main')}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => {
                        if (storyUser) {
                            handleProfilePress(storyUser);
                        }
                    }}
                >
                    {storyUser?.profileImage && (
                            <Image
                                source={
                                    typeof storyUser.profileImage === 'string'
                                        ? { uri: storyUser.profileImage }
                                        : storyUser.profileImage
                                }
                                style={styles.profileImage}
                            />
                    )}
                    <Text style={styles.text}>{currentStory.username}</Text>
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
        alignItems: 'center',
        top: 30,
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