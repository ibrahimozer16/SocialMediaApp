// dummyNotifications.ts

export const dummyNotifications = [
    {
      id: '1',
      user: {
        username: 'ibrahim',
        profileImage: require('../assets/ibrahim.png'),
      },
      type: 'like', // Beğenme bildirimi
      post: {
        content: 'Check out my latest post!',
        postImage: require('../assets/john.jpg'),
      },
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      user: {
        username: 'john',
        profileImage: require('../assets/john.jpg'),
      },
      type: 'comment', // Yorum bildirimi
      post: {
        content: 'This was a great day!',
        postImage: require('../assets/ozer.jpg'),
      },
      comment: 'Awesome post!',
      timestamp: '3 hours ago',
    },
    {
      id: '3',
      user: {
        username: 'ozer',
        profileImage: require('../assets/ozer.jpg'),
      },
      type: 'follow', // Takip bildirimi
      timestamp: '1 day ago',
    },
  ];
  