import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { dummyPosts } from '../dummydata/DummyDatas';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function ProfileScreen({navigation}:{navigation: any}) {
    const { currentUser } = useSelector((state: RootState) => state.user);

    const renderPhoto = ({ item }: { item: any }) => (
        <Image source={item.image} style={styles.friendPhoto} />
    );


    return (
        <ScrollView style={styles.container}>
            <View style={styles.container1}>
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{currentUser?.followers.length || 0}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <Image
                        source={currentUser?.profileImage}
                        style={styles.profileImage}
                    />
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{currentUser?.following.length || 0}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>

                <View style={styles.profileInfoContainer}>
                    <Text style={styles.username}>{currentUser?.username}</Text>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('Edit')}>
                            <Text style={styles.buttonText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('Settings')}>
                            <Text style={styles.buttonText}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.aboutContainer}>
                        <Text style={styles.aboutTitle}>About</Text>
                        <Text style={styles.about}>{currentUser?.about}</Text>
                    </View>
                </View>

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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    container1: {
        width: '97%',
        alignSelf: 'center'
    },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
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
        marginTop: 10,
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
    aboutContainer: {
        width: '100%',
        alignItems: 'flex-start',
    },
    aboutTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    about: {
        fontSize: 14,
    },
});
