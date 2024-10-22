import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Comment {
    id: string;
    text: string;
}

interface Post {
    id: string;
    username: string | null;
    image: any;
    content: string;
    likes: number;
    liked?: boolean;
    comments: Comment[];
}

interface PostState {
    posts: Post[];
    currentPost: Post | null;
    selectedPost: Post | null;
}

const initialState: PostState = {
    posts: [],
    currentPost: null,
    selectedPost : null,
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setCurrentPost: (state, action: PayloadAction<Post>) => {
            state.currentPost = action.payload;
        },
        addPost: (state, action: PayloadAction<Post>) => {
            state.posts.unshift(action.payload); // Yeni gönderiyi başa ekler
        },
        updatePostLikes: (state, action: PayloadAction<{ postId: string; likes: number; liked: boolean }>) => {
            const postIndex = state.posts.findIndex(post => post.id === action.payload.postId);
            if (postIndex !== -1) {
                state.posts[postIndex].likes = action.payload.likes;
                state.posts[postIndex].liked = action.payload.liked;
            }
        },
        updatePostComments: (state, action: PayloadAction<{ postId: string; comments: Comment[] }>) => {
            const post = state.posts.find(p => p.id === action.payload.postId);
            if (post) {
                post.comments = action.payload.comments;
            }
        },
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload; // Tüm gönderileri günceller
        },
        setSelectedPost: (state, action: PayloadAction<Post>) => {
            state.selectedPost = action.payload;
        },
    },
});

export const { setCurrentPost, updatePostLikes,updatePostComments, addPost, setPosts, setSelectedPost } = postSlice.actions;
export default postSlice.reducer;
