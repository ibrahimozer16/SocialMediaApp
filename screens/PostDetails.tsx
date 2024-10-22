import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AntDesign from '@expo/vector-icons/AntDesign';
import { updatePostLikes, updatePostComments } from '../redux/store/postSlice';

export default function PostDetails() {
    const selectedPost = useSelector((state: RootState) => state.post.selectedPost);
    const dispatch = useDispatch();
    const [post, setPost] = useState(selectedPost);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        setPost(selectedPost); // Redux'tan gelen post'u state'e aktarıyoruz
    }, [selectedPost]);

    if (!post) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Post not found.</Text>
            </View>
        );
    }

    const handleLike = () => {
        const isLiked = post.liked;
        const updatedLikes = isLiked ? post.likes - 1 : post.likes + 1;

        // Redux'a güncelleme gönder
        dispatch(updatePostLikes({
            postId: post.id,
            likes: updatedLikes,
            liked: !isLiked,
        }));

        // Yerel state'i güncelle
        setPost({ ...post, likes: updatedLikes, liked: !isLiked });
    };

    const handleAddComment = () => {
        if (newComment.trim() !== '') {
            const updatedComments = [...post.comments, { id: Date.now().toString(), text: newComment }];

            // Redux'a güncelleme gönder
            dispatch(updatePostComments({
                postId: post.id,
                comments: updatedComments,
            }));

            // Yerel state'i güncelle
            setPost({ ...post, comments: updatedComments });
            setNewComment(''); // Yorum alanını temizle
        }
    };

    const renderComment = ({ item }: { item: any }) => (
        <Text style={styles.comment}>{item.text}</Text>
    );

    return (
        <View style={styles.container}>
            <View style={styles.postHeader}>
                <Image source={post.image} style={styles.profileImage} />
                <Text style={styles.username}>{post.username}</Text>
            </View>

            <Image source={post.image} style={styles.postImage} />
            <Text style={styles.content}>{post.content}</Text>

            <View style={styles.stats}>
                <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                    <AntDesign 
                        name={post.liked ? 'heart' : 'hearto'}
                        size={24} 
                        color={post.liked ? 'red' : 'black'}
                    />
                    <Text>{post.likes}</Text>
                </TouchableOpacity>
                <Text style={styles.stat}>Comments: {post.comments.length}</Text>
            </View>

            <FlatList
                data={post.comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id}
                extraData={post.comments} // Güncellemeleri otomatik izlemek için
            />

            {/* Yeni Yorum Ekleme */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity onPress={handleAddComment}>
                    <Text style={styles.addCommentButton}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
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
    postImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginVertical: 10,
    },
    content: {
        fontSize: 16,
        marginBottom: 10,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    stat: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    comment: {
        marginVertical: 5,
        padding: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    addCommentButton: {
        color: 'blue',
        fontWeight: 'bold',
    },
});
