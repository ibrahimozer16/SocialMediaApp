import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setPosts, setSelectedPost } from '../redux/store/postSlice';
import { dummyPosts } from '../dummydata/DummyDatas';
import { Post } from './HomeScreen';

export default function ExploreScreen({ navigation }: { navigation: any }) {
    const dispatch = useDispatch();
    const posts = useSelector((state: RootState) => state.post.posts);
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const [friendsPosts, setFriendsPosts] = useState<Post[]>([]);

    useEffect(() => {
        dispatch(setPosts(dummyPosts)); // Postları Redux’a yükle
        if(currentUser) {
          const followedUsersPosts = posts.filter(
            post => currentUser.following.includes(post.id ?? '')
          )
          setFriendsPosts(followedUsersPosts);
        }
    }, [dispatch, currentUser, posts]);

    const handlePostSelect = (post: Post) => {
        dispatch(setSelectedPost(post)); // Seçili postu Redux’a kaydet
        navigation.navigate('PostDetails'); // Post detay ekranına yönlendir
    };

    const renderPhoto = ({ item }: { item: Post }) => (
        <TouchableOpacity onPress={() => handlePostSelect(item)} style={styles.photoContainer}>
            <Image source={item.image} style={styles.photo} />
        </TouchableOpacity>
    );

    // const friendsPosts = posts.filter(
    //   (post) => currentUser?.following.includes(post.username ?? '')
    // );

    // const publicPosts = posts.filter(
    //   (post) => !currentUser?.following.includes(post.username ?? '')
    // );

    return (
      <View style={styles.container}>
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
              data={posts}
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
