import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Button, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../redux/store/postSlice';
import { RootState } from '../redux/store';
import { AntDesign } from '@expo/vector-icons';

export default function CreatePost({ navigation }: { navigation: any }) {
    const [content, setContent] = useState('');
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const handlePost = () => {
      if (user.username && content.trim()) {
        const newPost = {
            id: Date.now().toString(),
            username: user.username,
            image: user.profileImage,
            content: content,
            likes: 0,
            liked: false,
            comments: [],
        };

        dispatch(addPost(newPost)); // Redux store'a post eklenir
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
                <Image source={user.profileImage} style={styles.profileImage} />
                <Text style={styles.username}>{user.username}</Text>
            </View>

            <TextInput
                style={styles.textInput}
                placeholder="What's on your mind?"
                value={content}
                onChangeText={setContent}
                multiline
            />

            <View style={styles.mediaContainer}>
                <FlatList
                    data={[user.profileImage]} // Örnek resimler
                    renderItem={({ item }) => <Image source={item} style={styles.mediaImage} />}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                />
            </View>
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
