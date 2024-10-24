// Story verileri
export const dummyStories = [
    { id: '1', username: 'ibrahim', image: require('../assets/ibrahim.png') },
    { id: '2', username: 'ozer', image: require('../assets/ozer.jpg') },
    { id: '3', username: 'john', image: require('../assets/john.jpg') },
    { id: '4', username: 'jane', image: require('../assets/jane.jpeg') },
    { id: '5', username: 'alice', image: require('../assets/alice.jpeg') },
];

// Post verileri
export const dummyPosts = [
    {
        id: '1',
        username: 'ibrahim',
        image: require('../assets/ibrahim.png'),
        content: 'Güzel Manzara',
        likes: 150,
        liked: false,
        comments: [
            { id: '1', text: 'Amazing view!' },
            { id: '2', text: 'I wish I were there!' },
        ],
    },
    {
        id: '2',
        username: 'ozer',
        image: require('../assets/ozer.jpg'),
        content: 'Güzel Manzara',
        likes: 200,
        liked: false,
        comments: [
            { id: '1', text: 'Amazing view!' },
            { id: '2', text: 'I wish I were there!' },
        ],
    },
    {
        id: '3',
        username: 'john',
        image: require('../assets/john.jpg'),
        content: 'Güzel Manzara',
        likes: 120,
        liked: false,
        comments: [
            { id: '1', text: 'Amazing view!' },
            { id: '2', text: 'I wish I were there!' },
        ],
    },
    {
        id: '4',
        username: 'jane',
        image: require('../assets/jane.jpeg'),
        content: 'Güzel Manzara',
        likes: 300,
        liked: false,
        comments: [
            { id: '1', text: 'Amazing view!' },
            { id: '2', text: 'I wish I were there!' },
        ],
    },
    {
        id: '5',
        username: 'alice',
        image: require('../assets/alice.jpeg'),
        content: 'Güzel Manzara',
        likes: 180,
        liked: false,
        comments: [
            { id: '1', text: 'Amazing view!' },
            { id: '2', text: 'I wish I were there!' },
        ],
    },
];
