import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Comment {
    id: string;
    text: string;
}

interface Post {
    id: string;
    username: string;
    image: any;
    content: string;
    likes: number;
    liked?: boolean;
    comments: Comment[];
}

interface PostState {
    currentPost: Post | null;
}

const initialState: PostState = {
    currentPost: null,
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setCurrentPost: (state, action: PayloadAction<Post>) => {
            state.currentPost = action.payload;
        },
        updatePostLikes: (state, action: PayloadAction<{ postId: string; likes: number; liked: boolean }>) => {
            if (state.currentPost && state.currentPost.id === action.payload.postId) {
                state.currentPost.likes = action.payload.likes;
                state.currentPost.liked = action.payload.liked;
            }
        },
        updatePostComments: (state, action: PayloadAction<{ postId: string; comments: Comment[] }>) => {
            if (state.currentPost && state.currentPost.id === action.payload.postId) {
                state.currentPost.comments = action.payload.comments;
            }
        },
    },
});

export const { setCurrentPost, updatePostLikes,updatePostComments } = postSlice.actions;
export default postSlice.reducer;
