import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setCurrentUser } from '../redux/store/userSlice';
import * as ImagePicker from 'expo-image-picker';
import { dummyPosts } from '../dummydata/DummyDatas';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfile({ navigation }: { navigation: any }) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const [username, setUsername] = useState(currentUser?.username ?? '');
    const [about, setAbout] = useState(currentUser?.about ?? '');
    const [profileImage, setProfileImage] = useState(currentUser?.profileImage || null);

    const handleSave = () => {
        if (username.trim() === '') {
            Alert.alert('Error', 'Username cannot be empty!');
            return;
        }

        if (!currentUser?.id) {
          Alert.alert('Error', 'User ID is missing!');
          return;
        }

        const updatedUser = {
            ...currentUser,
            username,
            about,
            profileImage
        };
        dispatch(setCurrentUser(updatedUser));
        
        // dispatch(updateCurrentUser({username, about, profileImage}));

        // AsyncStorage.setItem(
        //   'loggedInUser',
        //   JSON.stringify({username, about, profileImage})
        // );


        // Redux'ta güncelleme işlemi
        // dispatch(setCurrentUser({ ...currentUser, username, about, profileImage }));
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
    };

    const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
      });

      if (!result.canceled) {
          setProfileImage({ uri: result.assets[0].uri });
      }
    };

    const renderPhoto = ({ item }: { item: any }) => (
      <Image source={item.image} style={styles.friendPhoto} />
    );

    return (
      <View style={styles.container}>
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
                  <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={currentUser?.profileImage}
                        style={styles.profileImage}
                    />
                  </TouchableOpacity>
                  <View style={styles.stat}>
                      <Text style={styles.statNumber}>{currentUser?.following.length || 0}</Text>
                      <Text style={styles.statLabel}>Following</Text>
                  </View>
              </View>

              <View style={styles.profileInfoContainer}>
                  <TextInput 
                    style={styles.username}
                    value={username}
                    onChangeText={setUsername}
                  />
                  <View style={styles.aboutContainer}>
                      <Text style={styles.aboutTitle}>About</Text>
                      <TextInput 
                        style={styles.about}
                        value={about}
                        onChangeText={setAbout}
                      />
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
              <View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
          </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    container1: {
        width: '97%',
        alignSelf: 'center',
        marginTop: 40,
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
    saveButton: {
        backgroundColor: '#1DA1F2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
