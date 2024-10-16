import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, Button, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setCurrentStory } from '../redux/store/storySlice';
import { setCurrentPost, updatePostComments, updatePostLikes } from '../redux/store/postSlice';
import { setUser } from '../redux/store/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { dummyStories, dummyPosts } from '../dummydata/DummyDatas';
import { dummyUsers } from '../dummydata/DummyUsers';

interface Post {
    id: string;
    username: string;
    image: any;
    content: string,
    likes: number;
    liked: boolean,
    comments: { id: string; text: string }[];
}

export default function HomeScreen({navigation}:{navigation:any}) {
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [commentModal, setCommentModal] = useState(false);
    const [newComment, setNewComment] = useState('');
    const currentPost = useSelector((state: RootState) => state.post.currentPost);
    

    // Giriş yapan kullanıcıyı al
    useEffect(() => {
        const getLoggedInUser = async () => {
            const username = await AsyncStorage.getItem('loggedInUser');
            
            if (username) {
                const loggedInUserData = dummyUsers.find(user => user.username === username);
                if (loggedInUserData) {
                    dispatch(setUser({
                        username: loggedInUserData.username, 
                        profileImage: loggedInUserData.profileImage,
                        followers: loggedInUserData.followers,
                        following: loggedInUserData.following,                        
                    }));
                    setUserPosts(dummyPosts);
                }
            }
        };

        getLoggedInUser();
    }, [dispatch]);

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
        const updatedPosts = userPosts.map(post => {
            if (post.id === postId) {
                const isLiked = post.liked ?? false;
                return {
                    ...post,
                    liked: !isLiked,
                    likes: isLiked ? post.likes - 1 : post.likes + 1,
                };
            }
            return post;
        });

        setUserPosts(updatedPosts);

        // Redux store'da beğenme sayısını güncelle
        const updatedPost = updatedPosts.find(post => post.id === postId);
        if (updatedPost) {
            dispatch(updatePostLikes({ 
                postId: updatedPost.id, 
                likes: updatedPost.likes, 
                liked: updatedPost.liked 
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

    const renderPost = ({ item }:{item:any}) => (
        <View style={styles.postContainer}>
            <TouchableOpacity 
                style={styles.postHeader} 
                onPress={() => {
                    dispatch(setCurrentPost(item))
                    navigation.navigate('Profile')
                }}
            >
                <Image source={item.image} style={styles.userImage}/>
                <Text style={styles.postUsername}>{item.username}</Text>
            </TouchableOpacity>
            <Image source={item.image} style={styles.postImage} />
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
    );

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
                    data={dummyStories}
                    renderItem={renderStory}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <View style={styles.create}>
                {user.profileImage ? <Image source={user.profileImage} style={styles.profileImage}/> : null}
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Whats on your mind?</Text>
                </TouchableOpacity>
            </View>

            {/* Gönderiler */}
            <View style={styles.postsContainer}>
                {userPosts.length > 0 ? (
                    <FlatList
                        data={userPosts}
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
    },
    buttonText: {
        width: 320,
        height: 40,
        paddingLeft: 20,
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
