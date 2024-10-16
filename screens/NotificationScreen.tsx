import React from 'react';
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { dummyNotifications } from '../dummydata/DummyNotification';

export default function NotificationScreen() {
  const renderNotification = ({ item }: { item: any }) => {
    return (
      <View style={styles.notificationContainer}>
        <Image source={item.user.profileImage} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <Text style={styles.notificationText}>
            {item.type === 'like' && `${item.user.username} liked your post.`}
            {item.type === 'comment' && `${item.user.username} commented: "${item.comment}"`}
            {item.type === 'follow' && `${item.user.username} started following you.`}
          </Text>
          {item.post && (
            <Image source={item.post.postImage} style={styles.postImage} />
          )}
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={dummyNotifications}
      renderItem={renderNotification}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  notificationContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
  },
  postImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
});
