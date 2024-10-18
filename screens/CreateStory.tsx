import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Button, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setCurrentStory } from '../redux/store/storySlice';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

interface Story {
    id: string;
    username: string;
    image: any;
    title: string;
}

export default function CreateStory() {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<any>(null);
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleCreateStory = () => {
        if (!title || !image) {
            Alert.alert('Error', 'Please provide a title and select an image.');
            return;
        }

        const newStory: Story = {
            id: Date.now().toString(),
            username: user.username || 'Guest',
            image,
            title,
        };

        dispatch(setCurrentStory(newStory));
        navigation.goBack(); // Geri ana ekrana dön
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Create a New Story</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter story title..."
                value={title}
                onChangeText={setTitle}
            />

            {image ? (
                <Image source={{ uri: image }} style={styles.image} />
            ) : (
                <Button title="Pick an Image" onPress={pickImage} />
            )}

            <TouchableOpacity style={styles.createButton} onPress={handleCreateStory}>
                <Text style={styles.createButtonText}>Create Story</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: '100%',
        padding: 12,
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    createButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
