import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    username: string | null;
    profileImage: any | null;
    followers: number;
    following: number;
}

const initialState: UserState = {
    username: null,
    profileImage: null,
    followers: 527,
    following: 527,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ username: string, profileImage: any, followers: number, following: number }>) => {
            state.username = action.payload.username;
            state.profileImage = action.payload.profileImage;
            state.followers = action.payload.followers;
            state.following = action.payload.following;
        },
        clearUser: (state) => {
            state.username = null;
            state.profileImage = null;
            state.followers = 0;
            state.following = 0;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
