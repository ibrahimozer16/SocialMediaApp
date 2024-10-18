import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { dummyPosts } from '../dummydata/DummyDatas';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleFollow, setUser } from '../redux/store/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [viewedUser, setViewedUser] = useState<string | null>(null);
    const isCurrentUser = user.username === viewedUser; 
    const isFollowing = viewedUser ? user.followingUsers.includes(viewedUser) : false;

    useEffect(() => {
        const fetchViewedUser = async () => {
            const username = await AsyncStorage.getItem('loggedInUser'); // Görüntülenen kullanıcı
            if (username) setViewedUser(username);
        };
        fetchViewedUser();
    }, []);    

    const handleFollowToggle = () => {
        if (viewedUser) {
            dispatch(toggleFollow(viewedUser));
        }
    };

    const renderPhoto = ({ item }: { item: any }) => (
        <Image source={item.image} style={styles.friendPhoto} />
    );

    return (
        <View style={styles.container}>
            <View style={styles.buttons}>
                <TouchableOpacity>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <AntDesign name="setting" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>{user.followers}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                </View>
                <Image
                    source={require('../assets/ibrahim.png')}
                    style={styles.profileImage}
                />
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>{user.following}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                </View>
            </View>

            {/* Profile Information */}
            <View style={styles.profileInfoContainer}>
                <Text style={styles.username}>{viewedUser}</Text>

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                {isCurrentUser ? (
                        <>
                            <TouchableOpacity style={styles.editProfileButton}>
                                <Text style={styles.buttonText}>Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.editProfileButton}>
                                <Text style={styles.buttonText}>Settings</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity style={styles.followButton} onPress={handleFollowToggle}>
                            <Text style={styles.buttonText}>
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Photos from Friends */}
            <View style={styles.photosContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Photos</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={dummyPosts}
                    renderItem={renderPhoto}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Video Section */}
            <View style={styles.photosContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Video</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={dummyPosts}
                    renderItem={renderPhoto}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        height: 150,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 15,
    },
    profileImageWrapper: {
        borderWidth: 5,
        borderColor: 'white',
        borderRadius: 100,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profileInfoContainer: {
        alignItems: 'center',
        padding: 10,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 10,
        alignItems: 'center',
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        color: 'gray',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 10,
    },
    editProfileButton: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    insightsButton: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    followButton: {
        backgroundColor: '#1DA1F2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    photosContainer: {
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeAll: {
        color: '#007BFF',
    },
    friendPhoto: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
});
