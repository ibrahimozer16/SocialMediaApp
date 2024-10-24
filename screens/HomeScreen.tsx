import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, Button, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setCurrentStory, setStories } from '../redux/store/storySlice';
import { setCurrentPost, updatePostComments, updatePostLikes, setPosts } from '../redux/store/postSlice';
import { setUsers, setCurrentUser } from '../redux/store/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { dummyStories, dummyPosts } from '../dummydata/DummyDatas';
import { dummyUsers } from '../dummydata/DummyUsers';

export interface Post {
    id: string;
    username: string | null;
    image: any;
    content: string,
    likes: number;
    liked?: boolean,
    comments: { id: string; text: string }[];
}

export default function HomeScreen({navigation}:{navigation:any}) {
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const [commentModal, setCommentModal] = useState(false);
    const [newComment, setNewComment] = useState('');
    const currentPost = useSelector((state: RootState) => state.post.currentPost);
    const posts = useSelector((state: RootState) => state.post.posts);
    const stories = useSelector((state: RootState) => state.story.stories);

    // Giriş yapan kullanıcıyı al
    useEffect(() => {
        const getLoggedInUser = async () => {
            const username = await AsyncStorage.getItem('loggedInUser');
            
            if (username) {
                const loggedInUserData = dummyUsers.find(user => user.username === username);
                if (loggedInUserData) {
                    dispatch(setCurrentUser(loggedInUserData));
                }
            }
            dispatch(setUsers(dummyUsers));
            // Dummy story'leri Redux'a yükle
            dispatch(setStories(dummyStories));
            // Redux store'a dummy post'ları yükle
            dispatch(setPosts(dummyPosts));
        };
    
        getLoggedInUser();
    }, [dispatch]);

    useEffect(() => {
        if (currentUser) {
            const updatedPosts = posts.map(
                post => post.username === currentUser.username
                ? { ...post, username: currentUser.username }
                : post
            );
            setUserPosts(updatedPosts);
        }
    }, [currentUser, posts])

    const handleProfilePress = (user: { 
        id: string; 
        username: string; 
        profileImage: any; 
        followers: string[]; 
        following: string[]; 
        about: string;
    }) => {
        if (user.id === currentUser?.id) {
            navigation.navigate('Profile');
        } else {
            navigation.navigate('UserProfile', { user });
        }
    };

    const handleAddComment = () => {
        if (currentPost && newComment.trim()) {
            const updatedComments = [...currentPost.comments, { id: Date.now().toString(), text: newComment }];
            dispatch(updatePostComments({ postId: currentPost.id, comments: updatedComments }));

            setUserPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === currentPost.id ? { ...post, comments: updatedComments } : post
                )
            );

            setNewComment('');
            setCommentModal(false);
        }
    }

    const handleLike = (postId: string) => {
        const postToUpdate = posts.find((post) => post.id === postId);
    
        if (postToUpdate) {
            const isLiked = postToUpdate.liked ?? false;
            const updatedPost = {
                ...postToUpdate,
                liked: !isLiked,
                likes: isLiked ? postToUpdate.likes - 1 : postToUpdate.likes + 1,
            };

            // Redux store'da post'u güncelle
            dispatch(updatePostLikes({
                postId: updatedPost.id,
                likes: updatedPost.likes,
                liked: updatedPost.liked,
            }));
        }
    };

    const renderStory = ({ item }:{item:any}) => (
        <TouchableOpacity 
            style={styles.storyContainer} 
            onPress={() => {
                dispatch(setCurrentStory(item));
                navigation.navigate('Story')
            }}
        >
            <Image source={item.image} style={styles.storyImage} />
            <Text style={styles.storyName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderPost = ({ item }:{item:Post}) => {
        const postUser = dummyUsers.find(user => user.username === item.username);
        const imageSource = typeof item.image === 'string'
            ? { uri: item.image } // Eğer URL ise uzaktaki kaynağı kullan
            : item.image; // Yerel kaynağı direkt kullan
        return (
            <View style={styles.postContainer}>
            <TouchableOpacity 
                style={styles.postHeader} 
                onPress={() => {
                    dispatch(setCurrentPost(item))
                    if (postUser) {
                        handleProfilePress(postUser)
                    }
                }}
            >
                {postUser?.profileImage && (
                    <Image 
                        source={typeof postUser.profileImage === 'string' 
                            ? { uri: postUser.profileImage } 
                            : postUser.profileImage
                        }
                        style={styles.userImage} 
                    />
                )}
                <Text style={styles.postUsername}>{item.username}</Text>
            </TouchableOpacity>
            <Image source={imageSource} style={styles.postImage} />
            <Text style={styles.postContent}>{item.content}</Text>
            <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>
                    <AntDesign 
                        name={item.liked ? 'heart' : 'hearto'}
                        size={24} 
                        color={item.liked ? 'red' : 'black'}
                    />
                    <Text>{item.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => {
                        dispatch(setCurrentPost(item));
                        setCommentModal(true);
                    }}
                >
                    <FontAwesome name="comment-o" size={24} color="black" />
                    <Text>{item.comments.length}</Text>
                </TouchableOpacity>
            </View>
        </View>
        )
        
    };

    useEffect(() => {
        setUserPosts(posts); // Redux'tan postları al ve userPosts state'ine ata
    }, [posts]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.welcome}>
                    My App
                </Text>
            </View>

            {/* Hikayeler */}
            <View style={styles.storiesContainer}>
                <FlatList
                    data={stories}
                    renderItem={renderStory}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <View style={styles.create}>
                {user.currentUser?.profileImage ? <Image source={user.currentUser.profileImage} style={styles.profileImage}/> : null}
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Whats on your mind?</Text>
                </TouchableOpacity>
            </View>

            {/* Gönderiler */}
            <View style={styles.postsContainer}>
                {posts.length > 0 ? (
                    <FlatList
                        data={posts}
                        renderItem={renderPost}
                        keyExtractor={item => item.id}
                        scrollEnabled={false} // ScrollView ile sarıldığı için false yapıyoruz
                    />
                ) : (
                    <Text style={styles.noPosts}>No posts available</Text>
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create a Post or Story</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('CreatePost')
                            }}
                        >
                            <Text style={styles.modalButtonText}>Create a Post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('CreateStory')
                            }}
                        >
                            <Text style={styles.modalButtonText}>Create a Story</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.modalCloseButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={commentModal}
                onRequestClose={() => setCommentModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent1}>
                        {currentPost ? 
                            <>
                                <Text style={styles.postUsername}>{currentPost.username}</Text>
                                <Image source={currentPost.image} style={styles.postImage}/>
                                <Text style={styles.postContent}>{currentPost.content}</Text>
                                <FlatList 
                                    data={currentPost.comments}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({item}) => (
                                        <Text>{item.text}</Text>
                                    )}
                                />
                                <TextInput 
                                    style={styles.commentInput}
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChangeText={setNewComment}
                                />
                                <TouchableOpacity onPress={handleAddComment}>
                                    <Text>Add Comment</Text>
                                </TouchableOpacity>
                            </> : <Text>No found post</Text>}
                        <TouchableOpacity onPress={() => setCommentModal(false)}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        marginTop: 10,
        padding: 15,
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    storiesContainer: {
        height: 100,
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    storyContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    storyImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    storyName: {
        marginTop: 5,
        fontSize: 12,
    },
    userImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 10,
    },
    create: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
    },
    button: {
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        width: '80%'
    },
    buttonText: {
        width: 320,
        height: 40,
        paddingLeft: 30,
        textAlignVertical: 'center',
        color: '#3B3B3BFF',
    },
    postsContainer: {
        marginVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    postContainer: {
        marginBottom: 20,
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    postUsername: {
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 5,
    },
    postImage: {
        width: '100%',
        height: 300,
    },
    postContent: {
        fontWeight: 'bold',
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    noPosts: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalContent1: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        width: '60%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalCloseButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        width: '50%',
        alignItems: 'center',
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '100%',
    }
});
