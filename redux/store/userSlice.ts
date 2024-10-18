import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    username: string | null;
    profileImage: any | null;
    followers: number;
    following: number;
    followingUsers: string[];
}

const initialState: UserState = {
    username: null,
    profileImage: null,
    followers: 527,
    following: 527,
    followingUsers: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ username: string, profileImage: any, followers: number, following: number, followingUsers: string[] }>) => {
            state.username = action.payload.username;
            state.profileImage = action.payload.profileImage;
            state.followers = action.payload.followers;
            state.following = action.payload.following;
            state.followingUsers = action.payload.followingUsers;
        },
        toggleFollow: (state, action: PayloadAction<string>) => {
            const username = action.payload;
            const isFollowing = state.followingUsers.includes(username);
            if (isFollowing) {
                state.followingUsers = state.followingUsers.filter(user => user !== username);
                state.following -= 1;
            } else {
                state.followingUsers.push(username);
                state.following += 1;
            }
        },
        updateFollowers: (state, action: PayloadAction<boolean>) => {
            if (action.payload) {
                state.followers += 1;
            } else {
                state.followers -= 1;
            }
        },
    },
});

export const { setUser, toggleFollow, updateFollowers } = userSlice.actions;
export default userSlice.reducer;
