import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setPosts, setSelectedPost } from '../redux/store/postSlice';
import { dummyPosts } from '../dummydata/DummyDatas';
import { Post } from './HomeScreen';

export default function ExploreScreen({ navigation }: { navigation: any }) {
    const dispatch = useDispatch();
    const posts = useSelector((state: RootState) => state.post.posts);
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const users = useSelector((state: RootState) => state.user.users);
    const [friendsPosts, setFriendsPosts] = useState<Post[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

    useEffect(() => {
        if (currentUser && currentUser.following) {
          const followedUsersPosts = posts.filter((post) => {
            const postAuthor = users.find(user => user.username === post.username);
            return postAuthor && currentUser.following.includes(postAuthor.id);
          });
          console.log('Friends Posts:', followedUsersPosts); // Debug için
          setFriendsPosts(followedUsersPosts);
        }
    }, [currentUser, posts, users]);

    useEffect(() => {
        const filtered = posts.filter(
          post => 
            post.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPosts(filtered)
    }, [searchQuery, posts])

    const handlePostSelect = (post: Post) => {
        dispatch(setSelectedPost(post)); // Seçili postu Redux’a kaydet
        navigation.navigate('PostDetails'); // Post detay ekranına yönlendir
    };

    const renderPhoto = ({ item }: { item: Post }) => {
      const imageSource = typeof item.image === 'string'
        ? { uri: item.image } // Eğer URL ise uzaktaki kaynağı kullan
        : item.image; // Yerel kaynağı direkt kullan
      return (
        <TouchableOpacity onPress={() => handlePostSelect(item)} style={styles.photoContainer}>
            <Image source={imageSource} style={styles.photo} />
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.container}>
        <TextInput 
          style={styles.searchInput}
          placeholder='Search by username or content'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.group}>
        <Text style={styles.title}>Friends Posts</Text>
          {friendsPosts.length > 0 ? (
            <FlatList
              data={friendsPosts}
              renderItem={renderPhoto}
              keyExtractor={item => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noFriendsText}>No friends' photos available</Text>
          )}
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Public Posts</Text>
          <FlatList
              data={filteredPosts}
              renderItem={renderPhoto}
              keyExtractor={(item) => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
    },
    group: {
      flex: 1,
      width: '97%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchInput: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    photoContainer: {
        flex: 1,
        margin: 5,
    },
    photo: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    noFriendsText: {
        textAlign: 'center',
        color: 'gray',
        marginVertical: 10,
    },
});
