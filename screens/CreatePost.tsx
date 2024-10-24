import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Button, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, setCurrentPost } from '../redux/store/postSlice';
import { RootState } from '../redux/store';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function CreatePost({ navigation }: { navigation: any }) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string|null>(null)
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission required', 'You need to grant camera roll permissions to select an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handlePost = () => {
      if (user.currentUser?.username && content.trim()) {
        const newPost = {
            id: Date.now().toString(),
            username: user.currentUser.username,
            image: image,
            content,
            likes: 0,
            liked: false,
            comments: [],
        };

        dispatch(addPost(newPost)); // Redux store'a post eklenir
        dispatch(setCurrentPost(newPost));
        navigation.goBack(); // Ana ekrana geri dön
    }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create post</Text>
                <Button title="Post" onPress={handlePost} />
            </View>

            <View style={styles.userInfoContainer}>
                <Image source={user.currentUser?.profileImage} style={styles.profileImage} />
                <Text style={styles.username}>{user.currentUser?.username}</Text>
            </View>

            <TextInput
                style={styles.textInput}
                placeholder="What's on your mind?"
                value={content}
                onChangeText={setContent}
                multiline
            />

            <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
                <Text style={styles.pickImageText}>Pick an image</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    textInput: {
        margin: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        textAlignVertical: 'top',
    },
    pickImageButton: {
        backgroundColor: '#1e90ff',
        padding: 12,
        margin: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    pickImageText: {
        color: 'white',
        fontWeight: 'bold',
    },
    mediaContainer: {
        marginHorizontal: 16,
        marginTop: 10,
    },
    mediaImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
});
